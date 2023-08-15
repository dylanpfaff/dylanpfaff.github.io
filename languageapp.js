/*

// setup
const canvas = document.querySelector(".myCanvas");
const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);
const ctx = canvas.getContext("2d");

// import munch
const munch = new Image();
munch.src = "pot.png";

// draw munch
ctx.drawImage(munch, 500, 500, 100, 100);
*/

// open db
let db;
let sum;
let display;

const openRequest = window.indexedDB.open("wordbank_db", 1);

openRequest.addEventListener("error", () =>
  console.log("Database failed to open")
);

openRequest.addEventListener("success", () => {
  console.log("Database opened successfully");
});

openRequest.addEventListener("upgradeneeded", e => {
  db = e.target.result;

  const objectStore = db.createObjectStore("wordbank_os", {
    keyPath: "id",
    autoIncrement: "true"
  });

  objectStore.createIndex("word", "word", { unique: false });
  objectStore.createIndex("translation", "translation", { unique: false });
  objectStore.createIndex("category", "category", { unique: false });

  console.log("Database setup complete");
});

// add data
function addData() {
  // get values
  let word = document.getElementById("new-word").value;
  let translation = document.getElementById("translation").value;
  let category = document.getElementById("category").value;

  db = openRequest.result;
  // load values
  const newRecord = {
    word: word,
    translation: translation,
    category: category
  };

  // start transaction
  const transaction = db.transaction(["wordbank_os"], "readwrite");

  const objectStore = transaction.objectStore("wordbank_os");

  const addRequest = objectStore.add(newRecord);

  addRequest.addEventListener("success", () => {
    //const form = document.getElementById("form");
    //form.reset();
    console.log(newRecord.keyPath);
    console.log("success!");
  });

  transaction.addEventListener("complete", () => {
    console.log("Transacton completed: database modification finished");
    console.log(newRecord.word);
  });

  readWords();
}

// display word bank
function readWords() {
  const words = document.getElementById("wordbank");

  // check if words are already displayed using boolean
  if (display) {
    while (words.firstChild) {
      words.removeChild(words.firstChild);
    }
    display = false;
  } else {
    // empty div to prevent duplicate results displayed
    while (words.firstChild) {
      words.removeChild(words.firstChild);
    }

    // start read transaction
    db = openRequest.result;

    const transaction = db.transaction(["wordbank_os"], "readonly");

    const objectStore = transaction.objectStore("wordbank_os");

    // get cursor
    objectStore.openCursor().onsuccess = event => {
      let cursor = event.target.result;

      if (cursor) {
        // variables for values
        const word = cursor.value.word;
        const translation = cursor.value.translation;
        // create elements
        const p1 = document.createElement("p");
        const p2 = document.createElement("p");
        const b1 = document.createElement("button");

        // load valuues
        p1.textContent = word;
        p2.textContent = translation;
        b1.textContent = "delete";

        // assign attributes
        p1.className = "word";
        p1.setAttribute("id", cursor.value.id);
        b1.className = "dltBtn";
        b1.addEventListener("click", e => deleteWord(e));

        // append delete button to p
        p1.appendChild(b1);

        // append p to div
        words.appendChild(p1);

        // attach event handler to p1
        p1.addEventListener("click", () => {
          if (p1.className == "word") {
            p1.textContent = word;
            p2.textContent = "translation: " + translation;
            p1.appendChild(b1);

            p1.className = "card";
            document.body.setAttribute("id", "newbody");

            console.log(p1.childNodes);
          } else if (p1.className == "card") {
            p1.textContent = word;
            p2.textContent = "translation: " + translation;
            p1.appendChild(b1);

            p1.className = "word";
            document.body.setAttribute("id", "");
          }
        });

        cursor.continue();
      } else {
        display = true;
        console.log("All words displayed");
        console.log(display);
      }
    };
  }
}

function deleteWord(event) {
  const record = event.target.parentNode;
  const id = parseInt(record.id);

  db = openRequest.result;

  const tx = db.transaction(["wordbank_os"], "readwrite");

  const os = tx.objectStore("wordbank_os");

  const deleteReq = os.delete(id);

  deleteReq.addEventListener("success", id =>
    console.log("successful removal of word")
  );

  deleteReq.addEventListener("error", id =>
    console.log("error trying to remove word")
  );

  readWords();
}

/*

//display data
function displayData() {
  openRequest.addEventListener("success", () => {
    console.log("Database opened successfully");
  });
  db = openRequest.result;

  // empty list
  var list = document.getElementById("list");
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }

  // start transaction
  const objectStore = db
    .transaction(["wordbank_os"])
    .objectStore("wordbank_os");

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

      newRecord.appendChild(p1);
      newRecord.appendChild(p2);
      newRecord.appendChild(p3);
      list.appendChild(newRecord);

      // Put the data from the cursor inside the paragraph
      p1.textContent = "Word: " + cursor.value.word;
      p2.textContent = "Translation: " + cursor.value.translation;
      p3.textContent = "Category: " + cursor.value.category;

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

      // Iterate to the next item in the cursor
      cursor.continue();
    } else {
      // Again, if list item is empty, display a 'No notes stored' message
      if (!list.firstChild) {
        const newRecord = document.createElement("li");
        newRecord.textContent = "No notes stored.";
        list.appendChild(newRecord);
      }
    }
    // if there are no more cursor items to iterate through, say so
    console.log("Notes all displayed");
    console.log(cursor.value.word);
  });
}
*/

/*
  //for (let i = 0; i < wordbank_os.length)
  // const getRequest = objectStore.get(1);

  const getRequest = objectStore.getAll();

  //.addEventListener("success", getRequest => console.log(getRequest.result));

  //words.textContent = getRequest.result;

  getRequest.addEventListener("success", e => {
    result = e.target.result.word;

    console.log(e.target.result); // array returned
    console.log(e.target.result[0]); // object returned (from array)
    console.log(e.target.result.word);
    console.log(e.target.result.translation);
    console.log(e.target.result.category);
    words.textContent = result;
  });
}
*/

/*
function readWords() {
    const words = document.getElementById("test");
  
    openRequest.addEventListener("success", () => {
      console.log("opened again");
    });
  
    db = openRequest.result;
  
    const transaction = db.transaction(["wordbank_os"], "readonly");
  
    const objectStore = transaction.objectStore("wordbank_os");
  
    //for (let i = 0; i < wordbank_os.length)
    // const getRequest = objectStore.get(1);
  
    const getRequest = objectStore.getAll();
  
    //.addEventListener("success", getRequest => console.log(getRequest.result));
  
    //words.textContent = getRequest.result;
  
    getRequest.addEventListener("success", e => {
      result = e.target.result.word;
  
      console.log(e.target.result); // array returned
      console.log(e.target.result[0]); // object returned (from array)
      console.log(e.target.result.word);
      console.log(e.target.result.translation);
      console.log(e.target.result.category);
      words.textContent = result;
    });
}*/
