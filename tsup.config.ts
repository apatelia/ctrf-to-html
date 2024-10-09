import copyStaticFiles from "esbuild-copy-static-files";
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"], // Build for commonJS and ESmodules
  dts: true, // Generate declaration file (.d.ts)
  splitting: false,
  sourcemap: true,
  clean: true,
  bundle: true,
  esbuildPlugins: [
    copyStaticFiles({
      src: 'src/templates',
      dest: 'dist/templates',
      dereference: true,
      errorOnExist: false,
      preserveTimestamps: true,
      recursive: true,
    })
  ],
});
