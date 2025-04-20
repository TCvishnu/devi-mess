import { FormEvent, useState } from "react"
import { RegisterFormData } from "../../types/auth"
import RegisterForm from "../../components/auth/form/RegisterForm"
import { Link } from "react-router-dom"
import { Icon } from "@iconify-icon/react/dist/iconify.mjs"
import BackgroundLayer from "../../components/auth/BackgroundLayer"

const RegisterPage = () => {
	const [pending, setPending] = useState<boolean>(false)

	const handleSubmit = (
		event: FormEvent<HTMLFormElement>,
		formData: RegisterFormData
	) => {
		try {
			console.log(formData, "FROM LOGIN")
		} catch (err: unknown) {
			if (err instanceof Error) console.log(err.message)
		}
	}

	return (
		<div className=" w-full px-6 py-10 h-full flex flex-col justify-around gap-60">
			<BackgroundLayer />
			<div className=" text-white font-bold">
				<h1 className=" text-5xl sm:text-6xl">Devi Mess</h1>
				<p className=" flex items-center gap-2 mt-4">
					<Icon
						className=" text-accent"
						icon="ic:baseline-waving-hand"
						width={40}
						color="fc6874"
					/>
					<span className=" text-2xl">Welcome back</span>
				</p>
			</div>

			{/* <div className="shapedividers_com-6409">he</div> */}
			<div className=" max-w-md flex flex-col gap-10 justify-end">
				<div className="text-4xl font-bold">
					<h1>Create</h1>
					<h1>An Account</h1>
				</div>

				<RegisterForm disable={pending} onSubmit={handleSubmit} />
				<div className=" text-sm font-semibold text-gray-400 text-center flex flex-col">
					<span>already have an account?</span>
					<span>
						click here to
						<Link
							to="/login"
							className=" ml-1 underline text-gray-800"
						>
							login
						</Link>
					</span>
				</div>
			</div>
		</div>
	)
}

export default RegisterPage
