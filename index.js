var isndarray = require('isndarray')
var zeros = require('zeros')

module.exports = normalmap

function normalmap(heightmap, target, options) {
  if (!isndarray(heightmap)) throw new Error('The heightmap must be an ndarray')
  if (heightmap.shape.length !== 2) throw new Error('The heightmap must be a two-dimensional ndarray')

  options = options || {}

  var target = options.target || zeros([heightmap.shape[0], heightmap.shape[1], 3])
  var xzscale = options.xzscale || 1
  var yscale = options.yscale || 1
  var wrap = 'wrap' in options ? options.wrap : true

  loop(target, heightmap, heightmap, {
      wlimit: heightmap.shape[0] - 1
    , hlimit: heightmap.shape[1] - 1
    , xzscale: xzscale
    , yscale: yscale
    , wrap: options.wrap
  })

  return target
}

var loop = require('cwise')({
  funcName: 'cwiseNormalMap',
  args: ['scalar', 'index', 'array', 'scalar', 'scalar'],
  pre: function(normal, value, map, map, params) {
    this.wlimit = params.wlimit
    this.hlimit = params.hlimit
    this.yscale = params.yscale
    this.xzscale = params.xzscale
    this.wrap = !!params.wrap
  },
  body: function(normal, idx, value, map) {
    var x = idx[0]
    var y = idx[1]

    if (this.wrap) {
      var sx = map.get(x < this.wlimit ? x + 1 : 0, y)
             - map.get(x > 0 ? x - 1 : this.wlimit, y)

      var sy = map.get(x, y < this.hlimit ? y + 1 : 0)
             - map.get(x, y > 0 ? y - 1 : this.hlimit)
    } else {
      var sx = map.get(x < this.wlimit ? x + 1 : x, y)
             - map.get(x > 0 ? x - 1 : x, y)

      var sy = map.get(x, y < this.hlimit ? y + 1 : y)
             - map.get(x, y > 1 ? y - 1 : y)

      if (!x || x === this.wlimit) sx *= 2
      if (!y || y === this.hlimit) sy *= 2
    }

    var mag = sx*sx+4+sy*sy
    if (mag === 0) {
      normal.set(x, y, 0, 0)
      normal.set(x, y, 1, 0)
      normal.set(x, y, 2, 0)
    } else {
      mag = Math.sqrt(mag)
      normal.set(x, y, 0, (-sx / mag) * this.yscale)
      normal.set(x, y, 2, (  2 / mag) * this.xzscale)
      normal.set(x, y, 1, ( sy / mag) * this.yscale)
    }
  }
})
