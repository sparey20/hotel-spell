import flowbite from 'flowbite-react/tailwind';

/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', flowbite.content()],
  theme: {
    ...flowbite.theme,
    extend: {},
    borderWidth: {
      DEFAULT: '1px',
      0: 0,
      2: '2px',
      3: '3px',
      4: '4px',
      5: '5px',
      6: '6px',
      8: '8px',
      10: '10px',
    },
  },
  plugins: [flowbite.plugin()],
};
