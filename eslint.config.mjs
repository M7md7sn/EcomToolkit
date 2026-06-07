import { FlatCompat } from "@eslint/eslintrc";
import tseslint from "typescript-eslint";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const isProduction = process.env.NODE_ENV === "production";
const errorLevel = isProduction ? "error" : "warn";

export default tseslint.config(
  // Next.js configs
  ...compat.extends("next/core-web-vitals"),

  // TypeScript-ESLint configs
  ...tseslint.configs.recommended,

  // Custom Clean Code Guard Rules
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      // Enforce Prettier styling via ESLint
      "prettier/prettier": "error",

      // Code hygiene rules (warning in dev, errors in prod to guard builds)
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        errorLevel,
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "no-console": [errorLevel, { allow: ["warn", "error"] }],

      // Strict type safety rules
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-empty-object-type": "warn",

      // React details
      "react/react-in-jsx-scope": "off",
      "react/display-name": "off",
    },
  },

  // Turn off formatting rules that conflict with Prettier
  prettierConfig,

  // Ignored files
  {
    ignores: [
      ".next/**/*",
      "node_modules/**/*",
      "dist/**/*",
      "*.tsbuildinfo",
      "package-lock.json",
      "dev-server.log",
      "dev-server.err.log",
      "next-env.d.ts",
    ],
  },
);
