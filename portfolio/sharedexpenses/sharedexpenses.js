const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// console.log("canvas width: " + canvas.width);
// console.log("canvas height: " + canvas.height);

// console.log("canvas parent width: " + canvas.parentNode.clientWidth);
// console.log("canvas parent height: " + canvas.parentNode.clientHeight);

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
const resultsP = document.getElementById("showResults");

// calc input results
function calcAvg() {
  const u1 = document.getElementById("u1").value;
  const e1 = document.getElementById("e1").value;
  const u2 = document.getElementById("u2").value;
  const e2 = document.getElementById("e2").value;

  const sum = parseFloat(e1, 10) + parseFloat(e2, 10);

  let avg = sum / 2;
  avg = avg.toFixed(2);

  const stat1 = e1 - avg;
  const stat2 = e2 - avg;

  if (stat1 > 0) {
    resultsP.textContent = u1 + " is owed $" + stat1.toFixed(2);
  } else {
    resultsP.textContent = u2 + " is owed $" + stat2.toFixed(2);
  }
}

// add data
function addData() {
  // get values
  const u1 = document.getElementById("u1").value;
  const e1 = document.getElementById("e1").value;
  const u2 = document.getElementById("u2").value;
  const e2 = document.getElementById("e2").value;
  const calcSum = parseFloat(e1, 10) + parseFloat(e2, 10);
  const sum = calcSum.toFixed(2);
  let d = new Date();

  d = d.toDateString();

  db = openRequest.result;
  // load values
  const newRecord = {
    date: d,
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
  // let results = document.getElementById("results");
  resultsP.textContent = "Added to your records.";
  displayData();
}
function displayGraph() {
  // const graphData = [];
  // define data point plotting function
  // const plot = function() {
  //   // setup graph
  //   // declare graph origin
  //   const originX = 40;
  //   const originY = 300;
  //   // define function to draw line relative to graph origin, given x and y coordinates
  //   const origin = function(x, y) {
  //     ctx.beginPath();
  //     ctx.moveTo(originX, originY);
  //     ctx.lineTo(x, y);
  //     ctx.stroke();
  //   };
  //   const xAxis = {
  //     length: 300
  //   };
  //   // draw x axis from origin
  //   origin(xAxis.length, originY);
  //   const yAxis = {
  //     length: 270
  //   };
  //   //draw y axis from origin
  //   origin(originX, originY - yAxis.length);
  //   // mark static y axis divisons
  //   for (let i = 1; i < 16; i++) {
  //     let n = i * 100;
  //     let yChange = (yAxis.length / 15) * i;
  //     let x = originX;
  //     let y = originY - yChange;
  //     ctx.beginPath();
  //     ctx.moveTo(x - 5, y);
  //     ctx.lineTo(x + 5, y);
  //     ctx.stroke();
  //     ctx.fillStyle = "black";
  //     ctx.font = "12px Georgia";
  //     ctx.fillText(n, x - 35, y + 3);
  //   }
  //   const l = xAxis.length - 31;
  //   for (let i = 0; i < graphData.length; i++) {
  //     // divide x axis length into n parts, where n is graphData.length
  //     const n = graphData.length;
  //     let xScale = l / n;
  //     // console.log(xScale);
  //     let xCoord = xScale * i + 20;
  //     console.log(xCoord);
  //     // divide y axis length into 1500 parts
  //     let yScale = yAxis.length / 1500;
  //     let yCoord = graphData[i].y * yScale;
  //     let x = originX + xCoord;
  //     let y = originY - yCoord;
  //     // create visual data point (rect)
  //     ctx.strokeStyle = "black";
  //     ctx.fillStyle = "white";
  //     ctx.fillRect(x - 2.5, y, 5, 5);
  //     ctx.strokeRect(x - 2.5, y, 5, 5);
  //     // add dynamic x axis divisions
  //     ctx.beginPath();
  //     ctx.moveTo(x, originY - 5);
  //     ctx.lineTo(x, originY + 10);
  //     ctx.stroke();
  //     // ctx.save();
  //     // ctx.fillStyle = "black";
  //     // ctx.font = "12px Georgia";
  //     // ctx.translate(0, 0);
  //     // ctx.rotate((Math.PI / 180) * -45);
  //     // ctx.textAlign = "center";
  //     // ctx.fillText(graphData[i].x, x, 100);
  //     // ctx.restore();
  //     // //ctx.scale(2, 2);
  //     const monthList = [
  //       "Jan",
  //       "Feb",
  //       "Mar",
  //       "Apr",
  //       "May",
  //       "Jun",
  //       "Jul",
  //       "Aug",
  //       "Sept",
  //       "Oct",
  //       "Nov",
  //       "Dec"
  //     ];
  //     // let date = graphData[i].x;
  //     // // let month = date.getMonth();
  //     // // let monthName = monthList[month];
  //     // ctx.fillStyle = "black";
  //     // ctx.font = "12px Georgia";
  //     // ctx.fillText(monthName, x - 8, originY + 20);
  //   }
  // };
}

//display data
function displayData() {
  // tableRows = document.getElementsByClassName("row");

  db = openRequest.result;

  // empty list
  const list = document.getElementById("list");
  let rows = list.children.length;

  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }

  const tHead = document.createElement("thead");
  const thRow = document.createElement("tr");
  const th1 = document.createElement("th");
  const th2 = document.createElement("th");
  const th3 = document.createElement("th");
  const th4 = document.createElement("th");
  const th5 = document.createElement("th");
  const th6 = document.createElement("th");
  th1.innerHTML = "date";
  th2.innerHTML = "name1";
  th3.innerHTML = "expense1";
  th4.innerHTML = "name2";
  th5.innerHTML = "expense2";
  th6.innerHTML = "sum";
  thRow.appendChild(th1);
  thRow.appendChild(th2);
  thRow.appendChild(th3);
  thRow.appendChild(th4);
  thRow.appendChild(th5);
  thRow.appendChild(th6);
  tHead.appendChild(thRow);
  list.appendChild(tHead);
  // ctx.clearRect(0, 0, canvas.width, canvas.height);
  // graphData.splice(0, graphData.length);
  // console.log("array length: " + graphData.length);

  // start transaction
  const objectStore = db.transaction(["records_os"]).objectStore("records_os");

  // const all = objectStore.getAll();
  // const show = all.results;
  // console.log(show);

  // get cursor
  objectStore.openCursor().addEventListener("success", e => {
    console.log("cursor opened");
    const cursor = e.target.result;

    // If there is still another data item to iterate through, keep running this code
    if (cursor) {
      // Create a list item and p to put each data item inside when displaying it
      // structure the HTML fragment, and append it inside the list

      // if (rows.length < 1) {

      // }

      // const newRecord = document.createElement("li");
      // const p1 = document.createElement("p");
      // const p2 = document.createElement("p");
      // const p3 = document.createElement("p");
      // const p4 = document.createElement("p");
      // const p5 = document.createElement("p");
      // const p6 = document.createElement("p");
      const tBody = document.createElement("tbody");
      const newRecord = document.createElement("tr");
      const p1 = document.createElement("td");
      const p2 = document.createElement("td");
      const p3 = document.createElement("td");
      const p4 = document.createElement("td");
      const p5 = document.createElement("td");
      const p6 = document.createElement("td");

      p1.setAttribute("class", "para");
      p2.setAttribute("class", "para");
      p3.setAttribute("class", "para");
      p4.setAttribute("class", "para");
      p5.setAttribute("class", "para");
      p6.setAttribute("class", "para");
      // newRecord.setAttribute("class", "row");

      newRecord.appendChild(p1);
      newRecord.appendChild(p2);
      newRecord.appendChild(p3);
      newRecord.appendChild(p4);
      newRecord.appendChild(p5);
      newRecord.appendChild(p6);
      tBody.appendChild(newRecord);
      list.appendChild(tBody);

      console.log(cursor.value);
      // Put the data from the cursor inside the paragraph
      // p1.textContent = "Date: " + cursor.value.date;
      // p2.textContent = "Contributor 1: " + cursor.value.name1;
      // p3.textContent = "Expense 1: " + cursor.value.expense1;
      // p4.textContent = "Contributor 1: " + cursor.value.name2;
      // p5.textContent = "Expense 2: " + cursor.value.expense2;
      // p6.textContent = "Total Expenses: $" + cursor.value.sum;

      p1.innerHTML = cursor.value.date;
      p2.innerHTML = cursor.value.name1;
      p3.innerHTML = cursor.value.expense1;
      p4.innerHTML = cursor.value.name2;
      p5.innerHTML = cursor.value.expense2;
      p6.innerHTML = cursor.value.sum;

      // Store the ID of the data item inside an attribute on the newRecord, so we know
      // which item it corresponds to. This will be useful later when we want to delete items
      newRecord.setAttribute("cursorId", cursor.value.id);

      // Create a button and place it inside each newRecord
      const deleteBtn = document.createElement("button");
      newRecord.appendChild(deleteBtn);
      deleteBtn.textContent = "Delete";

      // Create a button and place it inside each newRecord
      const editID = "editBtn: " + cursor.value.id;
      const editBtn = document.createElement("button");
      editBtn.setAttribute("id", editID);
      newRecord.appendChild(editBtn);
      editBtn.textContent = "Edit";
      editBtn.setAttribute("data-bs-toggle", "modal");
      editBtn.setAttribute("data-bs-target", "#myModal");
      // editBtn.setAttribute("type", "button");
      // editBtn.className = "btn btn-primary";

      const button = document.createElement("button");
      newRecord.appendChild(button);
      button.textContent = "Test";

      button.addEventListener("click", e => saveData(e));

      deleteBtn.addEventListener("click", e => deleteRecord(e));

      editBtn.addEventListener("click", e => editData(e));

      // // add data to graph data array
      // const dataPoint = {
      //   x: cursor.value.date,
      //   y: cursor.value.sum
      // };
      // graphData.push(dataPoint);

      // Iterate to the next item in the cursor

      cursor.continue();
    } else {
      // console.log("new array length: " + graphData.length);
      // plot();
      // Again, if list item is empty, display a 'No notes stored' message
      if (!list.firstChild) {
        const tHead = document.createElement("thead");
        const thRow = document.createElement("tr");
        const th1 = document.createElement("th");
        const th2 = document.createElement("th");
        const th3 = document.createElement("th");
        const th4 = document.createElement("th");
        const th5 = document.createElement("th");
        const th6 = document.createElement("th");

        th1.innerHTML = "cursor.value.date";
        th2.innerHTML = "cursor.value.name1";
        th3.innerHTML = "cursor.value.expense1";
        th4.innerHTML = "cursor.value.name2";
        th5.innerHTML = "cursor.value.expense2";
        th6.innerHTML = "cursor.value.sum";
        tHead.appendChild(thRow);
        list.appendChild(tHead);
        // const newRecord = document.createElement("li");
        // newRecord.textContent = "No records stored.";
        // list.appendChild(newRecord);
      }
    }
  });

  objectStore.openCursor().addEventListener("error", e => {
    console.log("error");
  });

  // if there are no more cursor items to iterate through, say so and if jejsuehhey whats
  console.log("Notes all displayed");
}
// HIDE DATA FUNCTION
function hideData() {
  const list = document.getElementById("list");
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }
}

