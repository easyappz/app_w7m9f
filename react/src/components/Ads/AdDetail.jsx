import React from 'react';
import { Link, useParams } from 'react-router-dom';

const AdDetail = () => {
  const { id } = useParams();
  return (
    <div data-easytag="id1-react/src/components/Ads/AdDetail.jsx" style={{ maxWidth: 800, margin: '0 auto', padding: 16 }}>
      <h1 style={{ marginTop: 0 }}>Объявление #{id}</h1>
      <p>Страница объявления. Функционал будет добавлен позже.</p>
      <div style={{ marginTop: 12 }}>
        <Link to="/">На главную</Link>
      </div>
    </div>
  );
};

export default AdDetail;
