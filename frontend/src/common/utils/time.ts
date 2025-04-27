const MINUTES_IN_SECONDS = 60

export const convertSecondsToString = (seconds: number): string => {
	const date = new Date()

	date.setMinutes(0)
	date.setSeconds(seconds)

	const minute = Math.floor(seconds / MINUTES_IN_SECONDS)
		.toString()
		.padStart(2, "0")

	const second = (seconds % MINUTES_IN_SECONDS).toString().padStart(2, "0")

	return `${minute}:${second}`
}
