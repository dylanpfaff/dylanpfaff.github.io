const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// console.log("canvas width: " + canvas.width);
// console.log("canvas height: " + canvas.height);

// console.log("canvas parent width: " + canvas.parentNode.clientWidth);
// console.log("canvas parent height: " + canvas.parentNode.clientHeight);

const pot = new Image();
pot.src = "pot.png";
//pot.setAttribute("pot", id);

ctx.fillStyle = "rgba(130, 110, 189, 0.29)";

ctx.fillRect(0, 0, 329, 330);
//ctx.drawImage(pot, 0, 0, 50, 50);

// open db
let db;
let sum;
const openRequest = window.indexedDB.open("sharedapp_db", 1);

openRequest.addEventListener("error", () =>
  console.log("Database failed to open")
);

openRequest.addEventListener("success", () => {
  console.log("Database opened successfully");
  displayData();
});

openRequest.addEventListener("upgradeneeded", e => {
  db = e.target.result;

  const objectStore = db.createObjectStore("records_os", {
    keyPath: "id",
    autoIncrement: "true"
  });

  objectStore.createIndex("name1", "name1", { unique: false });
  objectStore.createIndex("expense1", "expense1", { unique: false });
  objectStore.createIndex("name2", "name2", { unique: false });
  objectStore.createIndex("expense2", "expense2", { unique: false });
  objectStore.createIndex("sum", "sum", { unique: false });
  objectStore.createIndex("date", "date", { unique: false });

  console.log("Database setup complete");
});

// calc input results
function calcAvg() {
  var u1 = document.getElementById("u1").value;
  var e1 = document.getElementById("e1").value;
  var u2 = document.getElementById("u2").value;
  var e2 = document.getElementById("e2").value;

  var sum = parseFloat(e1, 10) + parseFloat(e2, 10);

  var avg = sum / 2;
  avg = avg.toFixed(2);

  var stat1 = e1 - avg;
  var stat2 = e2 - avg;

  const resultsDiv = document.getElementById("results");
  if (stat1 > 0) {
    const p = document.createElement("p");
    p.setAttribute("id", results);
    p.textContent = u1 + " is owed $" + stat1.toFixed(2);
    resultsDiv.appendChild(p);
  } else {
    const p = document.createElement("p");
    p.setAttribute("id", results);
    p.textContent = u2 + " is owed $" + stat2.toFixed(2);
    resultsDiv.appendChild(p);
  }
}

// add data
function addData() {
  // get values
  var u1 = document.getElementById("u1").value;
  var e1 = document.getElementById("e1").value;
  var u2 = document.getElementById("u2").value;
  var e2 = document.getElementById("e2").value;
  var calcSum = parseFloat(e1, 10) + parseFloat(e2, 10);
  var sum = calcSum.toFixed(2);
  var date = new Date();
  // date = date.toDateString();

  db = openRequest.result;
  // load values
  const newRecord = {
    date: date,
    name1: u1,
    expense1: e1,
    name2: u2,
    expense2: e2,
    sum: sum
  };
  // start transaction
  const transaction = db.transaction(["records_os"], "readwrite");

  const objectStore = transaction.objectStore("records_os");

  const addRequest = objectStore.add(newRecord);

  addRequest.addEventListener("success", () => {
    const form = document.getElementById("form");
    form.reset();
    console.log(newRecord.keyPath);
  });

  transaction.addEventListener("complete", () => {
    console.log("Transacton completed: database modification finished");
  });
  let results = document.getElementById("results");
  results.textContent = "Added to your records.";
  displayData();
}

