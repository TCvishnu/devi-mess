import { FormEvent, useState } from "react"
import ProfileCompleteForm from "../../components/user/form/ProfileCompleteForm"
import { ProfileCompleteFormData } from "../../types/user"
import { Icon } from "@iconify-icon/react/dist/iconify.mjs"

const ProfileCompletePage = () => {
	const [pending, setPending] = useState<boolean>(false)
	const [disable, setDisable] = useState<boolean>(false)

	const handleSubmit = (
		event: FormEvent,
		formData: ProfileCompleteFormData
	) => {
		try {
			console.log(formData)
		} catch (err: unknown) {
			if (err instanceof Error) console.log(err.message)
		}
	}
	return (
		<div className=" px-6 py-4 min-h-dvh flex flex-col gap-10 justify-between">
			<div className=" space-y-4">
				<div className=" py-2 font-bold">
					<Icon
						icon="famicons:arrow-back"
						width={24}
						className=" text-gray-400"
					/>
					<h2 className=" mt-10 text-2xl sm:text-2xl">
						Welcome Back, Akash Kumar R
					</h2>
					<p className=" mt-6 text-base sm:text-lg opacity-40 ">
						You're one step away from unlocking your personalized
						dashboard!
					</p>
				</div>
				<ProfileCompleteForm
					onSubmit={handleSubmit}
					disable={pending || disable}
				/>
			</div>
			<div className=" text-center font-bold opacity-60">
				<span>Devi Mess</span>
			</div>
		</div>
	)
}

export default ProfileCompletePage
