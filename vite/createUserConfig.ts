import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import type { UserConfig } from "vite";
import copyManifestPlugin from "./plugins/copyManifestPlugin";

const packageJson = require("../package.json");

const createUserConfig = (env: string) => {
  const nameManifest = packageJson.nameManifest + (env === "dev" ? " DEV" : (env === "stage" ? " STAGE" : ""));


  return {
    plugins: [
      vue(),
      vueJsx(),
      copyManifestPlugin({
        src: "manifest.json",
        dest: `./build/${env}`,
        replacements: {
          "<<packageJson.name>>": nameManifest,
          "<<packageJson.version>>": packageJson.version,
          "<<packageJson.description>>": packageJson.description
        }
      })
    ],
    resolve: {
      alias: {
        // @ts-ignore
        "@": fileURLToPath(new URL("./../src", import.meta.url))
      }
    },
    build: {
      outDir: `./build/${env}`,
      rollupOptions: {
        input: {
          worker: "src/worker/worker.ts",
          content: "src/content/content.ts",
          popup: "src/popup/popup.ts"
        },
        output: {
          format: "es",
          dir: `build/${env}`,
          entryFileNames: "[name].js"
        }
      }
    },
    define: {
      __APP_VERSION__: JSON.stringify(packageJson.version),
      __APP_NAME__: JSON.stringify(packageJson.name)
    }
  } as UserConfig;
};

export default createUserConfig;
