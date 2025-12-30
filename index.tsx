
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

console.log("index.tsx starting...");

const renderApp = () => {
  try {
    const container = document.getElementById('root');
    if (!container) throw new Error("Root element not found");

    console.log("Found root, rendering...");
    const root = ReactDOM.createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("App rendered successfully!");
  } catch (error) {
    console.error("Render error:", error);
    const display = document.getElementById('error-display');
    if (display) {
      display.style.display = 'block';
      display.innerText = "حدث خطأ أثناء التشغيل: " + (error as Error).message;
    }
  }
};

// تشغيل فوري
if (document.readyState === 'complete') {
  renderApp();
} else {
  window.addEventListener('load', renderApp);
}
