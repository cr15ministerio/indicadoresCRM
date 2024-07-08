function processCSV() {
    const fileInput = document.getElementById('csvFileInput');
    const file = fileInput.files[0];
  
    if (!file) {
        alert('Please select a CSV file first.');
        return;
    }
  
    Papa.parse(file, {
        header: true,
        complete: function(results) {
            const data = results.data;
            countSchoolActivities(data);
        }
    });
  }
  
  function countSchoolActivities(data) {
    const schoolCount = {};
    let totalActivities = 0;
  
    data.forEach(activity => {
        const school = activity['nombreEscuelaActividad'];
        if (school) {
            if (!schoolCount[school]) {
                schoolCount[school] = 0;
            }
            schoolCount[school]++;
            totalActivities++;
        }
    });
  
    displaySchools(schoolCount, totalActivities);
  }
  
  function displaySchools(schoolCount, totalActivities) {
    const output = document.getElementById('output');
    output.innerHTML = '';
  
    const sortedSchools = Object.keys(schoolCount).sort();
  
    if (sortedSchools.length === 0) {
        output.innerHTML = '<p>No schools found.</p>';
        return;
    }
  
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    const tfoot = document.createElement('tfoot');
  
    // Create table headers
    const headers = ['Escuela', 'Cant. ACAP'];
    const tr = document.createElement('tr');
    headers.forEach(header => {
        const th = document.createElement('th');
        th.innerText = header;
        tr.appendChild(th);
    });
    thead.appendChild(tr);
  
    // Create table rows
    sortedSchools.forEach(school => {
        const tr = document.createElement('tr');
        const tdSchool = document.createElement('td');
        const tdCount = document.createElement('td');
  
        tdSchool.innerText = school;
        tdCount.innerText = schoolCount[school];
  
        tr.appendChild(tdSchool);
        tr.appendChild(tdCount);
        tbody.appendChild(tr);
    });
  
    // Create table footer for total schools and activities
    const trTotal = document.createElement('tr');
    const tdTotalLabel = document.createElement('td');
    tdTotalLabel.colSpan = 1;
    tdTotalLabel.innerText = 'Total de escuelas';
    const tdTotalValue = document.createElement('td');
    tdTotalValue.innerText = sortedSchools.length;
  
    trTotal.appendChild(tdTotalLabel);
    trTotal.appendChild(tdTotalValue);
    tfoot.appendChild(trTotal);
  
    const trTotalActivities = document.createElement('tr');
    const tdTotalActivitiesLabel = document.createElement('td');
    tdTotalActivitiesLabel.colSpan = 1;
    tdTotalActivitiesLabel.innerText = 'Total de ACAP';
    const tdTotalActivitiesValue = document.createElement('td');
    tdTotalActivitiesValue.innerText = totalActivities;
  
    trTotalActivities.appendChild(tdTotalActivitiesLabel);
    trTotalActivities.appendChild(tdTotalActivitiesValue);
    tfoot.appendChild(trTotalActivities);
  
    table.appendChild(thead);
    table.appendChild(tbody);
    table.appendChild(tfoot);
    output.appendChild(table);
  }
  