// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const unicorn = require("eslint-plugin-unicorn").default;

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*", "*.config.js"],
  },

  // Core + React + Import rules (all files)
  {
    rules: {
      "no-useless-concat": "error",
      "no-param-reassign": "error",
      "default-param-last": "error",
      "one-var": ["error", "never"],
      "no-else-return": "error",
      yoda: "error",
      "no-lonely-if": "error",
      "prefer-const": "error",
      "prefer-template": "warn",
      "react/self-closing-comp": "error",
      "import/no-commonjs": "error",
    },
  },

  // TypeScript-specific rules (TS files only)
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.d.ts"],
    rules: {
      "default-param-last": "off",
      "@typescript-eslint/default-param-last": "error",
      "@typescript-eslint/prefer-as-const": "error",
      "@typescript-eslint/no-inferrable-types": "error",
      "no-restricted-syntax": [
        "error",
        {
          selector: "TSEnumDeclaration",
          message: "Use a const object with `as const` instead of an enum.",
        },
      ],
    },
  },

  // Unicorn rules
  {
    plugins: { unicorn },
    rules: {
      "unicorn/prefer-number-properties": "error",
      "unicorn/prefer-string-trim-start-end": "error",
    },
  },
]);
