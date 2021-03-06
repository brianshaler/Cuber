// Generated by CoffeeScript 1.3.3
(function() {
  var PI, args, atan, cos, current_side, finished, gd, get_angle_to, open_source_file, optimist, output, process_next_side, quality, side, side_obj, sides, sin, size, source_image, sqrt, src, tan, _i, _len;

  optimist = require("optimist");

  gd = require("gd");

  args = optimist["default"]("src", "")["default"]("output", "output/")["default"]("size", 512)["default"]("quality", 90).argv;

  src = String(args.src);

  output = String(args.output);

  size = parseInt(args.size);

  quality = parseInt(args.quality);

  if ("/" !== output.charAt(output.length - 1)) {
    output += "/";
  }

  atan = Math.atan2;

  cos = Math.cos;

  sin = Math.sin;

  tan = Math.tan;

  sqrt = Math.sqrt;

  PI = Math.PI;

  source_image = null;

  sides = [
    {
      side: "left",
      lng: PI * 1.5,
      lat: 0
    }, {
      side: "front",
      lng: 0,
      lat: 0
    }, {
      side: "right",
      lng: PI / 2,
      lat: 0
    }, {
      side: "back",
      lng: PI,
      lat: 0
    }, {
      side: "top",
      lng: -PI / 2,
      lat: PI
    }, {
      side: "bottom",
      lng: PI / 2,
      lat: -PI
    }
  ];

  side_obj = {};

  for (_i = 0, _len = sides.length; _i < _len; _i++) {
    side = sides[_i];
    side_obj[side.side] = side;
  }

  finished = function() {
    return process.exit();
  };

  open_source_file = function() {
    var _this = this;
    return gd.openJpeg(src, function(img, path) {
      if (img != null) {
        source_image = img;
        return process_next_side();
      } else {
        console.log("Failed to load input file " + src);
        return finished();
      }
    });
  };

  current_side = 0;

  process_next_side = function() {
    var col, int_x, int_y, lat, lng, side_img, x, y, _j, _k, _ref;
    if (current_side < sides.length) {
      side_img = gd.createTrueColor(size, size);
      side = sides[current_side].side;
      for (y = _j = 0; 0 <= size ? _j <= size : _j >= size; y = 0 <= size ? ++_j : --_j) {
        for (x = _k = 0; 0 <= size ? _k <= size : _k >= size; x = 0 <= size ? ++_k : --_k) {
          _ref = get_angle_to(side, x, y), lng = _ref[0], lat = _ref[1];
          int_x = parseInt(lng / PI / 2 * source_image.width);
          int_y = parseInt((lat + PI / 2) / PI * source_image.height);
          col = source_image.getPixel(int_x, int_y);
          side_img.setPixcel(x, y, col);
        }
      }
      side_img.saveJpeg(output + side + ".jpg", quality, gd.noop);
      current_side++;
      return process_next_side();
    } else {
      return finished();
    }
  };

  get_angle_to = function(side, x, y) {
    var X, Y, Z, hyp, lat, latOffset, lng, lngOffset;
    X = x - size / 2;
    Y = y - size / 2;
    Z = size / 2;
    lngOffset = side_obj[side].lng;
    latOffset = side_obj[side].lat;
    if (side === "top" || side === "bottom") {
      hyp = sqrt(X * X + Y * Y);
      lng = lngOffset + atan(Y, X);
      lat = atan(Z, hyp);
      if (side === "top") {
        lat *= -1;
        lng *= -1;
      }
    } else {
      hyp = sqrt(X * X + Z * Z);
      lng = lngOffset + atan(X, Z);
      lat = atan(Y, hyp);
    }
    while (lng < 0) {
      lng += PI * 2;
    }
    lng = lng % (PI * 2);
    return [lng, lat];
  };

  open_source_file();

}).call(this);