//display data
function displayData() {
  const graphData = [];
  // define data point plotting function
  const plot = function() {
    // setup graph

    // declare graph origin
    const originX = 40;
    const originY = 300;

    // define function to draw line relative to graph origin, given x and y coordinates
    const origin = function(x, y) {
      ctx.beginPath();
      ctx.moveTo(originX, originY);
      ctx.lineTo(x, y);
      ctx.stroke();
    };

    const xAxis = {
      length: 300
    };
    // draw x axis from origin
    origin(xAxis.length, originY);

    const yAxis = {
      length: 270
    };
    //draw y axis from origin
    origin(originX, originY - yAxis.length);

    // mark static y axis divisons
    for (let i = 1; i < 16; i++) {
      let n = i * 100;
      let yChange = (yAxis.length / 15) * i;

      let x = originX;
      let y = originY - yChange;
      ctx.beginPath();
      ctx.moveTo(x - 5, y);
      ctx.lineTo(x + 5, y);
      ctx.stroke();
      ctx.fillStyle = "black";
      ctx.font = "12px Georgia";
      ctx.fillText(n, x - 35, y + 3);
    }
    const l = xAxis.length - 31;

    for (let i = 0; i < graphData.length; i++) {
      // divide x axis length into n parts, where n is graphData.length
      const n = graphData.length;

      let xScale = l / n;
      // console.log(xScale);
      let xCoord = xScale * i + 20;
      console.log(xCoord);
      // divide y axis length into 1500 parts
      let yScale = yAxis.length / 1500;
      let yCoord = graphData[i].y * yScale;

      let x = originX + xCoord;
      let y = originY - yCoord;
      // create visual data point (rect)
      ctx.strokeStyle = "black";
      ctx.fillStyle = "white";
      ctx.fillRect(x - 2.5, y, 5, 5);
      ctx.strokeRect(x - 2.5, y, 5, 5);

      // add dynamic x axis divisions
      ctx.beginPath();
      ctx.moveTo(x, originY - 5);
      ctx.lineTo(x, originY + 10);
      ctx.stroke();

      // ctx.save();
      // ctx.fillStyle = "black";
      // ctx.font = "12px Georgia";
      // ctx.translate(0, 0);
      // ctx.rotate((Math.PI / 180) * -45);
      // ctx.textAlign = "center";
      // ctx.fillText(graphData[i].x, x, 100);
      // ctx.restore();
      // //ctx.scale(2, 2);
      const monthList = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sept",
        "Oct",
        "Nov",
        "Dec"
      ];
      let date = graphData[i].x;
      let month = date.getMonth();
      let monthName = monthList[month];

      ctx.fillStyle = "black";
      ctx.font = "12px Georgia";
      ctx.fillText(monthName, x - 8, originY + 20);
    }
  };

  db = openRequest.result;

  // empty list
  var list = document.getElementById("list");
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // graphData.splice(0, graphData.length);
  console.log("array length: " + graphData.length);

  // start transaction
  const objectStore = db.transaction(["records_os"]).objectStore("records_os");

  // get cursor
  objectStore.openCursor().addEventListener("success", e => {
    const cursor = e.target.result;

    // If there is still another data item to iterate through, keep running this code
    if (cursor) {
      // Create a list item and p to put each data item inside when displaying it
      // structure the HTML fragment, and append it inside the list

      const newRecord = document.createElement("li");
      const p1 = document.createElement("p");
      const p2 = document.createElement("p");
      const p3 = document.createElement("p");
      const p4 = document.createElement("p");
      const p5 = document.createElement("p");
      const p6 = document.createElement("p");

      newRecord.appendChild(p1);
      newRecord.appendChild(p2);
      newRecord.appendChild(p3);
      newRecord.appendChild(p4);
      newRecord.appendChild(p5);
      newRecord.appendChild(p6);
      list.appendChild(newRecord);

      let date = cursor.value.date;
      let string = date.toDateString();

      // Put the data from the cursor inside the paragraph
      p1.textContent = "Date: " + string;
      p2.textContent = "Contributor 1: " + cursor.value.name1;
      p3.textContent = "Expense 1: " + cursor.value.expense1;
      p4.textContent = "Contributor 1: " + cursor.value.name2;
      p5.textContent = "Expense 2: " + cursor.value.expense2;
      p6.textContent = "Total Expenses: $" + cursor.value.sum;

      // Store the ID of the data item inside an attribute on the newRecord, so we know
      // which item it corresponds to. This will be useful later when we want to delete items
      newRecord.setAttribute("cursorId", cursor.value.id);
      //console.log(cursor.value.id);
      //console.log(newRecord.getAttribute("cursorId"));
      // Create a button and place it inside each newRecord
      const deleteBtn = document.createElement("button");
      newRecord.appendChild(deleteBtn);
      deleteBtn.textContent = "Delete";

      // Set an event handler so that when the button is clicked, the deleteItem()
      // function is run

      deleteBtn.addEventListener("click", e => deleteRecord(e));

      // add data to graph data array
      const dataPoint = {
        x: cursor.value.date,
        y: cursor.value.sum
      };
      graphData.push(dataPoint);

      // Iterate to the next item in the cursor

      cursor.continue();
    } else {
      console.log("new array length: " + graphData.length);
      plot();
      // Again, if list item is empty, display a 'No notes stored' message
      if (!list.firstChild) {
        const newRecord = document.createElement("li");
        newRecord.textContent = "No notes stored.";
        list.appendChild(newRecord);
      }
    }
  });

  // if there are no more cursor items to iterate through, say so
  console.log("Notes all displayed");
}
// HIDE DATA FUNCTION
function hideData() {
  var list = document.getElementById("list");
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }
}

function deleteRecord(event) {
  db = openRequest.result;

  const record = event.target.parentNode;

  const attr = record.getAttribute("cursorid");

  const id = parseInt(attr);

  const transaction = db.transaction(["records_os"], "readwrite");

  const objectStore = transaction.objectStore("records_os");

  const deleteRequest = objectStore.delete(id);

  transaction.addEventListener("success", e => {
    console.log("transaction opened");
  });

  transaction.addEventListener("error", () => {
    console.log("transaction error");
  });

  deleteRequest.addEventListener("success", e => {
    record.parentNode.removeChild(record);
    console.log("Record" + id + " is deleted.");
    displayData();
  });

  console.log(id);
}
