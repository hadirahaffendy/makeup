const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');

/*untuk get element*/
var fileNameInput = document.getElementById('fileName');
var btnCreate = document.getElementById('btnCreate');
var fileContents = document.getElementById('fileContents');
var fileTable = document.getElementById('fileTable');
var fileTableBody = document.getElementById('fileTableBody');

let pathName = path.join(__dirname, 'Files');
let currentFileNumber = 1; // Initialize the file number counter

function updateTable() {
  const rows = fileTableBody.getElementsByTagName('tr');
  currentFileNumber = 1; // Reset the file number counter
  for (let i = 0; i < rows.length; i++) {
    rows[i].getElementsByTagName('td')[0].textContent = currentFileNumber++;
  }
}

/* untuk add row kt table yg display brand*/
function addRowToTable(fileName, fileContent) {
  var contentLines = fileContent.split('\n');
  var startNumber = currentFileNumber; // Store the initial file number

  contentLines.forEach(content => {
    var newRow = document.createElement('tr');
    var fileNumberCell = document.createElement('td');
    fileNumberCell.textContent = currentFileNumber++; // Set the file number and increment

    var contentCell = document.createElement('td');
    contentCell.textContent = content;

    var actionCell = document.createElement('td');

    /*untuk delete content*/
    var deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', function() {
      var contentToDelete = contentCell.textContent;
      var updatedContent = fileContent.replace(`${contentToDelete}\n`, '');
      fs.writeFile(path.join(pathName, fileName), updatedContent, function(err) {
        if (err) {
          return console.log(err);
        }
        newRow.remove();
        alert('Content was deleted'); /*pop up untuk kalau dia dh n=berjaya delete content*/
        console.log('The content was deleted!');
        updateTable(); // Update the table after deleting content
      });
    });

    actionCell.appendChild(deleteButton);

    newRow.appendChild(fileNumberCell);
    newRow.appendChild(contentCell);
    newRow.appendChild(actionCell);

    fileTableBody.appendChild(newRow);
  });

  currentFileNumber = startNumber + 1; // Adjust the file number after adding content
  updateTable(); // Update the table after adding content
}

/*untuk clear table*/
function clearTable() {
  fileTableBody.innerHTML = '';
}

/* untuk display table yg ada brand*/
function showTable() {
  fileTable.style.display = 'table';
}

/*untuk display file*/
function displayFileContents() {
  let fileName = fileNameInput.value.trim();
  let file = path.join(pathName, fileName);

  fs.readFile(file, 'utf8', function(err, data) {
    if (err) {
      return console.log(err);
    }
    fileContents.value = data;
    alert(`${fileName} was read`);
    console.log('The file was read!'); 
    clearTable();
    addRowToTable(fileName, data);
    showTable(); // Show the table after reading content
  });
}

/*untuk create content masuk dalam brand.txt file*/
btnCreate.addEventListener('click', function() {
  let fileName = fileNameInput.value.trim();
  let file = path.join(pathName, fileName);
  let contents = fileContents.value;

  fs.appendFile(file, contents + '\n', function(err) {
    if (err) {
      return console.log(err);
    }

    alert(`New Top-5 brand was added to ${fileName}`);
    console.log('New content was added');
    fileContents.value = '';

    displayFileContents();
    showTable(); // Show the table after creating content
  });
});

/* untuk button read*/
btnRead.addEventListener('click', function() {
  displayFileContents();
});

/*untuk button update*/
btnUpdate.addEventListener('click', function() {
  let fileName = fileNameInput.value.trim();
  let file = path.join(pathName, fileName);
  let contents = fileContents.value;

  fs.writeFile(file, contents, function(err) {
    if (err) {
      return console.log(err);
    }
    alert(`The content \n${contents} was updated`);
    console.log('The file was updated');

    displayFileContents();
  });
});
