import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserDashboard from "./pages/UserDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* User routes */}
        <Route path="/user/:id" element={<UserDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
