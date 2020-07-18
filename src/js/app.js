try {
  window.paper = require('paper/dist/paper-full');
    
} catch (e) {}

  document.addEventListener('DOMContentLoaded', function(){

    paper.install(window)
    paper.setup("canvas")

    var path;

    tool1 = new Tool();
    tool1.onMouseDown = onMouseDown;
    tool1.onMouseUp = onMouseUp;
    
    tool1.onMouseDrag = function(event) {
      path.add(event.point);
    }
    
    function onMouseDown(event) {
      path = new Path();
      path.strokeColor = new Color(0, 161, 255, 0.80);
      path.fillColor = new Color(0, 161, 255, 0.40);
      path.strokeWidth = 2;
      path.add(event.point);
    }
    
    function onMouseUp(event) {
      path.closed = true;
      
      initCanv();
    }
    
    function initCanv(){
      document.getElementById('bgImage').style.visibility = 'hidden';
      var raster = new Raster({
          source: '/src/images/vangogh.jpg',
          crossOrigin: 'anonymous',
          // when it is loaded
          onLoad: function() {
              // scale it down and place it at view center
              // this.scale(0.25);
              this.position = view.center;

              // create a clipping rectangle based on raster bounds
              var clippingRectangle = new Path.Rectangle(raster.bounds);
              // create a clipping group with a clipping rectangle as first child
              var group = new Group(path, raster, clippingRectangle);
              group.clipped = true;
    
              // rasterize layer
              var rasterized = project.activeLayer.rasterize();
              // show rasterized layer bounds
              rasterized.selected = true;
              // place rasterized layer at the right of original drawing
              rasterized.position += [raster.bounds.width + 50, 0];
          }
      });
    }

    var btnDownload = document.getElementById("btnDownload");
    btnDownload.addEventListener("click", dowlonadImg);

    function dowlonadImg(){
      console.log(document.getElementById("canvas").toDataURL());
      download(document.getElementById("canvas"), 'croppedImage.png');
    }
    
    function download(canvas, filename) {
      /// create an "off-screen" anchor tag
      var lnk = document.createElement('a'), e;
    
      /// the key here is to set the download attribute of the a tag
      lnk.download = filename;
    
      /// convert canvas content to data-uri for link. When download
      /// attribute is set the content pointed to by link will be
      /// pushed as "download" in HTML5 capable browsers
      lnk.href = canvas.toDataURL("image/png;base64");
    
      /// create a "fake" click-event to trigger the download
      if (document.createEvent) {
        e = document.createEvent("MouseEvents");
        e.initMouseEvent("click", true, true, window,
                         0, 0, 0, 0, 0, false, false, false,
                         false, 0, null);
    
        lnk.dispatchEvent(e);
      } else if (lnk.fireEvent) {
        lnk.fireEvent("onclick");
      }
    }
    
});

