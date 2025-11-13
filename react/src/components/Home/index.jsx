import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { listAds } from '../../api/ads';

export const Home = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    price_min: searchParams.get('price_min') || '',
    price_max: searchParams.get('price_max') || '',
    date_from: searchParams.get('date_from') || '',
    date_to: searchParams.get('date_to') || '',
    search: searchParams.get('search') || '',
  });

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listAds(filters);
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e?.response?.data?.detail || 'Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
    setSearchParams(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.category, filters.price_min, filters.price_max, filters.date_from, filters.date_to, filters.search]);

  useEffect(() => { load(); /* load on mount and when filters in URL change*/ }, [searchParams.toString()]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({ category: '', price_min: '', price_max: '', date_from: '', date_to: '', search: '' });
  };

  return (
    <div data-easytag="id1-react/src/components/Home/index.jsx" style={{ maxWidth: 1000, margin: '0 auto', padding: 16 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>Доска объявлений</h1>
        <nav>
          {token ? (
            <>
              <Link to="/profile" style={{ marginRight: 12 }}>Профиль</Link>
              <Link to="/ads/new" style={{ marginRight: 12 }}>Создать объявление</Link>
            </>
          ) : (
            <>
              <Link to="/login" style={{ marginRight: 12 }}>Войти</Link>
              <Link to="/register">Регистрация</Link>
            </>
          )}
        </nav>
      </header>

      <section style={{ border: '1px solid #e5e5e5', borderRadius: 8, padding: 12, marginBottom: 16 }}>
        <h2 style={{ marginTop: 0 }}>Фильтры</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 6 }}>Категория</label>
            <select name="category" value={filters.category} onChange={onChange} style={{ width: '100%', padding: 8 }}>
              <option value="">Все</option>
              <option value="Автомобили">Автомобили</option>
              <option value="Недвижимость">Недвижимость</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6 }}>Поиск по названию</label>
            <input name="search" value={filters.search} onChange={onChange} placeholder="Введите название" style={{ width: '100%', padding: 8 }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6 }}>Цена от</label>
            <input type="number" name="price_min" value={filters.price_min} onChange={onChange} placeholder="0" style={{ width: '100%', padding: 8 }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6 }}>Цена до</label>
            <input type="number" name="price_max" value={filters.price_max} onChange={onChange} placeholder="100000" style={{ width: '100%', padding: 8 }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6 }}>Дата с</label>
            <input type="datetime-local" name="date_from" value={filters.date_from} onChange={onChange} style={{ width: '100%', padding: 8 }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6 }}>Дата по</label>
            <input type="datetime-local" name="date_to" value={filters.date_to} onChange={onChange} style={{ width: '100%', padding: 8 }} />
          </div>
        </div>
        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          <button onClick={load} style={{ padding: '8px 12px' }}>Найти</button>
          <button onClick={resetFilters} style={{ padding: '8px 12px' }}>Сбросить</button>
        </div>
      </section>

      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
      {loading ? (
        <div>Загрузка...</div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 12 }}>
          {items.map((ad) => (
            <li key={ad.id} style={{ border: '1px solid #e5e5e5', borderRadius: 8, padding: 12 }} data-easytag={`id2-react/src/components/Home/index.jsx-${ad.id}`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <Link to={`/ads/${ad.id}`} style={{ fontSize: 18, fontWeight: 600 }}>{ad.title}</Link>
                <div style={{ fontWeight: 700 }}>{Number(ad.price).toLocaleString('ru-RU')} ₽</div>
              </div>
              <div style={{ color: '#666', marginTop: 6 }}>{ad.category} • {new Date(ad.created_at).toLocaleString('ru-RU')}</div>
              <div style={{ marginTop: 8 }}>Автор: {ad.author?.name} • {ad.author?.phone}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
