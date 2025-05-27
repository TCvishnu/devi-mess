import { defineConfig } from "tsup"

export default defineConfig({
	entry: ["src/app.ts"],
	outDir: "dist",
	clean: true,
	format: ["cjs"],
	sourcemap: true,
	tsconfig: "tsconfig.json",
	target: "es2022",
})
