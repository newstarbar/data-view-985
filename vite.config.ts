import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import UnoCSS from "unocss/vite";
import { resolve } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, "..");

// https://vite.dev/config/
export default defineConfig({
	base: "./data-view-985/",
	plugins: [vue(), UnoCSS()],
	resolve: {
		alias: {
			"@": resolve(__dirname, "./src")
		}
	}
});
