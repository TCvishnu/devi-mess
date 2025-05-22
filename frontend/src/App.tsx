import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import UserLayout from "./components/user/UserLayout";
import UserDashboard from "./pages/UserDashboard";
import UserSettings from "./pages/UserSettings";
import UserFees from "./pages/UserFees";
import LoginPage from "./pages/auth/LoginPage"
import RegisterPage from "./pages/auth/RegisterPage"
import OTPVerification from "./pages/auth/OTPVerification"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/user/:userID" element={<UserLayout />}>
          <Route index element={<UserDashboard />} />
          <Route path="settings" element={<UserSettings />} />
          <Route path="fees" element={<UserFees />} />
        </Route>
		<Route path="/login" element={<LoginPage />} />
		<Route path="/register" element={<RegisterPage />} />
		<Route path="/otp-verification" element={<OTPVerification />}/>
      </Routes>
    </Router>
  );
}

export default App
