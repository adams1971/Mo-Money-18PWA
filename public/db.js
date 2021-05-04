let db;
const request = indexedDB.open("budget", 1);

request.onupgradeneeded = function (event) {
  db = event.target.result;

  //   objectStore
  db.createObjectStore("pending", {
    // keyOptions
    autoIncrement: true,
  });
};


request.onerror = function (event) {
  console.log("error ", event.target.errorCode);
};

function updatedOnLineDB() {
  console.log("Online db updated");

  let transaction = db.transaction(["pending"], "readwrite");
  const pendingBudget = transaction.objectStore("pending");

  const getAll = pendingBudget.getAll();

  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((res) => {
          console.log("fetch response: ", res);

          transaction = db.transaction(["pending"], "readwrite");

          const currentStore = transaction.objectStore("pending");

          currentStore.clear();
          // location.reload();
        });
    }
  };
}

request.onsuccess = function (event) {

  console.log(event)
  db = event.target.result;

  if (navigator.onLine) {
    console,log("Backend On Line")
    updatedOnLineDB();
  }
};

function saveRecord(data) {
  console.log ("save record",data)
  const transaction = db.transaction(["pending"], "readwrite");
  const pendingBudget = transaction.objectStore("pending");

  pendingBudget.add(data);
}

window.addEventListener("online", updatedOnLineDB);
