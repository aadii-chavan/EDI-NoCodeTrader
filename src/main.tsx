import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { propsFromUrl } from './state/propsFromUrl'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App {...propsFromUrl()} />
  </StrictMode>,
)
