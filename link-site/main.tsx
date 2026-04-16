import { createRoot } from 'react-dom/client';
import { LinkerApp } from '../src/linker/LinkerApp';
import '../src/styles/toolkit.css';
import '../src/linker/link.css';

createRoot(document.getElementById('root')!).render(<LinkerApp />);
