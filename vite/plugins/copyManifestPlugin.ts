import { resolve } from "path";
import { normalizePath, PluginOption } from "vite";
import * as fs from "fs";

export type CopyManifestPluginConfig = {
  src: string;
  dest: string;
  replacements?: { [key: string]: any };
};

function replaceAll(str: string, find: string, replace: string) {
  return str.replace(new RegExp(find, "g"), replace);
}

const copyManifestPlugin = (
  config: CopyManifestPluginConfig = {
    src: "./manifest.json",
    dest: "./build",
    replacements: {}
  }
): PluginOption => {
  return {
    name: "copyManifest",
    apply: "build",
    closeBundle: async () => {
      const root = process.cwd();
      const destPath = normalizePath(resolve(root, config.dest));
      let content = await fs.promises.readFile(config.src, { encoding: "utf8" });

      if (config.replacements) {
        const keys = Object.keys(config.replacements);
        keys.forEach((key) => {
          content = replaceAll(content, key, config.replacements[key]);
        });
      }

      // ensure directory exists
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
      }

      const targetPath = `${destPath}/manifest.json`;
      await fs.promises.writeFile(targetPath, content);
      console.log("✓ Manifest.json copied.");
    }
  };
};
export default copyManifestPlugin;
