import React from 'react';
import { Link } from 'react-router-dom';

const Profile = () => {
  return (
    <div data-easytag="id1-react/src/components/Profile/Profile.jsx" style={{ maxWidth: 720, margin: '0 auto', padding: 16 }}>
      <h1 style={{ marginTop: 0 }}>Профиль</h1>
      <p>Страница профиля пользователя. Функционал будет добавлен позже.</p>
      <div style={{ marginTop: 12 }}>
        <Link to="/">На главную</Link>
      </div>
    </div>
  );
};

export default Profile;
