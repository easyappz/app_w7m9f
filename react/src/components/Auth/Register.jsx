import React from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
  return (
    <div data-easytag="id1-react/src/components/Auth/Register.jsx" style={{ maxWidth: 480, margin: '0 auto', padding: 16 }}>
      <h1 style={{ marginTop: 0 }}>Регистрация</h1>
      <p>Страница регистрации. Функционал будет добавлен позже.</p>
      <div style={{ marginTop: 12 }}>
        <Link to="/">На главную</Link>
      </div>
    </div>
  );
};

export default Register;
