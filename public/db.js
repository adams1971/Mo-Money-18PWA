let db;
const request = indexedDB.open("budget", 1);

request.onupgradeneeded = function (event) {
  const updatedDB = event.target.result;

  updatedDB.createObjectStore("pending", {
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
  const transaction = db.transaction(["penidng"], "readwrite");
  const pendingBudget = transaction.objectStore("pending");

  pendingBudget.add(data);
}

function updatedOnLineDB() {
  console.log("Online db updated");

  const transaction = db.transaction(["penidng"], "readwrite");
  const pendingBudget = transaction.objectStore("pending");

  const getItAll = pendingBudget.getItAll();



  //add post request
}

window.addEventListener("online", updatedOnLineDB);
