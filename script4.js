function processCSV() {
    const fileInput = document.getElementById('csvFileInput');
    const file = fileInput.files[0];

    if (!file) {
        alert('Antes seleccionar archivo CSV.');
        return;
    }

    Papa.parse(file, {
        header: true,
        complete: function(results) {
            const data = results.data;
            countOrganizations(data);
        }
    });
}

function countOrganizations(data) {
    const orgCount = {};

    data.forEach(activity => {
        const organization = activity['organizacion'];
        if (organization) {
            if (!orgCount[organization]) {
                orgCount[organization] = 0;
            }
            orgCount[organization]++;
        }
    });

    displayOrganizations(orgCount);
}

function displayOrganizations(orgCount) {
    const output = document.getElementById('output');
    output.innerHTML = '';

    const sortedOrganizations = Object.keys(orgCount).sort();

    if (sortedOrganizations.length === 0) {
        output.innerHTML = '<p>No se encontraron organizaciones.</p>';
        return;
    }

    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    const tfoot = document.createElement('tfoot');

    // Create table headers
    const headers = ['Organización', 'Cantidad de ACAP'];
    const tr = document.createElement('tr');
    headers.forEach(header => {
        const th = document.createElement('th');
        th.innerText = header;
        tr.appendChild(th);
    });
    thead.appendChild(tr);

    // Create table rows
    sortedOrganizations.forEach(organization => {
        const tr = document.createElement('tr');
        const tdOrg = document.createElement('td');
        const tdCount = document.createElement('td');

        tdOrg.innerText = organization;
        tdCount.innerText = orgCount[organization];

        tr.appendChild(tdOrg);
        tr.appendChild(tdCount);
        tbody.appendChild(tr);
    });

    // Create table footer for total organizations
    const trTotal = document.createElement('tr');
    const tdTotalLabel = document.createElement('td');
    tdTotalLabel.colSpan = 1;
    tdTotalLabel.innerText = 'Total de organizaciones';
    const tdTotalValue = document.createElement('td');
    tdTotalValue.innerText = sortedOrganizations.length;

    trTotal.appendChild(tdTotalLabel);
    trTotal.appendChild(tdTotalValue);
    tfoot.appendChild(trTotal);

    table.appendChild(thead);
    table.appendChild(tbody);
    table.appendChild(tfoot);
    output.appendChild(table);
}
