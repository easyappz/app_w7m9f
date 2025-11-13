import React from 'react';
import { Link, useParams } from 'react-router-dom';

const AdForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  return (
    <div data-easytag="id1-react/src/components/Ads/AdForm.jsx" style={{ maxWidth: 720, margin: '0 auto', padding: 16 }}>
      <h1 style={{ marginTop: 0 }}>{isEdit ? 'Редактировать объявление' : 'Создать объявление'}</h1>
      <p>Форма объявления. Функционал будет добавлен позже.</p>
      <div style={{ marginTop: 12 }}>
        <Link to="/">На главную</Link>
      </div>
    </div>
  );
};

export default AdForm;
