import { BrowserRouter, Routes, Route } from "react-router-dom";

import UserLayout from "./components/user/UserLayout";
import UserDashboard from "./pages/UserDashboard";
import UserSettings from "./pages/UserSettings";
import UserFees from "./pages/UserFees";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/user/:userID" element={<UserLayout />}>
          <Route index element={<UserDashboard />} />
          <Route path="settings" element={<UserSettings />} />
          <Route path="fees" element={<UserFees />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
