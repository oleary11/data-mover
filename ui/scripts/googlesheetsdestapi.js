document.getElementById('submit-button').addEventListener('click', (event) => {
    event.preventDefault(); // Prevent the form from submitting and refreshing the page
  
    const sourceType = document.getElementById('destination').value;
    const SeetName = document.getElementById('dest-name').value;
    const SheetID = document.getElementById('dest-spreadsheet-id').value;
  
    const requestData = {
      SourceType: SourceType,
      SheetId: SheetID,
      SheetName: sheetName
    };
  
    fetch('http://localhost:5555/source', {
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