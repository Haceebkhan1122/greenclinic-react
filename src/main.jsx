import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import { PrimeReactProvider } from 'primereact/api';
import '../src/assets/css/global.scss';
import { ToastContainer, toast } from 'react-toastify';
import { Provider } from 'react-redux';
import { persistor, store } from './redux/store/index.js';
import { PersistGate } from 'redux-persist/integration/react';

createRoot(document.getElementById('root')).render(
  <BrowserRouter >
    <PrimeReactProvider>
      <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
      </Provider>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        draggable
        theme="dark"
      />
    </PrimeReactProvider>
  </BrowserRouter >
)
