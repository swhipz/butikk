import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import "./App.css";
import ProtectedRoute from "./components/ProtectedRoute";
import Navigation from "./components/Navigation";

// Client Pages
import ClientDashboard from "./pages/Client/Dashboard";
import ClientChat from "./pages/Client/Chat";
import ClientPlans from "./pages/Client/Plans";
import ClientProfile from "./pages/Client/Profile";

// Coach Pages
import CoachDashboard from "./pages/Coach/Dashboard";
import CoachClientList from "./pages/Coach/ClientList";
import CoachPlanManagement from "./pages/Coach/PlanManagement";
import CoachChat from "./pages/Coach/Chat";
import CoachProfile from "./pages/Coach/Profile";

// Auth Pages
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-container">
          <Navigation />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Coach Routes */}
              <Route
                path="/coach"
                element={
                  <ProtectedRoute requiredRole="coach">
                    <CoachDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/coach/chat"
                element={
                  <ProtectedRoute requiredRole="coach">
                    <CoachChat />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/coach/clients"
                element={
                  <ProtectedRoute requiredRole="coach">
                    <CoachClientList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/coach/plans"
                element={
                  <ProtectedRoute requiredRole="coach">
                    <CoachPlanManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/coach/profile"
                element={
                  <ProtectedRoute requiredRole="coach">
                    <CoachProfile />
                  </ProtectedRoute>
                }
              />

              {/* Client Routes */}
              <Route
                path="/client"
                element={
                  <ProtectedRoute requiredRole="client">
                    <ClientDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/client/chat"
                element={
                  <ProtectedRoute requiredRole="client">
                    <ClientChat />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/client/plans"
                element={
                  <ProtectedRoute requiredRole="client">
                    <ClientPlans />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/client/profile"
                element={
                  <ProtectedRoute requiredRole="client">
                    <ClientProfile />
                  </ProtectedRoute>
                }
              />

              {/* Default Route */}
              <Route path="/" element={<Navigate to="/login" replace />} />

              {/* Catch all route for 404 */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
