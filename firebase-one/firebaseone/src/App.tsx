import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import "./App.css";

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

// Auth Pages
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Client Routes */}
            <Route path="/client" element={<ClientDashboard />} />
            <Route path="/client/chat" element={<ClientChat />} />
            <Route path="/client/plans" element={<ClientPlans />} />
            <Route path="/client/profile" element={<ClientProfile />} />

            {/* Coach Routes */}
            <Route path="/coach" element={<CoachDashboard />} />
            <Route path="/coach/clients" element={<CoachClientList />} />
            <Route path="/coach/plans" element={<CoachPlanManagement />} />
            <Route path="/coach/chat" element={<CoachChat />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
