document.getElementById('googlesheets-dest-submit-button').addEventListener('click', (event) => {
    event.preventDefault(); // Prevent the form from submitting and refreshing the page
  
    const DestinationType = document.getElementById('destination').value;
    const SheetName = document.getElementById('dest-sheet-name').value;
    const SheetID = document.getElementById('dest-sheet-id').value;
  
    const requestData = {
      DestinationType: DestinationType,
      SheetId: SheetID,
      SheetName: SheetName
    };
  
    fetch('http://localhost:5555/destination', {
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