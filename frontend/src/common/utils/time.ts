const MINUTES_IN_SECONDS = 60

export const MONTHS: Record<number, string> = {
	0: "January",
	1: "February",
	2: "March",
	3: "April",
	4: "May",
	5: "June",
	6: "July",
	7: "August",
	8: "September",
	9: "October",
	10: "November",
	11: "December",
}

export const convertSecondsToString = (seconds: number): string => {
	const minute = Math.floor(seconds / MINUTES_IN_SECONDS)
		.toString()
		.padStart(2, "0")

	const second = (seconds % MINUTES_IN_SECONDS).toString().padStart(2, "0")

	return `${minute}:${second}`
}
