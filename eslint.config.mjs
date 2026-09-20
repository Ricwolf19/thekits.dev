// eslint-config-next 16 ships flat config directly; FlatCompat is not needed
// (and wrapping it crashes on the plugin's circular references).
import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

const config = [
  ...coreWebVitals,
  ...typescript,
  { ignores: [".next/**", "node_modules/**", "next-env.d.ts"] },
  {
    rules: {
      // A leading underscore marks a parameter that is deliberately unused
      // (e.g. `ref` pulled off a prop bag so it is not forwarded).
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
];

export default config;
