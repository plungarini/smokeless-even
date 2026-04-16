import { createRoot } from 'react-dom/client';
import App from './App';
import './app.css';
// Bootstrap the glasses/HUD layer as a side-effect import. Vite bundles
// both entries into a single module graph via this import — the glasses
// layer does NOT import from React nor vice versa; the shared state lives
// in `./app/store`.
import './glasses-main';

createRoot(document.getElementById('root')!).render(<App />);
