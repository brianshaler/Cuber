optimist = require "optimist"
gd = require "gd"

args = optimist
  .default("src", "")
  .default("output", "output/")
  .default("size", 512)
  .default("quality", 90)
  .argv;

src =     String args.src
output =  String args.output
size =    parseInt args.size
quality = parseInt args.quality

if "/" != output.charAt output.length-1
  output += "/"

atan =  Math.atan2
cos =   Math.cos
sin =   Math.sin
tan =   Math.tan
sqrt =  Math.sqrt
PI =    Math.PI

source_image = null

sides = [
  {side: "left",   lng: PI*1.5,    lat: 0}, 
  {side: "front",  lng: 0,      lat: 0}, 
  {side: "right",  lng: PI/2,   lat: 0}, 
  {side: "back",   lng: PI,     lat: 0}, 
  {side: "top",    lng: -PI/2,      lat: PI}, 
  {side: "bottom", lng: PI/2,      lat: -PI}
]

side_obj = {}
for side in sides 
  side_obj[side.side] = side

finished = () ->
  process.exit()


open_source_file = () ->
  gd.openJpeg src, (img, path) =>
    if img?
      source_image = img
      process_next_side()
    else
      console.log "Failed to load input file #{src}"
      finished()


current_side = 0
process_next_side = () ->
  if current_side < sides.length
    side_img = gd.createTrueColor size, size
    side = sides[current_side].side
    for y in [0..size]
      for x in [0..size]
        # get angle to x,y pixel on side[current_side]
        [lng, lat] = get_angle_to x, y, side
        
        # get pixel
        int_x = parseInt lng/PI/2 * source_image.width
        int_y = parseInt (lat+PI/2)/PI * source_image.height
        #console.log "pos: #{lng},#{lat} -> #{int_x}, #{int_y}"
        col = source_image.getPixel int_x, int_y
        
        # set pixel
        side_img.setPixcel x, y, col
    
    side_img.saveJpeg output+side+".jpg", quality, gd.noop
    
    current_side++
    process_next_side()
  else
    finished()

get_angle_to = (x, y, side) ->
  X = x-size/2
  Y = y-size/2
  Z = size/2
  
  lngOffset = side_obj[side].lng
  latOffset = side_obj[side].lat
  
  if side == "top" or side == "bottom"
    hyp = sqrt X*X + Y*Y
    lng = lngOffset + atan Y, X
    lat = atan Z, hyp
    if side == "top"
      lat *= -1
      lng *= -1
  else
    hyp = sqrt X*X + Z*Z
    lng = lngOffset + atan X, Z
    lat = atan Y, hyp
  
  while lng < 0
    lng += PI*2
  
  mult = 100000
  lng = ((lng*mult) % (PI*2*mult)) / mult
  
  [lng, lat]


# kick it off
open_source_file()
