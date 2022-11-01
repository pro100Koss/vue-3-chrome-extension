import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import type { UserConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
// import { replaceCodePlugin } from "vite-plugin-replace";
// import copy from 'vite-plugin-copy'
import copyManifestPlugin from "./plugins/copyManifestPlugin";

const packageJson = require("../package.json");

const createUserConfig = (env: string) => {
  return {
    plugins: [
      vue(),
      vueJsx(),
      copyManifestPlugin({
        src: "manifest.json",
        dest: `./build/${env}/manifest.json`,
        replacements: [
          {
            from: "<<packageJson.version>>",
            to: packageJson.version,
          },
          {
            from: "<<packageJson.description>>",
            to: packageJson.description,
          },
        ],
      }),
      // replaceCodePlugin({
      //   replacements: [
      //     {
      //       from: "<<packageJson.version>>",
      //       to: packageJson.version
      //     },
      //     {
      //       from: "<<packageJson.description>>",
      //       to: packageJson.description
      //     }
      //   ]
      // }),
      // copy([
      //   { src: './manifest.json', dest: 'build/' },
      // ]),
      // viteStaticCopy({
      //   targets: [
      //     {
      //       src: "manifest.json",
      //       dest: `./`
      //     },
      //     {
      //       src: "src/popup/popup.html",
      //       dest: `./`
      //     }
      //   ]
      // })
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./../src", import.meta.url)),
      },
    },
    build: {
      outDir: `./build/${env}`,
      rollupOptions: {
        input: {
          worker: "src/worker/worker.ts",
          content: "src/content/content.ts",
          popup: "src/popup/popup.ts",
        },
        output: {
          format: "es",
          dir: `build/${env}`,
          entryFileNames: "[name].js",
        },
      },
    },
    define: {
      __APP_VERSION__: JSON.stringify(packageJson.version),
      __APP_NAME__: JSON.stringify(packageJson.name),
    },
  } as UserConfig;
};

export default createUserConfig;
