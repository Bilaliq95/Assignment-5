const fs = require("fs");

class Data {
  constructor(employees, classes) {
    this.employees = employees;
    this.classes = classes;
  }
}

let dataCollection = null;

module.exports.initialize = function () {
  return new Promise((resolve, reject) => {
    fs.readFile("./data/classes.json", "utf8", (err, classesData) => {
      if (err) {
        reject("unable to load classes");
        return;
      }

      fs.readFile("./data/employees.json", "utf8", (err, employeeData) => {
        if (err) {
          reject("unable to load employees");
          return;
        }

        dataCollection = new Data(
          JSON.parse(employeeData),
          JSON.parse(classesData)
        );
        resolve();
      });
    });
  });
};

module.exports.addEmployee = function (employeeData) {
  return new Promise((resolve, reject) => {
    try {
      // Set EA to false if undefined, otherwise set it to true
      employeeData.EA = employeeData.EA === undefined ? false : true;

      // Set employeeNum property based on the length of the employees array
      employeeData.employeeNum = dataCollection.employees.length + 1;

      // Push the new employeeData to the employees array
      dataCollection.employees.push(employeeData);

      // Resolve the promise with the updated dataCollection
      resolve(dataCollection);
    } catch (error) {
      // Reject the promise if an error occurs
      reject(error);
    }
  });
};

module.exports.getAllEmployees = function () {
  return new Promise((resolve, reject) => {
    if (dataCollection.employees.length == 0) {
      reject("query returned 0 results");
      return;
    }

    resolve(dataCollection.employees);
  });
};

module.exports.getEAs = function () {
  return new Promise(function (resolve, reject) {
    var filteredemployees = [];

    for (let i = 0; i < dataCollection.employees.length; i++) {
      if (dataCollection.employees[i].EA == true) {
        filteredemployees.push(dataCollection.employees[i]);
      }
    }

    if (filteredemployees.length == 0) {
      reject("query returned 0 results");
      return;
    }

    resolve(filteredemployees);
  });
};

module.exports.getPartTimers = function () {
  return new Promise(function (resolve, reject) {
    var filteredemployees = [];

    for (let i = 0; i < dataCollection.employees.length; i++) {
      if (dataCollection.employees[i].status == "Part Time") {
        filteredemployees.push(dataCollection.employees[i]);
      }
    }

    if (filteredemployees.length == 0) {
      reject("query returned 0 results");
      return;
    }

    resolve(filteredemployees);
  });
};

module.exports.getclasses = function () {
  return new Promise((resolve, reject) => {
    if (dataCollection.classes.length == 0) {
      reject("query returned 0 results");
      return;
    }

    resolve(dataCollection.classes);
  });
};
