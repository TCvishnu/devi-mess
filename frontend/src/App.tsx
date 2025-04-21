import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import LoginPage from "./pages/auth/LoginPage"
import RegisterPage from "./pages/auth/RegisterPage"
import OTPVerification from "./pages/auth/OTPVerification"

function App() {
	return (
		<div className=" w-full ">
			<Router>
				<Routes>
					<Route path="/login" element={<LoginPage />} />
					<Route path="/register" element={<RegisterPage />} />
					<Route
						path="/otp-verification"
						element={<OTPVerification />}
					/>
				</Routes>
			</Router>
		</div>
	)
}

export default App
