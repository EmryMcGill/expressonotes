import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import '@fontsource/nunito';
import '@fontsource/nunito/200.css';
import '@fontsource/nunito/500.css';

import { PbProvider } from './pb/PbContext.jsx';

createRoot(document.getElementById('root')).render(
  <PbProvider>
    <App />
  </PbProvider>
)