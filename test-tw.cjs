const tailwindcss = require('tailwindcss');
const postcss = require('postcss');

const config = require('./tailwind.config.js');

// mock html
const html = `
  <div class="bg-boda-cream text-boda-text"></div>
  <div class="bg-xv-primary text-boda-dark/40"></div>
`;

postcss([
  tailwindcss({
    ...config.default,
    content: [{ raw: html, extension: 'html' }]
  })
])
.process('@tailwind utilities;', { from: undefined })
.then(result => {
  console.log("GENERATED CSS:");
  console.log(result.css);
})
.catch(err => {
  console.error("ERROR:");
  console.error(err);
});
