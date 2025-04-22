import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./assets/toast-overides.css";
import { LandingPage } from "./pages/LandingPage";
import { UserRoutes } from "./routes/user/UserRoutes";
import { TechnicianRoutes } from "./routes/technician/TechnicianRoutes";
import { AdminRoutes } from "./routes/admin/AdminRoutes";

function App() {
  return (
    <>
      <BrowserRouter>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          closeButton={false}
          theme="light"
        />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          </Routes> 

          <UserRoutes />

          <TechnicianRoutes />

          <AdminRoutes />
      </BrowserRouter>
    </>
  );
}

export default App;
