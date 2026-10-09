import React from 'react'
import ReactDOM from 'react-dom/client'
import App from "./App";
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from './store/CartContext.jsx';
import { NotificationProvider } from './store/NotificationContext.jsx'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <NotificationProvider> 
        <CartProvider>  
          <App />
        </CartProvider>
      </NotificationProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
