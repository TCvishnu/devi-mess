import { defineConfig } from "vite"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig(({ mode }) => {
	const isDev = mode === "development" // mode is prod when build and preview commands are used

	return {
		plugins: [react(), tailwindcss()],
		server: {
			host: true,
			port: 5173,
			watch: {
				usePolling: isDev,
			},
		},
		resolve: {
			alias: {
				"@hooks": path.resolve(__dirname, "src/hooks"),
				"@form": path.resolve(__dirname, "src/common/components/form"),
				"@services": path.resolve(__dirname, "src/services"),
				"@type": path.resolve(__dirname, "src/types"),
			},
		},
	}
})
