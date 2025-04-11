import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {

	const isDev = mode === 'development'; // mode is prod when build and preview commands are used

	return {
		plugins: [react(), tailwindcss()],
		server: {
			host: true,
			port: 5173,
			watch: {
				usePolling: isDev,
			},
		},
	};
});
