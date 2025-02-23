// src/components/AlertBix.jsx
import 'react';

// eslint-disable-next-line react/prop-types
const AlertBix = ({ message, type }) => {
  if (!message) return null;

  const bgClass = type === "error"
    ? "bg-red-100 text-red-700"
    : "bg-green-100 text-green-700";

  return (
    <div className={`p-3 mb-4 rounded ${bgClass}`}>
      {message}
    </div>
  );
};

export default AlertBix;
