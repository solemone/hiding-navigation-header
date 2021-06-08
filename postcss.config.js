module.exports = {
  plugins: [
    require('autoprefixer'),
    require('cssnano')({
      zindex: false,
      reduceIdents: false,
      discardUnused: { fontFace: false }
    }),
    require('css-mqpacker')({
      sort: true
    })
  ]
}