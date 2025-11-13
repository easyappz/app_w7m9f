import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div data-easytag="id1-react/src/components/Auth/Login.jsx" style={{ maxWidth: 480, margin: '0 auto', padding: 16 }}>
      <h1 style={{ marginTop: 0 }}>Вход</h1>
      <p>Страница входа. Функционал будет добавлен позже.</p>
      <div style={{ marginTop: 12 }}>
        <Link to="/">На главную</Link>
      </div>
    </div>
  );
};

export default Login;
