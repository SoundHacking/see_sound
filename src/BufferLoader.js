//https://www.html5rocks.com/en/tutorials/webaudio/intro/js/buffer-loader.js

function BufferLoader(context, url_one, callback) {
    this.context = context;
    this.url_one = url_one;
    this.onload = callback;
    this.bufferOne = new Array();
    this.loadCount = 0;
  }
  
  BufferLoader.prototype.loadBuffer = function(url) {
    // Load buffer asynchronously
    var request = new XMLHttpRequest();
    request.open("GET", [url], true);
    request.responseType = "arraybuffer";
  
    var loader = this;
  
    request.onload = function() {
      // Asynchronously decode the audio file data in request.response
      loader.context.decodeAudioData(
        request.response,
        function(buffer) {
          if (!buffer) {
            alert('error decoding file data: ' + url);
            return;
          }
          loader.bufferOne[0] = buffer;
          loader.onload(loader.bufferOne);
        },
        function(error) {
          console.error('decodeAudioData error', error);
        }
      );
    }
  
    request.onerror = function() {
      alert('BufferLoader: XHR error');
    }
  
    request.send();
  }
  
  BufferLoader.prototype.load = function() {
    this.loadBuffer(this.url_one);
  }

export{
    BufferLoader
}