// /** @type {import('tailwindcss').Config} */
// const colors = require("tailwindcss/colors")

// module.exports = {
//   // important: true,
//   content: [
//     "./pages/**/*.{js,ts,jsx,tsx}",
//     "./components/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {
//       colors: {
//         "main-dark": "#111928",
//         "main-orange": "#f59e0b",
//       },
//       transitionProperty: {
//         width: "width",
//       },
//       typography: {
//         DEFAULT: {
//           css: {
//             color: "#9ca3af",
//             "h1, h2, h3, h4, h5, h6": {
//               margin: 0,
//               color: "inherit",
//             },
//             p: {
//               fontSize: "1.5rem",
//               lineHeight: 1.5,
//             },
//             strong: {
//               color: "inherit",
//             },
//             blockquote: {
//               color: "inherit",
//               lineHeight: 1.4,
//               borderLeft: "0.5rem solid #b6bac2",
//               background: "rgba(98, 98, 98, .2)",
//             },
//             "blockquote p:first-of-type::before": { content: "none" },
//             "blockquote p:first-of-type::after": { content: "none" },
//             "blockquote > p": {
//               fontSize: "1.4rem",
//               padding: "1.2rem 1.6rem 1.2rem 0",
//             },
//             "ul li": {
//               fontSize: "1.3rem",
//               color: "#d1d5db",
//               marginBottom: "0.2rem",
//             },
//           },
//         },
//       },
//     },
//   },
//   plugins: [require("daisyui"), require("@tailwindcss/typography")],
// }

/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

module.exports = {
  // important: true,
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "main-dark": "#0f172a", // Deep navy for dark backgrounds
        "main-dark-alt": "#111928", // Slightly lighter navy for contrast
        "main-light": "#f8fafc", // Soft white for light backgrounds
        "main-accent": "#2563eb", // Vibrant blue for accents
        "main-gray": "#64748b", // Neutral gray for text
        "main-border": "#e2e8f0", // Light gray for borders
        "main-hover": "#1e40af", // Darker blue for hover states
        "main-orange": "#f59e0b", // Bright orange for highlights
      },
      transitionProperty: {
        width: "width",
        opacity: "opacity",
        transform: "transform",
      },
      typography: {
        DEFAULT: {
          css: {
            color: "#c0c0c0", // Neutral text color
            "h1, h2, h3, h4, h5, h6": {
              margin: 0,
              color: "#c6e2ff", // Darker headings
              fontWeight: "600", // Semi-bold for headings
            },
            h1: {
              fontSize: "2.5rem", // Larger for a bold statement
              lineHeight: "1.2",
            },
            h2: {
              color: "#66cdaa",
              fontSize: "2rem",
              lineHeight: "1.3",
            },
            h3: {
              fontSize: "1.75rem",
              lineHeight: "1.4",
            },
            p: {
              fontSize: "1.125rem", // Slightly smaller for readability
              lineHeight: "1.6",
              color: "#c6e2ff",
            },
            strong: {
              color: "#0f172a", // Bold text in dark color
              fontWeight: "600",
            },
            blockquote: {
              color: "#334155",
              lineHeight: "1.5",
              borderLeft: "0.25rem solid #2563eb", // Accent border
              background: "rgba(37, 99, 235, 0.1)", // Subtle blue background
              padding: "1rem 1.5rem",
              borderRadius: "0.5rem",
            },
            "blockquote p:first-of-type::before": { content: "none" },
            "blockquote p:first-of-type::after": { content: "none" },
            "ul li": {
              fontSize: "1rem",
              color: "#334155",
              marginBottom: "0.5rem",
            },
            a: {
              color: "#2563eb", // Accent color for links
              textDecoration: "none",
              "&:hover": {
                color: "#1e40af", // Darker blue on hover
                textDecoration: "underline",
              },
            },
            span:{
              color: "#66cdaa", // Neutral text color
            }
          },
        },
      },
      boxShadow: {
        'light-glow': '0 0 15px 2px rgba(255, 255, 255, 0.2)',
      },
    },
  },
  plugins: [require("daisyui"), require("@tailwindcss/typography")],
};