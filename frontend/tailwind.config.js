const { m } = require("framer-motion");

module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
    "node_modules/daisyui/dist/**/*.js",
    "node_modules/react-daisyui/dist/**/*.js",
  ],
  plugins: [require("daisyui")],
  theme: {
    fontFamily: {
      kanit: ["Kanit"],
    },
    colors: {
      "golemblue": "#0C14D4",
      "golemblue-transparent": "#181ea9a6",
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
      "dangerred-100": "#F66A6A",
      //TODO add whole color palette with names
      "success-50": "#E8F6E8",
      "success-100": "#5BC281",
      "success-200": "#367946",
      "white": "#FFFFFF",
      "notistack-red": "#d32f2f",
      "notistack-green": "#43a047",

      "transparent-red": "#d32f2f7f",
      "transparent-green": "#43a0477f",
      // golemblue: '#0c14d4',
      // primary: '#181ea9',
      // secondary: '#f6f8fc',
    },
  },
  daisyui: {
    themes: [
      {
        golem: {
          ".btn": {
            backgroundColor: "#181EA9",
            color: "white",
            fontWeight: 400,
            fontSize: "16px",
          },
          ".btn:hover": {
            backgroundColor: "#0C14D4",
          },
          ".btn:focus": {
            backgroundColor: "#181EA9",
          },
          ".card": {
            marginBottom: "1rem",
            backgroundColor: "#F6F8FC",
            boxShadow: "0 0 10px 0 rgba(0,0,0,0.1)",
          },
          ".stat-value": {
            fontFamily: "Kanit",
            fontSize: "20px",
            fontWeight: 600,
            lineHeight: "1.2rem",
          },

          ".stat": {
            border: "none",
            width: "20px",
          },
          ".modal-box": {
            backgroundColor: "white",
            borderRadius: "9px",
          },

          "primary": "#0C14D4",
          "secondary": "#F6F8FC",
          "accent": "#37cdbe",
          "neutral": "#3d4451",
          "base-100": "#ffffff",

          "--b2": "var(--primary)",
          "--rounded-box": "1rem", // border radius rounded-box utility class, used in card and other large boxes
          "--rounded-btn": "0.3rem", // border radius rounded-btn utility class, used in buttons and similar element
          "--rounded-badge": "1.9rem", // border radius rounded-badge utility class, used in badges and similar
          "--animation-btn": "0.25s", // duration of animation when you click on button
          "--animation-input": "0.2s", // duration of animation for inputs like checkbox, toggle, radio, etc
          "--btn-focus-scale": "0.95", // scale transform of button when you focus on it
          "--border-btn": "1px", // border width of buttons
          "--tab-border": "1px", // border width of tabs
          "--tab-radius": "0.5rem", // border radius of tabs
          "--fallback-b1": "transparent", // fallback text color
          "--fallback-b2": "#181EA9", // fallback background color
        },
      },
    ],
  },
};
