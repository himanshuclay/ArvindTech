import configureFakeBackend from './common/api/fake-backend';
import { AuthProvider, ThemeProvider } from './common/context';
import AllRoutes from './routes/Routes';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import './assets/scss/app.scss';
import './assets/scss/icons.scss';

// Initialize fake backend
configureFakeBackend();

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AllRoutes />
        <ToastContainer
        className="toast-containers"
          position="top-right"
          autoClose={30000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

