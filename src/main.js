import {Bootstrap} from "./bs_utils.js"
import {BufferLoader} from "./BufferLoader.js"

let canvas_w;
let canvasCtx_w;
let canvas_f;
let canvasCtx_f;
let bufferLoader = new BufferLoader();
let bs = new Bootstrap()
let context;
let analyser;
const b = document.body
let dataArray_w;
let dataArray_f;
let bufferLength_w;
let bufferLength_f;

function draw_wave(){
  let WIDTH = canvas_w.width;
  let HEIGHT = canvas_w.height;
  canvasCtx_w.clearRect(0, 0, WIDTH, HEIGHT);
  analyser.getByteTimeDomainData(dataArray_w);

  canvasCtx_w.fillStyle = 'rgb(200, 200, 200)';
  canvasCtx_w.fillRect(0, 0, WIDTH, HEIGHT);

  canvasCtx_w.lineWidth = 2;
  canvasCtx_w.strokeStyle = 'rgb(0, 0, 0)';

  canvasCtx_w.beginPath();

  //console.log(`bufferLength : ${bufferLength}`)
  var sliceWidth = WIDTH * 1.0 / bufferLength_w;
  var x = 0;

  for(var i = 0; i < bufferLength_w; i++) {

    var v = dataArray_w[i] / 128.0;
    var y = v * HEIGHT/2;

    if(i === 0) {
      canvasCtx_w.moveTo(x, y);
    } else {
      canvasCtx_w.lineTo(x, y);
    }

    x += sliceWidth;
  }

  canvasCtx_w.lineTo(canvas_w.width, canvas_w.height/2);
  canvasCtx_w.stroke();
}

function draw_freq(){
  let WIDTH = canvas_f.width;
  let HEIGHT = canvas_f.height;
  canvasCtx_f.clearRect(0, 0, WIDTH, HEIGHT);
  analyser.getByteFrequencyData(dataArray_f);

  canvasCtx_f.fillStyle = 'rgb(0, 0, 0)';
  canvasCtx_f.fillRect(0, 0, WIDTH, HEIGHT);

  var barWidth = (WIDTH / bufferLength_f) * 2.5;
  var barHeight;
  var x = 0;

  for(var i = 0; i < bufferLength_f; i++) {
    barHeight = dataArray_f[i];

    canvasCtx_f.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
    canvasCtx_f.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight/2);

    x += barWidth + 1;
  }

}

function draw(){
  draw_wave()
  draw_freq()
  window.requestAnimationFrame(draw);
}

async function main(){

  let btn = bs.button(b,"btn_test",`play sound`);
  $(btn).click(()=>{

    function finishedLoading(buffer) {
      // Create two sources and play them both together.
      var source1 = context.createBufferSource()
      source1.buffer = buffer

      if(false){
        source1.connect(context.destination)
      }else{
        source1.connect(analyser)
        analyser.connect(context.destination)
        window.requestAnimationFrame(draw);
      }
      source1.start(0)
      console.log("started")
    }

    context = new (window.AudioContext || window.webkitAudioContext)();
    analyser = context.createAnalyser();
    analyser.fftSize = 2048;
    bufferLength_w = analyser.fftSize;
    bufferLength_f = analyser.frequencyBinCount;
    dataArray_w = new Uint8Array(bufferLength_w);
    dataArray_f = new Uint8Array(bufferLength_f);
    bufferLoader.loadBuffer(context,'piano2.wav',finishedLoading);
    
  })

  canvas_w = document.querySelector('.visualizer_w');
  canvas_f = document.querySelector('.visualizer_f');
  canvasCtx_w = canvas_w.getContext("2d");
  canvasCtx_f = canvas_f.getContext("2d");
  canvas_w.setAttribute('width',document.querySelector('.wrapper').clientWidth);
  canvas_f.setAttribute('width',document.querySelector('.wrapper').clientWidth);

}

main().then();

