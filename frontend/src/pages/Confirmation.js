import React from 'react';
import Header from '../components/Header';

const Confirmation = () => {
  return (
    <div>
      <Header />
      <main className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Thank You!</h2>
        <p>Your order has been confirmed. You will receive a confirmation email shortly.</p>
        <p>Continue shopping: <a href="/" className="text-primary hover:underline">Shop More</a></p>
      </main>
    </div>
  );
};

export default Confirmation;
