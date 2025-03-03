import configureFakeBackend from './common/api/fake-backend';
import { AuthProvider, ThemeProvider } from './common/context';
import AllRoutes from './routes/Routes';
import { ToastContainer } from 'react-toastify';
// import { Tooltip } from 'react-tooltip';

import 'react-toastify/dist/ReactToastify.css';
import './assets/scss/app.scss';
import './assets/scss/icons.scss';
import 'react-tooltip/dist/react-tooltip.css'
import 'flatpickr/dist/themes/material_green.css';
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
          autoClose={10000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
        {/* <Tooltip id="tooltip" style={{ zIndex: 1002}} /> */}
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

