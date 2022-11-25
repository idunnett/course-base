/** @type {import("prettier").Config} */
module.exports = {
  semi: false,
  singleQuote: true,
  plugins: [require.resolve("prettier-plugin-tailwindcss")],
}
