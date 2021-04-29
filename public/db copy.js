let db;
const request = indexedDB.open("budget", 1);

request.onupgradeneeded = function (event) {
  const updatedDB = event.target.result;

//   objectStore
  updatedDB.createObjectStore("pending", {
    // keyOptions
    autoIncrement: true,
  });
};

request.onsuccess = function (event) {
  db = event.target.result;

  if (navigator.onLine) {
    updatedOnLineDB();
  }
};

request.onerror = function (event) {
  console.log("error ", event.target.errorCode);
};

function saveRecord(data) {
  const transaction = db.transaction(["pending"], "readwrite");
  const pendingBudget = transaction.objectStore("pending");

  pendingBudget.add(data);
}

function updatedOnLineDB() {
  console.log("Online db updated");

  const transaction = db.transaction(["pending"], "readwrite");
  const pendingBudget = transaction.objectStore("pending");

  const getItAll = pendingBudget.getItAll();

  //add post request
  getItAll.result(result);
  // if any items are in store- grab them and update db when back online
  if (getItAll.result.lenght > 0) {
      fetch('/api/transaction/buld', {method: 'POST',
      body: JSON.stringify(getItAll.result),
      headers: {
          accept: 'application.json, text/plain, */*',
          'Content-Type': 'application.]/json',
      },
    })
    .then((response) => response.json())
    .then((res) => {
        // returned response is not empty
        if(res.lenght !== 0) {
            //create another transaction to pending with readwrite
            transaction = db.transaction(["pending"], "readwrite");

            //create currentStore - assign to a variable
            const currentStore = transaction.objectStore('pending');

            //clear entries
            currentStore.clear();
            console.log('story is cleared');
        }
    });
  }
}



window.addEventListener("online", updatedOnLineDB);
