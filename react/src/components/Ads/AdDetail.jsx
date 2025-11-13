import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deleteAd, getAd } from '../../api/ads';

const AdDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ad, setAd] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const me = (() => { try { return JSON.parse(localStorage.getItem('member') || 'null'); } catch { return null; } })();

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAd(id);
      setAd(data);
    } catch (e) {
      setError(e?.response?.data?.detail || 'Ошибка загрузки объявления');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const isOwner = ad && me && ad.author?.id === me.id;

  const onDelete = async () => {
    if (!window.confirm('Удалить объявление?')) return;
    try {
      await deleteAd(id);
      navigate('/');
    } catch (e) {
      setError(e?.response?.data?.detail || 'Ошибка удаления');
    }
  };

  return (
    <div data-easytag="id7-react/src/components/Ads/AdDetail.jsx" style={{ maxWidth: 800, margin: '24px auto', padding: 16 }}>
      {loading && <div>Загрузка...</div>}
      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
      {ad && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <h2 style={{ margin: 0 }}>{ad.title}</h2>
            <div style={{ fontWeight: 700, fontSize: 18 }}>{Number(ad.price).toLocaleString('ru-RU')} ₽</div>
          </div>
          <div style={{ color: '#666', marginTop: 6 }}>{ad.category} • {new Date(ad.created_at).toLocaleString('ru-RU')}</div>
          <p style={{ marginTop: 12, whiteSpace: 'pre-wrap' }}>{ad.description}</p>

          <section style={{ marginTop: 16, borderTop: '1px solid #eee', paddingTop: 12 }}>
            <h3>Контакты автора</h3>
            <div>Имя: {ad.author?.name}</div>
            <div>Телефон: {ad.author?.phone}</div>
            <div>О себе: {ad.author?.about || '—'}</div>
            <div>На сайте с: {ad.author?.registered_at ? new Date(ad.author.registered_at).toLocaleString('ru-RU') : '—'}</div>
            <div style={{ marginTop: 8 }}>Контактный телефон объявления: {ad.contact_phone}</div>
          </section>

          <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
            <Link to="/" style={{ padding: '8px 12px' }}>На главную</Link>
            {isOwner && (
              <>
                <Link to={`/ads/${ad.id}/edit`} style={{ padding: '8px 12px' }}>Редактировать</Link>
                <button onClick={onDelete} style={{ padding: '8px 12px' }}>Удалить</button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdDetail;
