import globals from "globals";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";  // TypeScript dosyalarını çözümlemek için parser'ı ekliyoruz

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: {
      parser: tsParser,
      globals: globals.browser,
      ecmaVersion: "latest",
      sourceType: "module",
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      // Temel ESLint ve TypeScript kuralları
      "@typescript-eslint/no-namespace": "off",
      "no-debugger": "error",
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      "no-var": "error",
      "prefer-const": "error",
      "eqeqeq": "error",
      "curly": "error",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      // TypeScript önerilen kuralları ekliyoruz

    },
  },
];
