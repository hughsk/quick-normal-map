var normalmap = require('./')
var render = require('ndarray-canvas')
var getPixels = require('get-pixels')
var fill = require('ndarray-fill')

var img = new Image
img.src = 'sky.png'
document.body.appendChild(img)

getPixels('sky.png', function(err, pixels) {
  console.time('normal map')
  var heightmap = pixels.pick(null, null, 0).transpose(1, 0)
  var mapped = amplify(normalmap(heightmap))
  console.timeEnd('normal map')

  function amplify(array) {
    return array.shape.length === 3
      ? fill(array, function(x, y, z) {
        return array.get(x, y, z) * 255 + 20
      })
      : fill(array, function(x, y) {
        return array.get(x, y) * 255 + 20
      })
  }

  var r = mapped.pick(null, null, 0)
  var g = mapped.pick(null, null, 1)
  var b = mapped.pick(null, null, 2)
  var nimg = new Image
  nimg.src = render(null, r, g, b).toDataURL()
  document.body.appendChild(nimg)
})
