import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initPwaInstall, registerServiceWorker } from './utils/pwa.js'

initPwaInstall();
registerServiceWorker();

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>,
)
