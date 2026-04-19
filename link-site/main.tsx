import { createRoot } from 'react-dom/client';
import { LinkerApp } from '../src/linker/LinkerApp';
import './link-site.css';

createRoot(document.getElementById('root')!).render(<LinkerApp />);
