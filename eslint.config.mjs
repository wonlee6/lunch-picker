import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import typescript from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import reactHooksPlugin from "eslint-plugin-react-hooks";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// eslint-disable-next-line import/no-anonymous-default-export
export default [
  {
    plugins: {
      "@typescript-eslint": typescript,
      "react-hooks": reactHooksPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
  {
    files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"],
    rules: {
      // TypeScript 관련 규칙
      "@typescript-eslint/no-explicit-any": "off", // any 타입 사용 시 경고
      "@typescript-eslint/no-unused-vars": "off", // 사용하지 않는 변수 경고
      // React Hooks 규칙
      "react-hooks/rules-of-hooks": "error", // Hooks 규칙 준수
      "react-hooks/exhaustive-deps": "warn", // useEffect 의존성 배열 검사
      
      // 일반 규칙
      "no-console": "off", // console 사용 off
    },
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];
