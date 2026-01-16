import React from 'react';
import OrdersList from '../components/OrdersList';
import DeliveryMap from '../components/DeliveryMap';

export default function Dashboard() {
  return (
    <div className="dashboard">
      <h1>Ordering Dashboard</h1>
      <div className="grid">
        <OrdersList />
        <DeliveryMap />
      </div>
    </div>
  );
}
