import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import RouteComponent from './route'

createRoot(document.getElementById('root')).render(
  <RouteComponent />,
)
