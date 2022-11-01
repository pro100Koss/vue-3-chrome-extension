import fs from "fs/promises";

export type CopyManifestPluginConfig = {
  src: string;
  dest: string;
  replacements?: { from: string; to: string }[];
};

function replaceAll(str: string, find: string, replace: string) {
  return str.replace(new RegExp(find, "g"), replace);
}

const copyManifestPlugin = (
  config: CopyManifestPluginConfig = {
    src: "./manifest.json",
    dest: "./build/manifest.json",
    replacements: [],
  }
) => {
  return {
    name: "copyManifest",
    apply: "build",
    buildEnd: async () => {
      let content = await fs.readFile(config.src, { encoding: "utf8" });

      if (config.replacements) {
        config.replacements.forEach(({ from, to }) => {
          content = replaceAll(content, from, to);
        });
      }

      await fs.writeFile(config.dest, content);
      console.log("✓ Manifest.json copied.");
    },
  };
};
export default copyManifestPlugin;
