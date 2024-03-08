module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
    "node_modules/daisyui/dist/**/*.js",
    "node_modules/react-daisyui/dist/**/*.js",
  ],
  plugins: [require("daisyui")],
  theme: {
    colors: {
      "golemblue": "#0C14D4",
      "primary": "#181EA9",
      "neutral-grey-300": "#404B63",
      "neutral-grey-200": "#A2A3B9",
      "lightblue-50": "#F6F8FC",
      "lightblue-100": "#E8EBF6",
      "lightblue-200": "#C6CCED",
      "lightblue-border": "A4A6DD",
      "blue-300": "#A4ADDE",
      "blue-400": "#5F6ABF",
      "darkblue-500": "#181EA9",
      "darkblue-600": "#0E137C",
      "darkblue-700": "#0C0E55",
      "dangerred-200": "#A71919",
      //TODO add whole color palette with names
      "success-50": "#E8F6E8",
      "success-100": "#5BC281",
      "success-200": "#367946",
      // golemblue: '#0c14d4',
      // primary: '#181ea9',
      // secondary: '#f6f8fc',
    },
  },
};
