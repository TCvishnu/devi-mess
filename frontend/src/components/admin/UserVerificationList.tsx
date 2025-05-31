import { FC, useEffect, useState } from "react"
import type { UserDetails } from "@type/user"
import { Icon } from "@iconify/react/dist/iconify.js"

import { toTitleCase } from "@utils/stringUtils"
import { MealType } from "@type/enums"
import {
	fetchResidentDetails,
	fetchVerificationRequests,
	updateVerificationStatus,
} from "@services/userService"
import Button from "../../common/components/button/Button"

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
		currentPage: number
		totalPages: number
	}
	result: UserDetails[]
}

const UserVerificationList: FC = () => {
	const [pending, setPending] = useState<boolean>(false)
	const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null)

	const [displayResidents, setDisplayResidents] =
		useState<DisplayResidentType>({
			pagination: {
				limit: 10,
				currentPage: 0,
				totalPages: 10,
			},
			result: [],
		})
	const [magnifiedUsers, setMagnifiedUsers] = useState<Set<string>>(new Set())
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

	const showConfirmDialog = (user: UserDetails) => {
		setSelectedUser(user)
	}

	const hideConfirmDialog = () => {
		setSelectedUser(null)
	}

	const getVerificationRequest = async () => {
		try {
			setPending(true)

			console.log(displayResidents.pagination)
			const { data, error } = await fetchVerificationRequests(
				displayResidents.pagination.currentPage + 1,
				displayResidents.pagination.limit
			)

			if (!error && data) {
				setErrorMessage("")
				setDisplayResidents(data)
			} else {
				setErrorMessage("No more pending request")
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
				hideConfirmDialog()
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

	// add existing search and in-view fetching to this component
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
									onClick={() => showConfirmDialog(user)}
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
							{user.residentialData && (
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
							)}
						</div>
					))}
					{errorMessage && (
						<span className=" text-center text-gray-400 font-semibold">
							{errorMessage}
						</span>
					)}
					<div className=" mt-4 w-full flex justify-center">
						<button
							onClick={getVerificationRequest}
							className=" px-2  w-32 h-8 text-sm flex justify-center items-center
							 font-semibold bg-primary opacity-80 text-white disabled:opacity-60 rounded-md "
							disabled={pending}
						>
							{pending ? (
								<div className=" w-4 h-4 border-2 border-b-transparent rounded-full animate-spin " />
							) : (
								"Load more"
							)}
						</button>
					</div>
				</div>
			</div>

			{selectedUser && (
				<div className=" absolute px-4 inset-0 w-full h-full flex justify-center items-center bg-blur rounded-md ">
					<div className="  w-full max-w-xs p-4 bg-white rounded-md animate-slide-in">
						<div className=" flex flex-col items-center gap-4">
							<span className=" font-semibold text-center">
								Are you sure you want to admit
								<span className=" font-bold ml-1">
									{selectedUser.name}
								</span>{" "}
								?
							</span>
						</div>
						<div className=" flex justify-center mt-4 gap-4">
							<Button
								radiusSize="md"
								className=" h-8 max-w-20 flex justify-center items-center bg-gray-600 rounded-md"
								onClick={hideConfirmDialog}
							>
								Cancel
							</Button>
							<Button
								radiusSize="md"
								className=" h-8 max-w-20 flex justify-center items-center bg-green-600 rounded-md"
								onClick={() => markAsVerified(selectedUser.id)}
							>
								Confirm
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
export default UserVerificationList
