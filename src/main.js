import {Bootstrap} from "./bs_utils.js"
import {BufferLoader} from "./BufferLoader.js"


let bs = new Bootstrap()
let context;
let bufferLoader;
const b = document.body

async function main(){

  let btn = bs.button(b,"btn_test",`play sound`);
  $(btn).click(()=>{

    function finishedLoading(bufferList) {
      // Create two sources and play them both together.
      var source1 = context.createBufferSource();
      source1.buffer = bufferList[0];
    
      source1.connect(context.destination);
      source1.start(0);
    }

    context = new AudioContext();
    bufferLoader = new BufferLoader(context,'piano2.wav',finishedLoading);
    bufferLoader.load();    
  })
}

main().then();

