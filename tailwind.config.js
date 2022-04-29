module.exports = {
    content: ["./**/*.{html,js,handlebars}", './node_modules/tw-elements/dist/js/**/*.js'],
    plugins: [
        require('@tailwindcss/typography'),
        // require('tw-elements/dist/plugin'),
        require("postcss-import"),
        require("tailwindcss"),
        require("autoprefixer"),

    ],
}
