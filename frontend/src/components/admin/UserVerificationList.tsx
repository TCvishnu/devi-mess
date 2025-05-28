import { FC, useEffect, useState } from "react"
import type { User, UserDetails } from "@type/user"
import { Icon } from "@iconify/react/dist/iconify.js"

import { toTitleCase } from "@utils/stringUtils"
import { Gender, MealType, UserRole } from "@type/enums"
import {
	fetchResidentDetails,
	fetchVerificationRequests,
	updateVerificationStatus,
} from "@services/userService"
// to be removed
const dummyMessUsers: User[] = [
	{
		id: "user1",
		createdAt: new Date(),
		updatedAt: new Date(),
		name: "Jishnu Menon",
		phoneNumber: "9876543210",
		password: "hashedpassword1",
		gender: Gender.Male,
		mealType: MealType.Full,
		role: UserRole.Mess,
		isVeg: false,
		hasOnboarded: true,
		adminVerified: true,
		messcuts: [],
	},
	{
		id: "user2",
		createdAt: new Date(),
		updatedAt: new Date(),
		name: "Jishnu Menon",
		phoneNumber: "9876543210",
		password: "hashedpassword1",
		gender: Gender.Male,
		mealType: MealType.Full,
		role: UserRole.Mess,
		isVeg: false,
		hasOnboarded: true,
		adminVerified: true,
		messcuts: [],
	},
	{
		id: "user3",
		createdAt: new Date(),
		updatedAt: new Date(),
		name: "Jishnu Menon",
		phoneNumber: "9876543210",
		password: "hashedpassword1",
		gender: Gender.Male,
		mealType: MealType.Full,
		role: UserRole.Mess,
		isVeg: false,
		hasOnboarded: true,
		adminVerified: true,
		messcuts: [],
	},
	{
		id: "user4",
		createdAt: new Date(),
		updatedAt: new Date(),
		name: "Jishnu Menon",
		phoneNumber: "9876543210",
		password: "hashedpassword1",
		gender: Gender.Male,
		mealType: MealType.Full,
		role: UserRole.Mess,
		isVeg: false,
		hasOnboarded: true,
		adminVerified: true,
		messcuts: [],
	},
]

const dummyResidents: User[] = [
	{
		id: "resident1",
		createdAt: new Date(),
		updatedAt: new Date(),
		name: "Ananya Iyer",
		phoneNumber: "9876543210",
		password: "hashedpassword1",
		gender: Gender.Male,
		mealType: MealType.Full,
		role: UserRole.Resident,
		isVeg: false,
		hasOnboarded: true,
		adminVerified: true,
		messcuts: [],
	},
	{
		id: "resident2",
		createdAt: new Date(),
		updatedAt: new Date(),
		name: "Rohit Mehta",
		phoneNumber: "9123456780",
		password: "hashedpassword2",
		gender: Gender.Male,
		mealType: MealType.Full,
		role: UserRole.Resident,
		isVeg: true,
		hasOnboarded: true,
		adminVerified: true,
		messcuts: [],
	},
	{
		id: "resident3",
		createdAt: new Date(),
		updatedAt: new Date(),
		name: "Sneha Deshpande",
		phoneNumber: "9012345678",
		password: "hashedpassword3",
		gender: Gender.Male,
		mealType: MealType.Full,
		role: UserRole.Resident,
		isVeg: true,
		hasOnboarded: true,
		adminVerified: true,
		messcuts: [],
	},
	{
		id: "resident4",
		createdAt: new Date(),
		updatedAt: new Date(),
		name: "Karthik Nair",
		phoneNumber: "9988776655",
		password: "hashedpassword4",
		gender: Gender.Male,
		mealType: MealType.Full,
		role: UserRole.Resident,
		isVeg: false,
		hasOnboarded: true,
		adminVerified: true,
		messcuts: [],
	},
]

const BuildingList = {
	DEVI_HOUSE: {
		name: "Devi house",
	},
	ROCKLAND_ARCADE: {
		name: "Rockland arcade",
	},
}

const FloorList = {
	TOP: {
		name: "Top Floor",
	},
	GROUND: {
		name: "Ground Floor",
	},
}

type DisplayResidentType = {
	pagination: {
		limit: number
		page: number
		totalPages: number
	}
	result: UserDetails[]
}

