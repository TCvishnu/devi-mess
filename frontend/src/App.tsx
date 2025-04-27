import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import LoginPage from "./pages/auth/LoginPage"
import RegisterPage from "./pages/auth/RegisterPage"
import ProfileCompletePage from "./pages/user/ProfileCompletePage"
import AuthProvider from "./context/AuthContext"

function App() {
	return (
		<div className=" w-full ">
			<AuthProvider>
				<Router>
					<Routes>
						<Route path="/login" element={<LoginPage />} />
						<Route path="/register" element={<RegisterPage />} />
						<Route
							path="/complete-profile"
							element={<ProfileCompletePage />}
						/>
					</Routes>
				</Router>
			</AuthProvider>
		</div>
	)
}

export default App
