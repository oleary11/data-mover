document.getElementById('googlesheets-source-submit-button').addEventListener('click', (event) => {
    event.preventDefault(); // Prevent the form from submitting and refreshing the page
  
    const SourceType = document.getElementById('source').value;
    const SheetId = document.getElementById('sheet-id').value;
    const SheetName = document.getElementById('sheet-name').value;
  
    const requestData = {
      SourceType: SourceType,
      SheetId: SheetId,
      SheetName: SheetName,
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