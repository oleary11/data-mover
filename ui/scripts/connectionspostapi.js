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
      xhr.open('GET', 'http://localhost:5555/connection');
      xhr.send();
    });
  }
  
  function populateConnectionTable(sourceType) {
    getAllSource()
      .then((list) => {
        const connectionTable = document.getElementById('connectiontable');
        const tableBody = connectionTable.querySelector('tbody');
        tableBody.innerHTML = ''; // Clear existing rows
  
        list.forEach(item => {
            const row = tableBody.insertRow();            
            row.insertCell().textContent = item.ConnectionId;
            row.insertCell().textContent = item.SourceId;
            row.insertCell().textContent = item.DestinationId;
            row.insertCell().textContent = item.Frequency;
            row.insertCell().textContent = item.LastSync;
            row.insertCell().textContent = item.IsEnabled ? "Active" : "Inactive";
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    populateConnectionTable();
  });
  
  