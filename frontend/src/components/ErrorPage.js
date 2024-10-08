import React from "react";

const ErrorPage = ({ message }) => {
  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "/";
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-100">
      <div className="bg-white p-8 shadow-lg rounded-lg text-center">
        <h2 className="text-4xl font-bold text-red-500 mb-4">Error</h2>
        <p className="text-lg">{message}</p>
        <button
          onClick={() => handleGoBack()}
          className="mt-6 bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
//usage
//<ErrorPage message="Not enough coins to complete the purchase." />
