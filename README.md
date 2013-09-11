# quick-normal-map [![experimental](http://hughsk.github.io/stability-badges/dist/experimental.svg)](http://github.com/hughsk/stability-badges) #

[![quick-normal-map](https://nodei.co/npm/quick-normal-map.png?mini=true)](https://nodei.co/npm/quick-normal-map)

Takes a 2D heightmap stored in an
[ndarray](http://github.com/mikolalysenko/ndarray) and generates a matching normal map.

Uses a method that is fast, but less accurate - I believe
[this approach](http://stackoverflow.com/questions/2368728/can-normal-maps-be-generated-from-a-texture) works best :)

## Usage ##

### `normal(heightmap, [options])` ###

Generates a normal map.

* `heightmap` should be a 2D ndarray, where each value corresponds to the
  height at that point.
* `options.output` is an optional 3D ndarray to output to. If not supplied,
  one will be created. It's essentially the same size as the heightmap but
  with an added dimension for X/Y/Z rotation values. So the shape of this
  ndarray should be equivalent to:

  ``` javascript
  [heightmap.shape[0], heightmap.shape[1], 3]
  ```

* `options.xzscale` The scale of the horizontal planes. Defaults to 1.
* `options.yscale` The scale of the vertical plane. Defaults to 1.
* `options.wrap` a boolean for whether the heightmap is tiling and the normal
  map should wrap around the edges. Defaults to true.
