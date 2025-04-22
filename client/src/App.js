import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Login from "./Pages/Login.js";
import RegisterPage from "./Pages/RegisterPage.js";
import Navbar from "./Components/Layout/CustomNavbar.js";
import Home from "./Pages/Home.js";
import UpdatePassword from "./Pages/Updatepassword.js";
import RegisterMarket from "./Pages/RegisterMarket.js";
import RegisterStore from "./Pages/RegisterStore.js";
import AdminDashboard from "./Pages/AdminDashboard.js";
import ProtectedRoute from "./Components/Misc/ProtectedRoute.js";
import {
  UserProvider,
  useUserContext,
} from "./Components/Context/MyContext.js";
import UserDashboard from "./Pages/UserDashboard.js";
import UserImageUploads from "./Pages/UserImageUploads.js";
import Tracking from "./Pages/Tracking.js";
import Upload from "./Pages/Upload.js";
import Xbm from "./Pages/Xbm.js";
import Tradein from "./Pages/Tradein.js";
import Rma from "./Pages/Rma.js";
// import Xbmpage from "./Pages/Xbmpage.js";
const AppContent = () => {
  const { isAuthenticated, userData, loading } = useUserContext();
  const location = useLocation();

  if (loading) {
    return <loadingSpinner />;
  }

  return (
    <>
      {isAuthenticated && location.pathname !== "/" && <Navbar />}
      <Routes>
        {/* Public routes */}
        <Route
          path="/"
          element={
            isAuthenticated && userData && userData.role ? (
              <Navigate
                to={
                  userData.role === "user"
                    ? "/userDashboard"
                    : "/adminDashboard"
                }
                replace
              />
            ) : (
              <Login />
            )
          }
        />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/resetpassword" element={<UpdatePassword />} />
        <Route
          path="/userimageupload/:key/:value"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <UserImageUploads />
            </ProtectedRoute>
          }
        />

        {/* Private routes */}
        <Route
          path="/userDashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tracking"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Tracking />
            </ProtectedRoute>
          }
        />

        <Route
          path="/uploads"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Upload />
            </ProtectedRoute>
          }
        />

        <Route
          path="/rmapage/:paramed_store_name"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Rma />
            </ProtectedRoute>
          }
        />
        
        {userData?.role === "user" && (
          <>
            <Route
              path="/rmapage"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Rma />
                </ProtectedRoute>
              }
            />

            <Route
              path="/xbmpage"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <xbm />
                </ProtectedRoute>
              }
            />

            <Route
              path="/tradeinpage"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Tradein />
                </ProtectedRoute>
              }
            />
          </>
        )}

        <Route
          path="/registerstore"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <RegisterStore />
            </ProtectedRoute>
          }
        />
        <Route
          path="/registermarket"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <RegisterMarket />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adminDashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} isAdmin>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        {/* Catch-all route */}
        <Route
          path="*"
          element={
            <Navigate to={isAuthenticated ? "/userDashboard" : "/"} replace />
          }
        />
      </Routes>
    </>
  );
};

const App = () => (
  <BrowserRouter>
    <UserProvider>
      <AppContent />
    </UserProvider>
  </BrowserRouter>
);

export default App;
