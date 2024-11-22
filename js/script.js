// Fungsi untuk fetch data
async function fetchData() {
    try {
      const response = await fetch('http://localhost:3000/api/sensor');
      const data = await response.json();
  
      if (data.code === 200 && Array.isArray(data.data) && data.data.length > 0) {
        const tableBody = document.getElementById('tableBody');
        tableBody.innerHTML = ''; // Clear existing rows
  
        data.data.forEach(row => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${row.id_sensor}</td>
            <td>${row.sensor_X}</td>
            <td>${row.sensor_Y}</td>
            <td>${row.sensor_Z}</td>
            <td>${row.info_XYZ}</td>
            <td>${row.cahaya}</td>
            <td>${row.info_cahaya}</td>
            <td>${row.time_stamp.split(' ')[0]}</td> <!-- Date part -->
            <td>${row.time_stamp.split(' ')[1]}</td> <!-- Time part -->
            <td>
              <button onclick="editData(${row.id_sensor}, '${row.sensor_X}', '${row.sensor_Y}', '${row.sensor_Z}', '${row.info_XYZ}', '${row.cahaya}', '${row.info_cahaya}')">Edit</button>
              <button onclick="deleteData(${row.id_sensor})">Delete</button>
            </td>
          `;
          tableBody.appendChild(tr);
        });
      } else {
        document.getElementById('tableBody').innerHTML = '<tr><td colspan="10" class="text-center py-4">No data available for today.</td></tr>';
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      document.getElementById('tableBody').innerHTML = '<tr><td colspan="10" class="text-center py-4">Failed to fetch data.</td></tr>';
    }
  }
  
  // Fungsi untuk menambah atau mengedit data
  document.getElementById('addSensorForm').addEventListener('submit', async function(event) {
    event.preventDefault();
  
    const sensorData = {
      sensor_X: document.getElementById('sensorX').value,
      sensor_Y: document.getElementById('sensorY').value,
      sensor_Z: document.getElementById('sensorZ').value,
      info_XYZ: document.getElementById('infoXYZ').value,
      cahaya: document.getElementById('cahaya').value,
      info_cahaya: document.getElementById('infoCahaya').value,
    };
  
    const sensorId = document.getElementById('sensorId').value;
  
    try {
      let response;
      if (sensorId) {
        // Edit data
        response = await fetch(`http://localhost:3000/api/sensor/${sensorId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(sensorData)
        });
      } else {
        // Add new data
        response = await fetch('http://localhost:3000/api/sensor', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(sensorData)
        });
      }
  
      const data = await response.json();
      if (data.code === 201 || data.code === 200) {
        alert(sensorId ? 'Data updated successfully' : 'Data added successfully');
        fetchData(); // Refresh table
        resetForm(); // Reset the form
      } else {
        alert('Failed to add or update data');
      }
    } catch (error) {
      console.error('Error adding or updating data:', error);
      alert('Error adding or updating data');
    }
  });
  
  // Fungsi untuk mengedit data
  function editData(id, sensorX, sensorY, sensorZ, infoXYZ, cahaya, infoCahaya) {
    document.getElementById('sensorId').value = id;
    document.getElementById('sensorX').value = sensorX;
    document.getElementById('sensorY').value = sensorY;
    document.getElementById('sensorZ').value = sensorZ;
    document.getElementById('infoXYZ').value = infoXYZ;
    document.getElementById('cahaya').value = cahaya;
    document.getElementById('infoCahaya').value = infoCahaya;
  
    document.getElementById('formTitle').innerText = 'Edit Data Sensor';
    document.getElementById('submitButton').innerText = 'Update Data';
  }
  
  // Fungsi untuk menghapus data
  async function deleteData(id) {
    const confirmDelete = confirm('Apakah Anda Ingin Menghapus Data?');
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:3000/api/sensor/${id}`, {
          method: 'DELETE',
        });
        const data = await response.json();
        if (data.code === 200) {
          alert('Data deleted successfully');
          fetchData(); // Refresh table
        } else {
          alert('Failed to delete data');
        }
      } catch (error) {
        console.error('Error deleting data:', error);
        alert('Error deleting data');
      }
    }
  }
  
  // Reset form after add or edit
  function resetForm() {
    document.getElementById('sensorId').value = '';
    document.getElementById('sensorX').value = '';
    document.getElementById('sensorY').value = '';
    document.getElementById('sensorZ').value = '';
    document.getElementById('infoXYZ').value = '';
    document.getElementById('cahaya').value = '';
    document.getElementById('infoCahaya').value = '';
    document.getElementById('formTitle').innerText = 'Tambah Data Sensor';
    document.getElementById('submitButton').innerText = 'Tambah Data';
  }
  
  // Fetch data on page load
  window.onload = fetchData;
  