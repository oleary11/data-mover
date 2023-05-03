document.getElementById('connections-submit-button').addEventListener('click', (event) => {
    event.preventDefault(); // Prevent the form from submitting and refreshing the page
  
    const ConnectionId = document.getElementById('connection-id').value;
    const SourceId = document.getElementById('source-id').value;
    const DestinationId = document.getElementById('destination-id').value;
    const Frequency = document.getElementById('frequency').value;
  
    const requestData = {
        ConnectionId: ConnectionId,
        SourceId: SourceId,
        DestinationId: DestinationId,
        Frequency: Frequency
    };
  
    fetch('http://localhost:5555/connection', {
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