import { default as eslint, default as pluginJs } from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";


export default [
  {
    files: ["{src/types}/*.{js,mjs,cjs,ts}"]
  },
  {
    ignores: [
      "eslint.config.mjs",
      "tsup.config.ts",
      "dist",
    ]
  },
  {
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    }
  },
  pluginJs.configs.recommended,
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    rules: {
      "indent": ["error", 2],
      "semi": ["error"],
      "global-require": ["error"],
      "handle-callback-err": ["error"]
    }
  },
];
