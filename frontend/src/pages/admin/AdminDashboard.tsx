import { useState, FC } from "react"
import FoodCountDisplay from "@components/admin/FoodCountDisplay"
import DisplayStudents from "@components/admin/DisplayStudents"
import UserReport from "@components/admin/UserReport"
import UserVerificationList from "@components/admin/UserVerificationList"

const navbar = ["Count", "Students", "Report", "Verify"] as const
type Page = "Count" | "Students" | "Report" | "Verify"

const AdminDashboard: FC = () => {
	const [curPage, setCurPage] = useState<Page>("Count")

	const changePage = (page: Page) => {
		setCurPage(page)
	}

	return (
		<div className=" w-full bg-white h-full rounded-xs flex flex-col overflow-y-auto p-4">
			<div className="w-full flex justify-evenly">
				{navbar.map((page) => (
					<button
						key={page}
						onClick={() => changePage(page)}
						className={` font-medium tab-underline ${
							curPage === page
								? " text-gray-700 tab-underline-active"
								: " text-gray-500"
						}`}
					>
						{page}
					</button>
				))}
			</div>
			{curPage === "Count" && <FoodCountDisplay />}
			{curPage === "Students" && <DisplayStudents />}
			{curPage === "Report" && <UserReport />}
			{curPage === "Verify" && <UserVerificationList />}
		</div>
	)
}
export default AdminDashboard
