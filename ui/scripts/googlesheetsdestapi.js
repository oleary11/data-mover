document.getElementById('submit-button').addEventListener('click', (event) => {
    event.preventDefault(); // Prevent the form from submitting and refreshing the page
  
    const sourceType = document.getElementById('destination').value;
    const sourceName = document.getElementById('dest-name').value;
    const spreadsheetLink = document.getElementById('dest-spreadsheet-link').value;
  
    const requestData = {
      sourceType: sourceType,
      sourceName: sourceName,
      rowBatchSize: parseInt(rowBatchSize),
      spreadsheetLink: spreadsheetLink,
    };
  
    fetch('http://localhost:3000/source', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  });