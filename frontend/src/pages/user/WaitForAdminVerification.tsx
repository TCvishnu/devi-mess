import { Icon } from "@iconify/react"
import { FC } from "react"

const WaitingForAdminVerification: FC = () => {
	// Need to check whether admin verified or not
	//Send request to admin verified middleware

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
			<div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
				<Icon
					icon="mdi:shield-check"
					className="text-accent mx-auto mb-4"
					width="48"
					height="48"
				/>
				<h1 className="text-2xl font-semibold text-gray-800 mb-2">
					Waiting for Admin Verification
				</h1>
				<p className="text-gray-600 mb-6">
					You can start using Devi Services once admin has verified
				</p>
				<div className="flex justify-center mb-4">
					<Icon
						icon="mdi:loading"
						className="animate-spin text-primary"
						width="32"
						height="32"
					/>
				</div>
				<p className="text-sm text-gray-400 animate-pulse">
					You'll be redirected automatically once verified.
				</p>
			</div>
		</div>
	)
}

export default WaitingForAdminVerification
