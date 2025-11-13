import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../api/auth';

const Register = () => {
  const [form, setForm] = useState({ username: '', password: '', name: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/login');
    } catch (e) {
      const data = e?.response?.data;
      setError(data?.detail || Object.values(data || {}).join(', ') || 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-easytag="id4-react/src/components/Auth/Register.jsx" style={{ maxWidth: 420, margin: '40px auto', padding: 16 }}>
      <h2>Регистрация</h2>
      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
      <form onSubmit={onSubmit}>
        <label>Логин</label>
        <input name="username" value={form.username} onChange={onChange} style={{ width: '100%', padding: 8, marginBottom: 8 }} />
        <label>Пароль</label>
        <input type="password" name="password" value={form.password} onChange={onChange} style={{ width: '100%', padding: 8, marginBottom: 8 }} />
        <label>Имя</label>
        <input name="name" value={form.name} onChange={onChange} style={{ width: '100%', padding: 8, marginBottom: 8 }} />
        <label>Телефон</label>
        <input name="phone" value={form.phone} onChange={onChange} style={{ width: '100%', padding: 8, marginBottom: 12 }} />
        <button type="submit" disabled={loading} style={{ padding: '8px 12px' }}>{loading ? 'Регистрируем...' : 'Зарегистрироваться'}</button>
      </form>
      <div style={{ marginTop: 12 }}>
        Уже есть аккаунт? <Link to="/login">Войти</Link>
      </div>
    </div>
  );
};

export default Register;
