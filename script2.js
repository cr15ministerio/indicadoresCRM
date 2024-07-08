function processCSV() {
    const fileInput = document.getElementById('csvFileInput');
    const file = fileInput.files[0];

    if (!file) {
        alert('Cargar reporte del CRM');
        return;
    }

    Papa.parse(file, {
        header: true,
        complete: function(results) {
            const data = results.data;
            filterPastActivities(data);
        }
    });
}

function parseDate(dateStr) {
    if (!dateStr) {
        return null;
    }
    const [day, month, year] = dateStr.split('/');
    return new Date(year, month - 1, day);
}

function filterPastActivities(data) {
    const today = new Date();
    const pastActivities = data.filter(activity => {
        const endDate = parseDate(activity['fecha-fin']);
        return endDate && endDate < today;
    });

    displayActivities(pastActivities);
}

function displayActivities(activities) {
    const output = document.getElementById('output');
    output.innerHTML = '';

    if (activities.length === 0) {
        output.innerHTML = '<p>No se encontraron actividades.</p>';
        return;
    }

    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    const tfoot = document.createElement('tfoot');

    // Create table headers
    const headers = ['Id', 'Fecha inicio', 'Fecha fin', 'Estudiantes'];
    const tr = document.createElement('tr');
    headers.forEach(header => {
        const th = document.createElement('th');
        th.innerText = header;
        tr.appendChild(th);
    });
    thead.appendChild(tr);

    // Create table rows
    let totalParticipants = 0;
    activities.forEach(activity => {
        const tr = document.createElement('tr');
        const tdName = document.createElement('td');
        const tdStartDate = document.createElement('td');
        const tdEndDate = document.createElement('td');
        const tdParticipants = document.createElement('td');

        tdName.innerText = activity['idActividad'] || 'Unnamed Activity';
        tdStartDate.innerText = activity['fecha-inicio'];
        tdEndDate.innerText = activity['fecha-fin'];
        tdParticipants.innerText = activity['cupo-asig'];

        tr.appendChild(tdName);
        tr.appendChild(tdStartDate);
        tr.appendChild(tdEndDate);
        tr.appendChild(tdParticipants);
        tbody.appendChild(tr);

        totalParticipants += parseInt(activity['cupo-asig'], 10) || 0;
    });

    // Create table footer for total participants
    const trTotal = document.createElement('tr');
    const tdTotalLabel = document.createElement('td');
    tdTotalLabel.colSpan = 3;
    tdTotalLabel.innerText = 'Total de estudiantes';
    const tdTotalValue = document.createElement('td');
    tdTotalValue.innerText = totalParticipants;

    trTotal.appendChild(tdTotalLabel);
    trTotal.appendChild(tdTotalValue);
    tfoot.appendChild(trTotal);

    table.appendChild(thead);
    table.appendChild(tbody);
    table.appendChild(tfoot);
    output.appendChild(table);
}
