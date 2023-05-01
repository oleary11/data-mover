document.getElementById('googlesheets-source-submit-button').addEventListener('click', (event) => {
    event.preventDefault(); // Prevent the form from submitting and refreshing the page
  
    const SourceType = document.getElementById('source').value;
    const ProjectId = document.getElementById('project-id').value;
    const DatasetId = document.getElementById('dataset-id').value;
    const TableId = document.getElementById('table-id').value;
    const key = document.getElementById('key').value;
    
  
    const requestData = {
      SourceType: SourceType,
      ProjectID: ProjectId,
      DatasetId: DatasetId,
      TableId: TableId,
      key: key,
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