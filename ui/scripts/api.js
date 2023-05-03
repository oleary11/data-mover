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
      xhr.open('GET', 'http://localhost:5555/source');
      xhr.send();
    });
  }
  function getOptCost1() {
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
      xhr.open('GET', 'http://127.0.0.1:7777/get_instance?gcp_location=Mumbai&usage=1');
      xhr.send();
    });
  }

  function getOptCost2() {
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
      xhr.open('GET', 'http://127.0.0.1:7777/get_instance?aws_location=us-west-2&usage=1');
      xhr.send();
    });
  }

function getCostGCP() {
    getOptCost1()
    .then((data) => {
      const locationName = data["gcp"]["location_based"]["core"]["description"]
      const mylocationName = JSON.stringify(locationName);
      const locationPrice = data["gcp"]["location_based"]["core"]["price"]
      const mylocationPrice = JSON.stringify(locationPrice);
      document.getElementById("outputName").innerHTML = mylocationName;
      document.getElementById("outputPrice").innerHTML = mylocationPrice;
    })
    .catch((error) => {
      console.error(error);
    });
}

function getCostAWS() {
  getOptCost2()
  .then((data) => {
    const instanceName = data["aws"]["instance"]
    const myinstanceName = JSON.stringify(instanceName);
    const locationName = data["aws"]["location"]
    const mylocationName = JSON.stringify(locationName);
    const locationPrice = data["aws"]["price"]
    const mylocationPrice = JSON.stringify(locationPrice);
    document.getElementById("outputInstance").innerHTML = myinstanceName;
    document.getElementById("outputName").innerHTML = mylocationName;
    document.getElementById("outputPrice").innerHTML = mylocationPrice;
  })
  .catch((error) => {
    console.error(error);
  });
}


  function populateSourceTable(sourceType, tableId) {
    getAllSource()
      .then((list) => {
        const filteredList = list.filter(x => x.SourceType === sourceType);
        const tableBody = document.getElementById(tableId).querySelector('tbody');
        tableBody.innerHTML = ''; // Clear any existing rows
  
        filteredList.forEach(item => {
          if (item.SourceType == "GoogleSheets") {
            const row = tableBody.insertRow();
            row.insertCell().textContent = item.SourceId;            
            row.insertCell().textContent = item.SheetId;
            row.insertCell().textContent = item.SheetName;
          }
          
          if (item.SourceType == "MySQL") {
            const row = tableBody.insertRow();
            row.insertCell().textContent = item.SourceId;  
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
  
          if (item.SourceType == "BigQuery") {
            const row = tableBody.insertRow();
            row.insertCell().textContent = item.SourceId;  
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
  
  document.getElementById("costOptGCP").addEventListener("click", getCostGCP);

  document.getElementById("costOptAWS").addEventListener("click", getCostAWS);
  
  document.addEventListener('DOMContentLoaded', () => {
    populateSourceTable('GoogleSheets', 'googlesheetssourcetable');
    populateSourceTable('MySQL', 'mysqlsourcetable');
    populateSourceTable('BigQuery', 'bigquerysourcetable');
  });  
  
  
