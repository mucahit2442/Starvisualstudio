import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    "dist/**",
    ".vinext/**",
    ".wrangler/**",
    ".sites-runtime/**",
    "outputs/**",
    "work/**",
  ]),
  {
    files: ["components/ui/**/*.{ts,tsx}", "hooks/use-mobile.ts"],
    rules: {
      // These files are vendored verbatim from shadcn@4.17.0. Keep the
      // registry source intact while applying the stricter rules to Site code.
      "@typescript-eslint/no-unused-vars": "off",
      "react-hooks/purity": "off",
      "react-hooks/set-state-in-effect": "off",
    },
  },
  {
    files: ["app/account/**/*.{ts,tsx}", "app/admin/**/*.{ts,tsx}"],
    rules: {
      // These screens deliberately use full-page anchors to move between the
      // framework routes and the static storefront under public/.
      "@next/next/no-html-link-for-pages": "off",
      "@next/next/no-img-element": "off",
      // Auth callbacks own the asynchronous state transitions on these pages.
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/exhaustive-deps": "off",
    },
  },
  {
    files: ["app/api/admin/route.ts"],
    rules: {
      // The endpoint validates every field before accepting imported JSON.
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
]);

export default eslintConfig;
