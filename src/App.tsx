
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/User/auth/Register';
import Login from './pages/User/auth/Login'
import Otp from './pages/User/auth/Otp';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <BrowserRouter>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/otp' element={<Otp />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App