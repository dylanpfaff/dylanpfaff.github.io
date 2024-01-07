
// get canvas
let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');
let body = document.querySelector('body');


// get image
let img = new Image();
img.src = "sa.png";
// img.src = "sand.png";
img.setAttribute("id", "timer");

let song = new Audio();
song.src = "congrats.mp3"



// call drawing on img load
img.onload = function() {
  init();
  
};


// setup canvas and image parameters
const width = img.naturalWidth/3;
const height = img.naturalHeight;
const scale = 1;
const scaledWidth = scale * width;
const scaledHeight = scale * height;

canvas.width = img.naturalWidth / 3 * scale;
canvas.height = img.naturalHeight * scale;


 
window.addEventListener("click", song.play());


// let imgCenter = width / 2;
// let windowCenter = window.visualViewport.width / 2;
// let canvasCenter = windowCenter - imgCenter;
// console.log("window.visualViewport.width: " + window.visualViewport.width);
// console.log("windowCenter: " + windowCenter);
// console.log("canvasCenter: " + canvasCenter);
// console.log("imgCenter: " + imgCenter);
console.log(img.naturalHeight);


// 
function drawFrame(frameX, frameY, canvasX, canvasY) {
    ctx.drawImage(img,
                  frameX * width, frameY * height, width, height,
                  canvasX, canvasY, scaledWidth, scaledHeight);
  }

  function init() {
    window.requestAnimationFrame(step);
  }
  

const cycleLoop = [0, 1, 2];
let currentLoopIndex = 0;
let frameCount = 0;

// if(true){
//     window.cancelAnimationFrame();
//   }

function step() {
  frameCount++;
  if (frameCount < 10) {
    window.requestAnimationFrame(step);
    return;
  }
  frameCount = 0;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawFrame(cycleLoop[currentLoopIndex], 0, 0, 0);
  currentLoopIndex++;
  if (currentLoopIndex >= cycleLoop.length) {
    currentLoopIndex = 0;
  }
// if (currentLoopIndex >= cycleLoop.length) {
//     // window.cancelAnimationFrame();
//     currentLoopIndex = 0;
// //   }
  window.requestAnimationFrame(step);
}


