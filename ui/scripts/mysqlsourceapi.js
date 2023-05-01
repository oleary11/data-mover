document.getElementById('mysql-source-submit-button').addEventListener('click', (event) => {
    event.preventDefault(); // Prevent the form from submitting and refreshing the page

    const SourceType = document.getElementById('source').value;
    const Host = document.getElementById('host').value;
    const Port = document.getElementById('port').value;
    const DBName = document.getElementById('database-name').value;
    const Username = document.getElementById('username').value;
    const Password = document.getElementById('password').value;
  
    const requestData = {
      SourceType: SourceType,
      Host: Host,
      Port: Port,
      DBName: DBName,
      Username: Username,
      Password: Password,
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