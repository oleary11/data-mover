document.getElementById('mysql-dest-submit-button').addEventListener('click', (event) => {
    event.preventDefault(); // Prevent the form from submitting and refreshing the page
  
    const DestinationType = document.getElementById('destination').value;
    const Host = document.getElementById('host').value;
    const Port = document.getElementById('port').value;
    const DBName = document.getElementById('dbname').value;
    const User = document.getElementById('username').value;
    const Pass = document.getElementById('password').value;
  
    const requestData = {
        DestinationType: DestinationType,
        Host: Host,
        Port: Port,
        DBName: DBName,
        User: User,
        Pass: Pass
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