function editData(event) {
  db = openRequest.result;
  console.group("tDfields.length");

  const modalRecord = document.getElementById("modal-record");
  const footer = document.getElementById("footer");

  //

  // const record = document.createElement("div");
  // record.className = "align-items-center justify-content-center";
  // const main = document.getElementById("main");
  // main.appendChild(record);
  // record.setAttribute("id", "record");

  // get row and remove all children
  // const row = event.target.parentNode;
  // const tDfields = row.getElementsByClassName("para");
  // console.group(row);
  // console.group(tDfields.length);

  // // const tDfields = row.getElementsByClassName(para);
  // while (tDfields.length > 0) {
  //   row.removeChild(row.firstChild);
  //   let tDiv = document.createElement("td");
  //   let field = document.createElement("input");
  //   tDiv.innerHTML = field;
  //   // tDiv.appendChild(field);
  //   row.appendChild(field);
  // }

  // get p elements on record by class and remove them
  // function removeElementsByClass(className) {
  //   const elements = document.getElementsByClassName(className);
  //   while (elements.length > 0) {
  //     elements[0].parentNode.removeChild(elements[0]);
  //   }
  // }
  // removeElementsByClass("para");

  // get record and start transaction to populate to content editable fields for record update
  const record = event.target.parentNode;
  const attr = record.getAttribute("cursorId");
  let id = parseInt(attr);

  // let id = record.getAttribute("cursorId");

  const transaction = db.transaction(["records_os"], "readwrite");
  const objectStore = transaction.objectStore("records_os");
  const getRequest = objectStore.get(id);

  const save = document.createElement("button");
  save.setAttribute("id", "save");
  save.innerText = "Save";

  getRequest.onsuccess = () => {
    console.log(getRequest.result);
    console.log(getRequest.result.name1);
  };

  objectStore.openCursor().onsuccess = event => {
    const cursor = event.target.result;
    if (cursor) {
      console.log(cursor);
      const i1 = document.createElement("input");
      const i1Tag = document.createElement("label");
      const i2 = document.createElement("input");
      const i3 = document.createElement("input");
      const i4 = document.createElement("input");
      const i5 = document.createElement("input");
      const i6 = document.createElement("input");

      i1.type = "date";
      // i1Tag.setAttribute("for");
      // i1Tag.textContent = "contributor 1";
      i2.type = "text";
      i3.type = "number";
      i4.type = "text";
      i5.type = "number";
      i6.type = "number";
      console.log(cursor.value.date);

      i1.value = cursor.value.date;
      i2.value = cursor.value.name1;
      i3.value = cursor.value.expense1;
      i4.value = cursor.value.name2;
      i5.value = cursor.value.expense2;
      i6.value = cursor.value.sum;

      i1.setAttribute("class", "para");
      i1.setAttribute("id", "i1");
      i2.setAttribute("class", "para");
      i2.setAttribute("id", "i2");
      i3.setAttribute("class", "para");
      i3.setAttribute("id", "i3");
      i4.setAttribute("class", "para");
      i4.setAttribute("id", "i4");
      i5.setAttribute("class", "para");
      i5.setAttribute("id", "i5");
      i6.setAttribute("class", "para");
      i6.setAttribute("id", "i6");

      modalRecord.appendChild(i1);
      // record.appendChild(i1Tag);
      modalRecord.appendChild(i2);
      modalRecord.appendChild(i3);
      modalRecord.appendChild(i4);
      modalRecord.appendChild(i5);
      modalRecord.appendChild(i6);
      footer.appendChild(save);

      // cursor.continue();
    } else {
      console.log("Entries all displayed.");
    }
  };

  const editID = event.target.id;
  console.log(editID);
  const editBtn = document.getElementById(editID);

  // editBtn.removeEventListener("click", editData());
  save.addEventListener("click", e => saveData(e, id));
  save.setAttribute("type", "button");
  save.setAttribute("data-bs-dismiss", "modal");
  save.className = "btn btn-danger";
}

