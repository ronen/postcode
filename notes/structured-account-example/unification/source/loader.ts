export const pluginTarget = "./plugins/default.js";
export async function loadPlugin() {
  return import(pluginTarget);
}
