import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserLogin } from "./pages/User/auth/UserLogin";
import { UserRegister } from "./pages/User/auth/UserRegister";
import { LandingPage } from "./pages/LandingPage";
import { UserOtp } from "./pages/User/auth/UserOtp";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { UserPrivateRoute } from "./routes/user/UserPrivateRoute";
import { UserPublicRoute } from "./routes/user/UserPublicRoute";
import { TechnicianPublicRoute } from "./routes/technician/TechnicianPublicRoute";
import { TechnicianLogin } from "./pages/Technician/auth/TechnicianLogin";
import { TechnicianRegister } from "./pages/Technician/auth/TechnicianRegister";
import { AdminPublicRoute } from "./routes/admin/AdminPublicRoute";
import { AdminLogin } from "./pages/Admin/auth/AdminLogin";
import { TechnicianOtp } from "./pages/Technician/auth/TechnicianOtp";
import { UserForgotPassword } from "./pages/User/auth/UserForgotPassword";
import { TechnicianForgotPassword } from "./pages/Technician/auth/TechnicianForgotPassword";
import { UserResetPassword } from "./pages/User/auth/UserResetPassword";
import { TechnicianResetPassword } from "./pages/Technician/auth/TechnicianResetPassword";

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
          <Route path="/" element={<LandingPage />} />

          {/* user routes */}
          <Route element={<UserPublicRoute />}>
            <Route path="/user/login" element={<UserLogin />} />
            <Route path="/user/register" element={<UserRegister />} />
            <Route path="/user/otp" element={<UserOtp />} />
            <Route
              path="/user/forgotpassword"
              element={<UserForgotPassword />}
            />
            <Route path="/user/resetpassword" element={<UserResetPassword />} />
          </Route>

          {/* technician routes */}
          <Route element={<TechnicianPublicRoute />}>
            <Route path="/technician/login" element={<TechnicianLogin />} />
            <Route
              path="/technician/register"
              element={<TechnicianRegister />}
            />
            <Route path="/technician/otp" element={<TechnicianOtp />} />
            <Route
              path="/technician/forgotpassword"
              element={<TechnicianForgotPassword />}
            />
            <Route
              path="/technician/resetpassword"
              element={<TechnicianResetPassword />}
            />
          </Route>

          {/* admin routes */}
          <Route element={<AdminPublicRoute />}>
            <Route path="/admin/login" element={<AdminLogin />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
