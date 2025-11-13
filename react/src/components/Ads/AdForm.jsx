import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createAd, getAd, updateAd } from '../../api/ads';

const empty = { title: '', description: '', price: '', contact_phone: '', category: '' };

const AdForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      if (!isEdit) return;
      setLoading(true);
      setError('');
      try {
        const data = await getAd(id);
        setForm({
          title: data.title || '',
          description: data.description || '',
          price: data.price || '',
          contact_phone: data.contact_phone || '',
          category: data.category || '',
        });
      } catch (e) {
        setError(e?.response?.data?.detail || 'Ошибка загрузки объявления');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, isEdit]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isEdit) {
        const updated = await updateAd(id, form);
        navigate(`/ads/${updated.id}`);
      } else {
        const created = await createAd(form);
        navigate(`/ads/${created.id}`);
      }
    } catch (e) {
      const data = e?.response?.data;
      setError(data?.detail || Object.values(data || {}).join(', ') || 'Ошибка сохранения');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-easytag="id6-react/src/components/Ads/AdForm.jsx" style={{ maxWidth: 720, margin: '24px auto', padding: 16 }}>
      <h2>{isEdit ? 'Редактирование объявления' : 'Новое объявление'}</h2>
      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
      {loading && <div>Загрузка...</div>}
      <form onSubmit={onSubmit}>
        <label>Название</label>
        <input name="title" value={form.title} onChange={onChange} required style={{ width: '100%', padding: 8, marginBottom: 8 }} />
        <label>Описание</label>
        <textarea name="description" value={form.description} onChange={onChange} rows={6} required style={{ width: '100%', padding: 8, marginBottom: 8 }} />
        <label>Цена</label>
        <input type="number" name="price" value={form.price} onChange={onChange} required style={{ width: '100%', padding: 8, marginBottom: 8 }} />
        <label>Контактный телефон</label>
        <input name="contact_phone" value={form.contact_phone} onChange={onChange} required style={{ width: '100%', padding: 8, marginBottom: 8 }} />
        <label>Категория</label>
        <select name="category" value={form.category} onChange={onChange} required style={{ width: '100%', padding: 8, marginBottom: 12 }}>
          <option value="">Выберите категорию</option>
          <option value="Автомобили">Автомобили</option>
          <option value="Недвижимость">Недвижимость</option>
        </select>
        <button type="submit" disabled={loading} style={{ padding: '8px 12px' }}>{isEdit ? 'Сохранить' : 'Опубликовать'}</button>
      </form>
    </div>
  );
};

export default AdForm;
