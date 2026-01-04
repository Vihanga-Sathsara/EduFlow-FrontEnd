import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="1056138550906-q7hnommqs55po9jcofl90b4chltln6ul.apps.googleusercontent.com" >
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
)
