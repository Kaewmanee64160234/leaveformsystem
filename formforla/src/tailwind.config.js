// tailwind.config.js
export const content = ["./src/**/*.{js,jsx,ts,tsx}"];
export const theme = {
    extend: {
        colors: {
            primary: "#205072", // can be used for backgrounds or headers
            secondary: "#329d9c", // for borders or text accents
            tertiary: "#562596", // alternative accent color
            accent: "#7be495", // for buttons or highlights
            light: "#cff4d2" // light background or text color
        },
    },
};
export const plugins = [];
  