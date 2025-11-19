import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import ErrorBoundary from './ErrorBoundary';

console.log('main.tsx: Iniciando aplicación...');

const container = document.getElementById('root');
if (!container) {
  console.error('main.tsx: No se encontró el contenedor root');
  throw new Error('Failed to find the root element');
}

console.log('main.tsx: Contenedor encontrado, creando root...');

try {
  const root = createRoot(container);
  console.log('main.tsx: Root creado, renderizando App...');
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
  console.log('main.tsx: App renderizado exitosamente');
} catch (error) {
  console.error('main.tsx: Error al renderizar:', error);
  container.innerHTML = `
    <div style="padding: 20px; color: red;">
      <h1>Error al cargar la aplicación</h1>
      <p>${error instanceof Error ? error.message : String(error)}</p>
      <pre>${error instanceof Error ? error.stack : ''}</pre>
    </div>
  `;
}