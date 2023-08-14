// open db
let db;
let sum;
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

// display word bank
let display;
const words = document.getElementById("test");

function readWords() {
  if (display == true) {
    while (words.firstChild) {
      words.removeChild(words.firstChild);
    }
    display = false;
  } else {
    console.log("load words");
    while (words.firstChild) {
      words.removeChild(words.firstChild);
    }

    openRequest.addEventListener("success", () => {
      console.log("opened again");
    });

    const category = function() {
      // for category page, on category click, this variable is passed into the getData function to display results requested by user
    };

    db = openRequest.result;

    const transaction = db.transaction(["wordbank_os"], "readonly");

    const objectStore = transaction.objectStore("wordbank_os");

    //const index = objectStore.index("translation");

    objectStore.openCursor().onsuccess = event => {
      let cursor = event.target.result;

      if (cursor) {
        console.log(cursor.value.word);

        const p1 = document.createElement("p");
        const b1 = document.createElement("button");
        p1.textContent = cursor.value.word;
        words.appendChild(p1);
        //b1.textContent = "delete";
        // words.appendChild(b1);

        cursor.continue();
      } else {
        console.log("Your words displayed :)");
        display = true;
      }
    };
  }
}

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
