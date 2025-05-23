import { useEffect, useState } from "react"

const useTimer = (initialTime: number = 10, onEnd?: () => void) => {
	const [timeLeft, setTimeLeft] = useState(initialTime)

	useEffect(() => {
		if (timeLeft <= 0) {
			if (onEnd) onEnd()

			return
		}

		const intervalId = setInterval(() => {
			setTimeLeft((prev) => prev - 1)
		}, 1000)

		return () => clearInterval(intervalId)
	}, [timeLeft])

	const resetTimer = () => {
		setTimeLeft(initialTime)
	}

	return {
		timeLeft,
		resetTimer,
	}
}

export default useTimer
