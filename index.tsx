
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

console.log("React Application Initializing...");

const start = () => {
  const container = document.getElementById('root');
  if (container) {
    const root = ReactDOM.createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("React App Mounted Successfully");
  } else {
    console.error("Critical Error: Root container not found!");
  }
};

// التأكد من تحميل الصفحة بالكامل قبل التشغيل
if (document.readyState === 'complete') {
  start();
} else {
  window.addEventListener('load', start);
}
