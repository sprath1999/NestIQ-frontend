import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/shared/Layout";

// Auth pages

// Dashboard pages
import AdminDashboard from "./features/dashboard/pages/AdminDashboard";
import ResidentDashboard from "./features/dashboard/pages/ResidentDashboard";
import GuardDashboard from "./features/dashboard/pages/GuardDashboard";
import { useAppSelector } from "./store/hook";
import type { JSX } from "react/jsx-runtime";
import Login from "./features/auth/pages/login";
import Register from "./features/auth/pages/register";
import ResidentComplaints from "./features/complaints/pages/ResidentComplaints";
import AdminComplaints from "./features/complaints/pages/AdminComplaints";
import ResidentAmenities from "./features/amenities/pages/ResidentAmenities";
import NoticeBoard from "./features/notices/pages/NoticeBoard";

function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: JSX.Element;
  allowedRoles: string[];
}) {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user?.role || ""))
    return <Navigate to="/login" replace />;

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="complaints" element={<AdminComplaints />} />
          <Route path="notices" element={<NoticeBoard />} />
        </Route>

        {/* Resident routes */}
        <Route
          path="/resident"
          element={
            <ProtectedRoute allowedRoles={["RESIDENT"]}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ResidentDashboard />} />
          <Route path="amenities" element={<ResidentAmenities />} />
          <Route path="complaints" element={<ResidentComplaints />} />
          <Route path="notices" element={<NoticeBoard />} />
        </Route>

        {/* Guard routes */}
        <Route
          path="/guard"
          element={
            <ProtectedRoute allowedRoles={["GUARD"]}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<GuardDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
