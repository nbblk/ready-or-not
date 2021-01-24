module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        prata: ["Prata", "serif"],
        archivo: ["Archivo Black", "sans-serif"],
        suez: ["Suez One", "serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      width: {
        rect: "26rem",
      },
      height: {
        rect: "38rem",
      },
      colors: {
        navy: {
          DEFAULT: "#222B40",
        },
        purple: {
          DEFAULT: "#583BAC",
        },
        gray: {
          DEFAULT: "#4E5566",
        },
        pink: {
          DEFAULT: "#FCDFD8",
        },
        beige: {
          DEFAULT: "#ECE8E4",
          yellowish: "#F8F6F1"
        }
      },
      boxShadow: {
        bold: "7px 3px 0px 2px #000000"
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
