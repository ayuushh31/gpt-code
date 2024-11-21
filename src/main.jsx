import {StrictMode}  from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import ContextProvider from './context/Context.jsx'
import { Auth0Provider } from '@auth0/auth0-react';
createRoot(document.getElementById('root')).render(
<ContextProvider>
<Auth0Provider
    domain="dev-w558astza2ur7okd.us.auth0.com"
    clientId="mBRJ3PvRYfCQdbNBc7OOXgcjzUkUyv1C"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >

    <App />
  
  </Auth0Provider>
  </ContextProvider>,
)