function saveData(event, id) {
  db = openRequest.result;

  // const record = event.target.parentNode;
  // const attr = record.getAttribute("cursorId");
  // const id = parseInt(attr);

  const modalRecord = document.getElementById("modal-record");
  const footer = document.getElementById("footer");

  const save = document.getElementById("save");
  save.setAttribute("id", "");
  footer.removeChild(save);

  const i1Value = i1.value;
  const i2Value = i2.value;
  const i3Value = i3.value;
  const i4Value = i4.value;
  const i5Value = i5.value;
  const i6Value = i6.value;
  console.log(i1Value);
  // get record data from object store by id
  const transaction = db.transaction(["records_os"], "readwrite");
  const objectStore = transaction.objectStore("records_os");

  // get getRequest to add event handler and on success update record property
  const getRequest = objectStore.get(id);

  getRequest.onsuccess = () => {
    const record = getRequest.result;

    // Change the value of the key
    record.date = i1Value;
    record.name1 = i2Value;
    record.expense1 = i3Value;
    record.name2 = i4Value;
    record.expense2 = i5Value;
    record.sum = i6Value;

    // Create a request to update
    const updateRequest = objectStore.put(record);

    updateRequest.onsuccess = () => {
      console.log("record successfully updated.");
      // modalRecord.innerHTML = "";
    };
  };

  displayData();
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
}

// function openDiv(e, divName) {
//   // Declare all variables
//   var i, tabcontent, tablinks;

//   // Get all elements with class="tabcontent" and hide them
//   tabcontent = document.getElementsByClassName("tabcontent");
//   for (i = 0; i < tabcontent.length; i++) {
//     tabcontent[i].style.display = "none";
//   }

//   // Get all elements with class="tablinks" and remove the class "active"
//   tablinks = document.getElementsByClassName("tablinks");
//   for (i = 0; i < tablinks.length; i++) {
//     tablinks[i].className = tablinks[i].className.replace("active", "");
//   }

//   // Show the current tab, and add an "active" class to the button that opened the tab
//   document.getElementById(divName).style.display = "block";
//   e.currentTarget.className += "active";
// }
