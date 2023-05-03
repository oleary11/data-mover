function getAllSource() {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject('Error fetching data');
          }
        }
      };
      xhr.open('GET', 'http://localhost:5555/destination');
      xhr.send();
    });
  }
  
  function populateSourceTable(destType, tableId) {
    getAllSource()
      .then((list) => {
        const filteredList = list.filter(x => x.DestinationType === destType);
        const tableBody = document.getElementById(tableId).querySelector('tbody');
        tableBody.innerHTML = ''; // Clear any existing rows
  
        filteredList.forEach(item => {
          if (item.DestinationType == "GoogleSheets") {
            const row = tableBody.insertRow();
            row.insertCell().textContent = item.DestinationId;
            row.insertCell().textContent = item.SheetName;
            row.insertCell().textContent = item.SheetId;
          }
  
          if (item.DestinationType == "MySQL") {
            const row = tableBody.insertRow();
            row.insertCell().textContent = item.DestinationId;
            row.insertCell().textContent = item.Host;
            row.insertCell().textContent = item.Port;
            row.insertCell().textContent = item.DBName;
            row.insertCell().textContent = item.User;
            const passwordCell = row.insertCell();
            passwordCell.className = "masked-password";
            passwordCell.innerHTML = `
              <span class="actual-password" style="display:none;">${item.User}</span>
              <span class="bullets">●●●●●●●</span>
            `;
          }
  
          if (item.DestinationType == "BigQuery") {
            const row = tableBody.insertRow();
            row.insertCell().textContent = item.DestinationId;
            row.insertCell().textContent = item.ProjectId;
            row.insertCell().textContent = item.DatasetId;
            row.insertCell().textContent = item.TableId;
            row.insertCell().textContent = item.key;
          }
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }
  
  
  document.addEventListener('DOMContentLoaded', () => {
    populateSourceTable('GoogleSheets', 'googlesheetsdesttable');
    populateSourceTable('MySQL', 'mysqldesttable');
    populateSourceTable('BigQuery', 'bigquerydesttable');
  });  
  
  