
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

const init = () => {
  try {
    const rootElement = document.getElementById('root');
    if (!rootElement) return;

    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (err) {
    console.error("Failed to render app:", err);
    const errorDisplay = document.getElementById('error-display');
    if (errorDisplay) {
      errorDisplay.style.display = 'block';
      errorDisplay.innerText = "فشل في تشغيل المتجر: " + (err as Error).message;
    }
  }
};

// الانتظار قليلاً للتأكد من تحميل كافة التبعيات
if (document.readyState === 'complete') {
  init();
} else {
  window.addEventListener('load', init);
}
