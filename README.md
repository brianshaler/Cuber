Cuber
=====

Node.js CLI app to convert a spherical panorama source image into a cubic panorama

Install dependencies:

    npm install

Note that this application uses GD bindings but does not include the GD image processing library itself. Make sure GD is installed, then you may need to follow the sparse instructions in the [node-gd](https://github.com/taggon/node-gd) README.

Building app.js:

    coffee -j app.js -c src/app.coffee

Processing an image:

    node app.js --src images/demo.jpg --output output/

Preview:

    open demo/index.html

View CSS3 demo here: [http://brianshaler.github.com/Cuber/](http://brianshaler.github.com/Cuber/)

=====

[Demo image cc dr. friendly](http://www.flickr.com/photos/57777529@N02/5647058774/)
