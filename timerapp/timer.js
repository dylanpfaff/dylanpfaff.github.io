
function show(shown, hidden) {
  document.getElementById(shown).style.display='block';
  document.getElementById(hidden).style.display='none';
  return false;
}

show("page-1", "page-2");
// get canvas

let canvas = document.getElementById("time-canvas");
let ctx = canvas.getContext('2d');

//let body = document.querySelector('body');

// get audio
let song = new Audio();
song.src = "congrats.mp3"

// player variables
// let newPlayer = document.getElementById("new-player").innerHTML;


let players = [];
// let player = document.getElementById("player");
// player.innerHTML = "on deck: " + players[0];
class Player {

  constructor (name){
    this.name = name;
    this.turns = [];
  }
}


// timer variables
let on = false;
let t = 0;
let time = document.getElementById("time");
let clear; 
let currentPlayer;
let currentPlayerTurns;
let currentPlayerIndex = 0;
let numberOfPlayers = 0;
let rounds = 0;
time.innerHTML = t;

let addPlayers = function(){
if (numberOfPlayers == 0){
  let table = document.getElementById("stats");

  for (let i = 1; i < 5; i++){


    let player = document.getElementById('player-' + i).value;

    if(!player){
      console.log("empty slot");
    }
    if(player){
    let newPlayer = new Player(player);
    players.push(newPlayer);
    numberOfPlayers++;
    let newRow = document.createElement("tr");
    let playerName = document.createElement("td");
    let playerTurns = document.createElement("td");
    newRow.appendChild(playerName);
    newRow.appendChild(playerTurns);
    table.appendChild(newRow);
    playerName.innerHTML = player;
    //playerTurns.innerHTML
    playerName.setAttribute("id", player);
    playerTurns.setAttribute("id", player + "array");
    }
  }


  console.log("number of players: " + numberOfPlayers);
  //currentPlayerIndex = 0;
  currentPlayer = players[currentPlayerIndex].name;
  currentPlayerTurns = players[currentPlayerIndex].turns;
  time.innerHTML =  currentPlayer + ": " + t;

  show('page-1', 'page-2');
}
}


let startCount = function(){
  clear = setInterval(myTimer, 1000);
  on = true;
};

let stopCount = function(){
  clearInterval(clear);
  on = false;
  if (currentPlayer){
    time.innerHTML = currentPlayer + ": " + t;
    }
    if (!currentPlayer){
      time.innerHTML = t;
    }
};

function myTimer() {
  t++;
  if (currentPlayer){
  time.innerHTML = currentPlayer + ": " + t;
  }

  if (!currentPlayer){
    time.innerHTML = t;
  }

}


// setTimeout() for turn limit 
let turns = document.getElementById("turns");


let startButton = document.getElementById("start-button");
startButton.addEventListener("click", () => {
  if(!on){
    startCount();
  } else {
  stopCount();
  };
});

let resetButton = document.getElementById("reset-button");
resetButton.addEventListener("click", () => {

  if(currentPlayer){
  currentPlayerTurns.push(t);

  // sum total time

let sum = 0;
let secs;
let mins;
let hrs;

function sumMembers(){
  

  for(let i = 0; i < currentPlayerTurns.length; i++){

    sum += currentPlayerTurns[i];
    
  } 

}
  
sumMembers();

function convertToHMS(){


hrs = Math.floor(sum / 3600);

mins = Math.floor(sum % 3600 / 60);

secs = Math.floor(sum % 3600 % 60);

console.log(hrs + ":" + mins + ":" + secs);
}

convertToHMS();

  //let id = players[currentPlayerIndex].turns;
  // update turns 
  document.getElementById(currentPlayer + "array").innerHTML = hrs + "h:" + mins + "m:" + secs + "s";
  
  

  console.log("LOG => current player: " + currentPlayer + ", time: " +  t + ", turns: " + 
  currentPlayerTurns.length + ", array: " + currentPlayerTurns + ", total rounds: " + rounds);

  currentPlayerIndex++;

  if (currentPlayerIndex >= numberOfPlayers){
    currentPlayerIndex = 0;
    rounds++;
  }

  document.getElementById("rounds").innerHTML = "Rounds: " + rounds;

  
  currentPlayer = players[currentPlayerIndex].name;
  currentPlayerTurns = players[currentPlayerIndex].turns;
  console.log("Next up: " + currentPlayer + ", turns: " + 
  currentPlayerTurns.length + ", array: " + currentPlayerTurns);
}
// update player stats // add list
// for (let i = 0; i < numberOfPlayers; i++){
//   playerStats.innerHTML = "player: " + players[i].name + ", turns: " + 
//   players[i].turns.length + ", array: " + players[i].turns + ", total rounds: " + rounds;
//   };

  t = 0;
  stopCount();
  startCount();
});

// get timer image
let timer = new Image();
timer.src = "sa.png";
timer.setAttribute("id", "timer");

// call drawing on timer load
timer.onload = function() {
  init();
  
};

// setup canvas and image parameters
const width = timer.naturalWidth/3;
const height = timer.naturalHeight;
const scale = 1.5;
const scaledWidth = scale * width;
const scaledHeight = scale * height;


canvas.width = timer.naturalWidth / 3 * scale;
canvas.height = timer.naturalHeight * scale;

// custom draw image by sprite and canvas frame
function drawFrame(frameX, frameY, canvasX, canvasY) {
    ctx.drawImage(timer,
                  frameX * width, frameY * height, width, height,
                  canvasX, canvasY, scaledWidth, scaledHeight);
  }

  function init() {
    window.requestAnimationFrame(step);
  }
  

const cycleLoop = [0, 1, 2];
let currentLoopIndex = 0;
let frameCount = 0;


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


