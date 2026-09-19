export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        whatsapp: "#25D366",
        lucid: {
          dark: "#1C1E21",
          dark2: "#25282c",
          search: "#2d3136",
          blue: "#0066F5",
          blueSoft: "#e8f1ff",
          grey: "#F4F5F6",
          mute: "#6b7280",
          line: "#e5e7eb",
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', "system-ui", "sans-serif"],
        display: ['"Outfit"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
