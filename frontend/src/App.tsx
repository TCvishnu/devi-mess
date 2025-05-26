import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import UserLayout from "./components/user/UserLayout"
import UserDashboard from "./pages/UserDashboard"
import UserSettings from "./pages/UserSettings"
import UserFees from "./pages/UserFees"
import LoginPage from "./pages/auth/LoginPage"
import RegisterPage from "./pages/auth/RegisterPage"
import ProfileCompletePage from "./pages/user/ProfileCompletePage"
import AuthProvider from "./contexts/AuthContext"
import AdminLayout from "./pages/admin/AdminLayout"

function App() {
	return (
		<AuthProvider>
			<Router>
				<Routes>
					<Route path="/user/:userID" element={<UserLayout />}>
						<Route index element={<UserDashboard />} />
						<Route path="settings" element={<UserSettings />} />
						<Route path="fees" element={<UserFees />} />
					</Route>
					<Route path="/" element={<LoginPage />} />
					<Route path="/register" element={<RegisterPage />} />
					<Route
						path="/complete-profile"
						element={<ProfileCompletePage />}
					/>
					<Route path="/admin" element={<AdminLayout />} />
				</Routes>
			</Router>
		</AuthProvider>
	)
}

export default App
