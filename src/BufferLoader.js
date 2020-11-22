//https://www.html5rocks.com/en/tutorials/webaudio/intro/js/buffer-loader.js

function BufferLoader() {
  }
  
  BufferLoader.prototype.loadBuffer = function(context, url, callback) {
    // Load buffer asynchronously
    var request = new XMLHttpRequest();
    request.open("GET", [url], true);
    request.responseType = "arraybuffer";
  
    this.onload = callback;
    this.context = context;
    this.bufferOne = new Array();
    var loader = this;
  
    request.onload = function() {
      // Asynchronously decode the audio file data in request.response
      loader.context.decodeAudioData(request.response,
                                      function(buffer) {loader.onload(buffer);},
                                      function(error) {console.error('decodeAudioData error', error);}
                                    );
    }
  
    request.onerror = function() {alert('BufferLoader: XHR error');}
    request.send();
  }
  
export{
    BufferLoader
}
