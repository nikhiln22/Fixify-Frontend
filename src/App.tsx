import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./assets/toast-overides.css";
import { LandingPage } from "./pages/LandingPage";
import { UserRoutes } from "./routes/UserRoutes";
import { TechnicianRoutes } from "./routes/TechnicianRoutes";
import { AdminRoutes } from "./routes/AdminRoutes";
import { store, persistor } from "./redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ScrollToTop } from "./components/common/ScrollToTop";
import { PageNotFound } from "./components/common/PageNotFound";

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <ScrollToTop />
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
            {/* Landing page */}
            <Route path="/" element={<LandingPage />} />

            {/* User routes */}
            <Route path="/user/*" element={<UserRoutes />} />

            {/* Technician routes */}
            <Route path="/technician/*" element={<TechnicianRoutes />} />

            {/* Admin routes */}
            <Route path="/admin/*" element={<AdminRoutes />} />

            {/* Catch all unmatched routes */}
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}

export default App;
