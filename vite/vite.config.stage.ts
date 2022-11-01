import { defineConfig } from "vite";
import createUserConfig from "./createUserConfig";

// https://vitejs.dev/config/
export default defineConfig({
  ...createUserConfig("stage"),
});
