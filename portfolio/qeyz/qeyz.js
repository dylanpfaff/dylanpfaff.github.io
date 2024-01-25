// setup
const canvas = document.querySelector(".myCanvas");
const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);
const ctx = canvas.getContext("2d");
const centerX = width / 2;
const centerY = height * 0.9;
//let s;
//start of program, and eventually start of tree
//const start = new Date();

// import tree trunk photo
const image = new Image();
image.src = "branch.png";
image.setAttribute("id", "branch");

const imagetwo = new Image();
imagetwo.src = "pot.png";
imagetwo.setAttribute("id", "pot");

const bkgd = new Image();
bkgd.src = "bkgd.png";
bkgd.setAttribute("id", "bkgd");

// ctx.fillRect(25, 25, 100, 100);
// ctx.clearRect(45, 45, 60, 60);
// ctx.strokeRect(50, 50, 50, 50);

let x = 0;

let y = 185;

let n = 1;

let w = 25;
let h = 25;

//define animation loop
const loop = function() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(86, 187, 105, 0.8)";
  ctx.fillRect(0, 0, width, height);

  ctx.drawImage(image, centerX, y, 100, 100);
  ctx.drawImage(bkgd, centerX - 200, centerY, 500, 500);
  ctx.drawImage(imagetwo, centerX, 150, 100, 100);

  y -= 1;

  //   console.log(n);

  //   for (let i = 0; i < n; i++) {
  //     // draw background
  //     ctx.fillStyle = "rgba(86, 187, 105, 0.8)";
  //     ctx.fillRect(w * i, h, w, h);
  //   }

  // timer display in seconds
  ctx.strokeStyle = "white";
  ctx.lineWidth = 1;
  ctx.font = "36px arial";
  ctx.strokeText("seconds: " + n, 50, 50, 200, 200);

  n += 1;

  //call animation loop
  setTimeout(() => {
    requestAnimationFrame(loop);
  }, 1000);

  // n += 1;
  //   x += 25;

  // for (let i = 0; i < n; i++) {
  //   // draw background
  //   ctx.fillStyle = "rgba(86, 187, 105, 0.8)";

  //   ctx.fillRect(x, x, 100, 100);
  // }

  // ctx.clearRect(45, 45, 60, 60);
  // ctx.strokeRect(50, 50, 50, 50);
  // ctx.fillRect(0, 0, width, height);
  // ctx.drawImage(pot, centerX - 75, centerY - 60, 150, 150);

  // update tree
  // tree.updateTree();

  // draw tree image
  // tree.drawTree();

  // timer display in seconds
  // ctx.strokeStyle = "white";
  // ctx.lineWidth = 1;
  // ctx.font = "36px arial";
  // ctx.strokeText("height: " + tree.nodes[0].h, centerX, centerY - 100);

  // console.log(y);
};

// on load call animation loop
window.addEventListener("load", () => loop());
