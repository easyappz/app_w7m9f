import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMe, updateMe } from '../../api/profile';

const Profile = () => {
  const [data, setData] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', about: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const me = await getMe();
      setData(me);
      setForm({ name: me.name || '', phone: me.phone || '', about: me.about || '' });
    } catch (e) {
      setError(e?.response?.data?.detail || 'Ошибка загрузки профиля');
      if (e?.response?.status === 401) navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSave = async (e) => {
    e.preventDefault();
    setSaved(false);
    setError('');
    try {
      const updated = await updateMe(form);
      setData(updated);
      setSaved(true);
      localStorage.setItem('member', JSON.stringify(updated));
    } catch (e) {
      setError(e?.response?.data?.detail || 'Ошибка сохранения');
    }
  };

  const onLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('member');
    navigate('/');
  };

  return (
    <div data-easytag="id5-react/src/components/Profile/Profile.jsx" style={{ maxWidth: 640, margin: '24px auto', padding: 16 }}>
      <h2>Профиль</h2>
      {loading && <div>Загрузка...</div>}
      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
      {data && (
        <>
          <div style={{ color: '#666', marginBottom: 8 }}>Дата регистрации: {new Date(data.registered_at).toLocaleString('ru-RU')}</div>
          <form onSubmit={onSave}>
            <label>Имя</label>
            <input name="name" value={form.name} onChange={onChange} style={{ width: '100%', padding: 8, marginBottom: 8 }} />
            <label>Телефон</label>
            <input name="phone" value={form.phone} onChange={onChange} style={{ width: '100%', padding: 8, marginBottom: 8 }} />
            <label>О себе</label>
            <textarea name="about" value={form.about} onChange={onChange} rows={4} style={{ width: '100%', padding: 8, marginBottom: 12 }} />
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit" style={{ padding: '8px 12px' }}>Сохранить</button>
              <button type="button" onClick={onLogout} style={{ padding: '8px 12px' }}>Выйти</button>
            </div>
            {saved && <div style={{ color: 'green', marginTop: 8 }}>Сохранено</div>}
          </form>
        </>
      )}
    </div>
  );
};

export default Profile;