const UserVerificationList: FC = () => {
	const [pending, setPending] = useState<boolean>(false)

	const [displayResidents, setDisplayResidents] =
		useState<DisplayResidentType>({
			pagination: {
				limit: 10,
				page: 0,
				totalPages: 10,
			},
			result: [],
		})
	const [magnifiedUsers, setMagnifiedUsers] = useState<Set<string>>(
		new Set("user1")
	)

	const [errorMessage, setErrorMessage] = useState<string>("")

	const toggleMagnifiedUsers = async (user: UserDetails) => {
		if (!user.id) return

		if (!magnifiedUsers.has(user.id) && !user.residentialData) {
			const { data, error } = await fetchResidentDetails(user.id)

			if (!error) {
				setDisplayResidents((prev) => {
					const newList = prev.result.map((eachItem) => {
						if (eachItem.id === user.id) {
							console.log({
								...eachItem,
								residentialData: data,
							})
							return {
								...eachItem,
								residentialData: data,
							}
						}

						return eachItem
					})

					return {
						...prev,
						result: newList,
					}
				})
			}
		}

		setMagnifiedUsers((prev) => {
			const modifiedUsers = new Set(prev)

			if (!user.id) return modifiedUsers

			if (modifiedUsers.has(user.id)) {
				modifiedUsers.delete(user.id)
			} else {
				modifiedUsers.add(user.id)
			}
			return modifiedUsers
		})
	}

	const showResidents = () => {
		setMagnifiedUsers(new Set())
	}

	const showMessStudents = () => {
		setMagnifiedUsers(new Set())
	}

	const getVerificationRequest = async () => {
		try {
			setPending(true)

			const { data, error } = await fetchVerificationRequests(
				displayResidents?.pagination.page
					? displayResidents.pagination.page + 1
					: 1,
				displayResidents?.pagination.limit || 10
			)

			if (!error && data) {
				setErrorMessage("")
				setDisplayResidents(data)
			} else {
				setErrorMessage("No pending verification request")
			}
		} catch (err) {
			console.log(err)
		} finally {
			setPending(false)
		}
	}

	const markAsVerified = async (userId: string | undefined) => {
		try {
			if (!userId) return

			const { error } = await updateVerificationStatus(userId)

			if (!error && displayResidents) {
				setDisplayResidents((prev) => ({
					...prev,
					result: prev.result.filter(
						(eachItem) => eachItem.id !== userId
					),
				}))
			}
		} catch (err) {
			console.log(err)
		}
	}

	useEffect(() => {
		getVerificationRequest()
	}, [])

	return (
		<div className="w-full flex flex-col gap-4 py-6 h-full">
			<div className="w-full min-h-12 border border-gray-400 flex items-center rounded-sm gap-2 px-2">
				<Icon icon="uil:search" className="size-6 text-gray-500" />
				<div className="w-[1.5px] h-6 bg-gray-400" />
				<input
					className="h-full w-full outline-none text-sm font-medium placeholder:text-gray-300"
					placeholder="Search.."
				/>
			</div>

			<div className="flex w-full justify-between">
				<button
					className={`w-32 h-10 font-semibold text-sm rounded-xs xs:w-40 ${
						displayResidents
							? "bg-accent text-white"
							: "border border-gray-400"
					}`}
					onClick={showResidents}
				>
					Residents
				</button>
				<button
					className={`w-32 h-10 font-semibold text-sm rounded-xs xs:w-40 ${
						!displayResidents
							? "bg-accent text-white"
							: "border border-gray-400"
					}`}
					onClick={showMessStudents}
				>
					Mess
				</button>
			</div>
			{errorMessage && (
				<span className=" text-center text-gray-400 font-semibold">
					{errorMessage}
				</span>
			)}
			<div className="overflow-y-auto">
				<div className="w-full flex gap-2 flex-col">
					{displayResidents.result.map((user, index) => (
						<div
							className={`w-full border border-gray-300 rounded-md flex flex-col text-sm items-center 
              px-2 pt-2 overflow-hidden transition-all duration-1000 gap-2
              ${
					user.id && magnifiedUsers.has(user.id)
						? "h-36 justify-start py-2"
						: "h-12"
				}`}
							key={user.id}
						>
							<div className="w-full flex">
								<div className="w-full flex gap-2 items-center px-2">
									<span className="font-medium text-gray-500 text-center">
										{index + 1}.
									</span>
									<div className="w-[1.5px] h-6 bg-gray-300" />
									<span className="font-semibold text-gray-500 line-clamp-1">
										{user.name}
									</span>
								</div>
								<button
									onClick={() => toggleMagnifiedUsers(user)}
								>
									<Icon
										icon="mynaui:chevron-right-solid"
										className={`text-gray-500 size-8 transform transition-transform duration-1000 ease-in-out ${
											user.id &&
											magnifiedUsers.has(user.id) &&
											" rotate-90"
										}`}
									/>
								</button>

								<button
									className=" px-2 bg-green-400 text-white font-semibold rounded-md"
									onClick={() => markAsVerified(user.id)}
								>
									Admit
								</button>
							</div>
							<div className="flex w-full px-4 text-gray-400 font-medium justify-between">
								<span>{user.phoneNumber}</span>
								<span>
									{user.mealType}{" "}
									{user.mealType === MealType.Full
										? "Day Mess"
										: "Only"}
								</span>
							</div>
							<div className="flex w-full px-4 text-gray-400 font-medium justify-between">
								{user.gender && (
									<span>{toTitleCase(user.gender)}</span>
								)}
								<span>
									{user.isVeg
										? "Vegetarian"
										: "Non-Vegetarian"}
								</span>
							</div>
							{user.residentialData ? (
								<div className="flex w-full px-4 text-gray-400 font-medium justify-between">
									<span>
										{
											BuildingList[
												user.residentialData.building
											]?.name
										}
									</span>
									<span>
										{
											FloorList[
												user.residentialData.floor
											]?.name
										}
									</span>
								</div>
							) : (
								<span className=" font-semibold text-gray-400 text-sm">
									Profile not completed
								</span>
							)}
						</div>
					))}
					<div className=" w-full flex justify-center">
						<button
							onClick={getVerificationRequest}
							className=" px-2 py-1 w-36 h-10 flex justify-center items-center
							 font-semibold bg-primary opacity-80 text-white disabled:opacity-60 rounded-md "
							disabled={pending}
						>
							{pending ? (
								<Icon
									width={24}
									color="white"
									icon="eos-icons:loading"
								/>
							) : (
								"Load more"
							)}
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
export default UserVerificationList
