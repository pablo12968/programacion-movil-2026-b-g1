import { setupIonicReact } from '@ionic/react';
import { createRoot } from 'react-dom/client';
import App from './app/App';

setupIonicReact();

createRoot(document.getElementById('root') as HTMLElement).render(<App />);
