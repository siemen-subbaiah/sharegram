import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { QueryClient, QueryClientProvider } from 'react-query';
import AuthState from './context/AuthState';

const queryClient = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthState>
        <App />
      </AuthState>
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
