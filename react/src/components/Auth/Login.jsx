import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../api/auth';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('member', JSON.stringify(data.member));
      navigate('/profile');
    } catch (e) {
      setError(e?.response?.data?.detail || 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-easytag="id3-react/src/components/Auth/Login.jsx" style={{ maxWidth: 420, margin: '40px auto', padding: 16 }}>
      <h2>Вход</h2>
      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
      <form onSubmit={onSubmit}>
        <label>Логин</label>
        <input name="username" value={form.username} onChange={onChange} style={{ width: '100%', padding: 8, marginBottom: 8 }} />
        <label>Пароль</label>
        <input type="password" name="password" value={form.password} onChange={onChange} style={{ width: '100%', padding: 8, marginBottom: 12 }} />
        <button type="submit" disabled={loading} style={{ padding: '8px 12px' }}>{loading ? 'Входим...' : 'Войти'}</button>
      </form>
      <div style={{ marginTop: 12 }}>
        Нет аккаунта? <Link to="/register">Зарегистрируйтесь</Link>
      </div>
    </div>
  );
};

export default Login;
