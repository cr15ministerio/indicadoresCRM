function processCSVacapEnCurso() {
    const fileInput = document.getElementById('csvFileInput');
    const file = fileInput.files[0];

    if (!file) {
        alert('Primero seleccionar archivo CSV.');
        return;
    }

    Papa.parse(file, {
        header: true,
        complete: function(results) {
            const data = results.data;
            filterCurrentActivities(data);
        }
    });
}

function processCSVacapFinalizadas() {
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

function processCSVorgConAcap() {
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

function processCSVescuelasConAcap() {
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

function parseDate(dateStr) {
    if (!dateStr) {
        return null;
    }
    const [day, month, year] = dateStr.split('/');
    return new Date(year, month - 1, day);
}

function filterCurrentActivities(data) {
    const today = new Date();
    const currentActivities = data.filter(activity => {
        const startDate = parseDate(activity['fecha-inicio']);
        const endDate = parseDate(activity['fecha-fin']);
        return startDate && endDate && startDate <= today && endDate >= today;
    });

    document.getElementById('tituloDelReporte').innerHTML = "ACAP en curso";
    document.getElementById('tituloDelReporte').style.visibility = 'visible';

    displayActivitiesAcapEnCurso(currentActivities);
}

function filterPastActivities(data) {
    const today = new Date();
    const pastActivities = data.filter(activity => {
        const endDate = parseDate(activity['fecha-fin']);
        return endDate && endDate < today;
    });

    document.getElementById('tituloDelReporte').innerHTML = "ACAP finalizadas";
    document.getElementById('tituloDelReporte').style.visibility = 'visible';

    displayActivitiesAcapFinalizadas(pastActivities);
}

function displayActivitiesAcapEnCurso(activities) {
    const output = document.getElementById('output');
    output.innerHTML = '';

    if (activities.length === 0) {
        output.innerHTML = '<p>No hay ACAP en curso.</p>';
        return;
    }

    // Ordenar actividades por 'organizacion' y luego por 'idActividad'
    activities.sort((a, b) => {
        if (a.organizacion < b.organizacion) return -1;
        if (a.organizacion > b.organizacion) return 1;
        if (a.idActividad < b.idActividad) return -1;
        if (a.idActividad > b.idActividad) return 1;
        return 0;
    });

    const uniqueIDs = new Set();
    let totalParticipants = 0;

    // Calculate totals
    activities.forEach(activity => {
        uniqueIDs.add(activity['idActividad']);
        totalParticipants += parseInt(activity['cupo-asig'], 10) || 0;
    });

    // Display summary
    const summary = document.createElement('p');
    summary.innerHTML = `Cantidad de ACAP: ${uniqueIDs.size} <br> Cantidad de cupos: ${totalParticipants}`;
    output.appendChild(summary);

    // Create table
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    const tfoot = document.createElement('tfoot');

    // Create table headers
    const headers = ['ID', 'Organización', 'Fecha inicio', 'Fecha fin', 'Cupos asignados'];
    const trHeader = document.createElement('tr');
    headers.forEach(header => {
        const th = document.createElement('th');
        th.innerText = header;
        trHeader.appendChild(th);
    });
    thead.appendChild(trHeader);

    // Create table rows
    activities.forEach(activity => {
        const tr = document.createElement('tr');
        const tdName = document.createElement('td');
        const tdOrg = document.createElement('td');
        const tdStartDate = document.createElement('td');
        const tdEndDate = document.createElement('td');
        const tdParticipants = document.createElement('td');

        tdName.innerText = activity['idActividad'] || 'Unnamed Activity';
        tdOrg.innerText = activity['organizacion'] || 'Unknown Organization';
        tdStartDate.innerText = activity['fecha-inicio'];
        tdEndDate.innerText = activity['fecha-fin'];
        tdParticipants.innerText = activity['cupo-asig'];

        tr.appendChild(tdName);
        tr.appendChild(tdOrg);
        tr.appendChild(tdStartDate);
        tr.appendChild(tdEndDate);
        tr.appendChild(tdParticipants);
        tbody.appendChild(tr);
    });

    // Create table footer for totals
    const trTotal = document.createElement('tr');
    const tdTotalIDLabel = document.createElement('td');
    tdTotalIDLabel.colSpan = 1;
    tdTotalIDLabel.innerText = uniqueIDs.size;
    const tdTotalEmpty = document.createElement('td');
    const tdTotalEmpty2 = document.createElement('td');
    const tdTotalEmpty3 = document.createElement('td');
    const tdTotalValue = document.createElement('td');
    tdTotalValue.innerText = totalParticipants;

    trTotal.appendChild(tdTotalIDLabel);
    trTotal.appendChild(tdTotalEmpty);
    trTotal.appendChild(tdTotalEmpty2);
    trTotal.appendChild(tdTotalEmpty3);
    trTotal.appendChild(tdTotalValue);
    tfoot.appendChild(trTotal);

    table.appendChild(thead);
    table.appendChild(tbody);
    table.appendChild(tfoot);
    output.appendChild(table);
}

function displayActivitiesAcapFinalizadas(activities) {
    const output = document.getElementById('output');
    output.innerHTML = '';

    if (activities.length === 0) {
        output.innerHTML = '<p>No se encontraron ACAP.</p>';
        return;
    }

    // Ordenar actividades por 'organizacion' y luego por 'idActividad'
    activities.sort((a, b) => {
        if (a.organizacion < b.organizacion) return -1;
        if (a.organizacion > b.organizacion) return 1;
        if (a.idActividad < b.idActividad) return -1;
        if (a.idActividad > b.idActividad) return 1;
        return 0;
    });

    const uniqueIDs = new Set();
    let totalParticipants = 0;

    // Calcular totales
    activities.forEach(activity => {
        uniqueIDs.add(activity['idActividad']);
        totalParticipants += parseInt(activity['cupo-asig'], 10) || 0;
    });

    // Mostrar leyenda de totales
    const summary = document.createElement('p');
    summary.innerHTML = `Cantidad de ACAP: ${uniqueIDs.size} <br> Cantidad de estudiantes: ${totalParticipants}`;
    output.appendChild(summary);

    // Crear tabla
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    const tfoot = document.createElement('tfoot');

    // Crear encabezados de tabla
    const headers = ['ID', 'Organización', 'Fecha inicio', 'Fecha fin', 'Estudiantes'];
    const trHeader = document.createElement('tr');
    headers.forEach(header => {
        const th = document.createElement('th');
        th.innerText = header;
        trHeader.appendChild(th);
    });
    thead.appendChild(trHeader);

    // Crear filas de tabla
    activities.forEach(activity => {
        const tr = document.createElement('tr');
        const tdName = document.createElement('td');
        const tdOrg = document.createElement('td');
        const tdStartDate = document.createElement('td');
        const tdEndDate = document.createElement('td');
        const tdParticipants = document.createElement('td');

        tdName.innerText = activity['idActividad'] || 'Unnamed Activity';
        tdOrg.innerText = activity['organizacion'] || 'Unknown Organization';
        tdStartDate.innerText = activity['fecha-inicio'];
        tdEndDate.innerText = activity['fecha-fin'];
        tdParticipants.innerText = activity['cupo-asig'];

        tr.appendChild(tdName);
        tr.appendChild(tdOrg);
        tr.appendChild(tdStartDate);
        tr.appendChild(tdEndDate);
        tr.appendChild(tdParticipants);
        tbody.appendChild(tr);
    });

    // Crear pie de tabla para totales
    const trTotal = document.createElement('tr');
    const tdTotalIDLabel = document.createElement('td');
    tdTotalIDLabel.colSpan = 1;
    tdTotalIDLabel.innerText = uniqueIDs.size;
    const tdTotalEmpty = document.createElement('td');
    const tdTotalEmpty2 = document.createElement('td');
    const tdTotalEmpty3 = document.createElement('td');
    const tdTotalValue = document.createElement('td');
    tdTotalValue.innerText = totalParticipants;

    trTotal.appendChild(tdTotalIDLabel);
    trTotal.appendChild(tdTotalEmpty);
    trTotal.appendChild(tdTotalEmpty2);
    trTotal.appendChild(tdTotalEmpty3);
    trTotal.appendChild(tdTotalValue);
    tfoot.appendChild(trTotal);

    table.appendChild(thead);
    table.appendChild(tbody);
    table.appendChild(tfoot);
    output.appendChild(table);
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
    document.getElementById('tituloDelReporte').innerHTML = "Organizaciones con ACAP";
    document.getElementById('tituloDelReporte').style.visibility = 'visible';

    const output = document.getElementById('output');
    output.innerHTML = '';

    const sortedOrganizations = Object.keys(orgCount).sort();

    if (sortedOrganizations.length === 0) {
        output.innerHTML = '<p>No se encontraron organizaciones.</p>';
        return;
    }

    // Calcular el total de actividades
    let totalActivities = 0;
    sortedOrganizations.forEach(organization => {
        totalActivities += orgCount[organization];
    });

    // Mostrar leyenda de totales
    const summary = document.createElement('p');
    summary.innerHTML = `Cantidad de organizaciones: ${sortedOrganizations.length} <br> Cantidad de ACAP: ${totalActivities}`;
    output.appendChild(summary);

    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    const tfoot = document.createElement('tfoot');

    // Crear encabezados de tabla
    const headers = ['Organización', 'Cantidad de ACAP'];
    const trHeader = document.createElement('tr');
    headers.forEach(header => {
        const th = document.createElement('th');
        th.innerText = header;
        trHeader.appendChild(th);
    });
    thead.appendChild(trHeader);

    // Crear filas de tabla
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

    // Crear pie de tabla para total de organizaciones y actividades
    const trTotal = document.createElement('tr');
    const tdTotalOrgLabel = document.createElement('td');
    tdTotalOrgLabel.innerText = sortedOrganizations.length;
    const tdTotalActivitiesValue = document.createElement('td');
    tdTotalActivitiesValue.innerText = totalActivities;

    trTotal.appendChild(tdTotalOrgLabel);
    trTotal.appendChild(tdTotalActivitiesValue);
    tfoot.appendChild(trTotal);

    table.appendChild(thead);
    table.appendChild(tbody);
    table.appendChild(tfoot);
    output.appendChild(table);
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

    document.getElementById('tituloDelReporte').innerHTML = "Escuelas con ACAP";
    document.getElementById('tituloDelReporte').style.visibility = 'visible';
  
    displaySchools(schoolCount, totalActivities);
  }

  function countUniqueSchools(activities) {
    const uniqueSchools = new Set();
    activities.forEach(activity => {
        uniqueSchools.add(activity['escuela']);
    });
    return uniqueSchools.size;
}

  function displaySchools(schoolCount, totalActivities) {
    const output = document.getElementById('output');
    output.innerHTML = '';

    const sortedSchools = Object.keys(schoolCount).sort();

    if (sortedSchools.length === 0) {
        output.innerHTML = '<p>No schools found.</p>';
        return;
    }

    // Mostrar leyenda de totales
    const summary = document.createElement('p');
    summary.innerHTML = `Cantidad de escuelas: ${sortedSchools.length} <br> Cantidad de actividades: ${totalActivities}`;
    output.appendChild(summary);

    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    const tfoot = document.createElement('tfoot');

    // Crear encabezados de tabla
    const headers = ['Escuela', 'Cant. ACAP'];
    const trHeader = document.createElement('tr');
    headers.forEach(header => {
        const th = document.createElement('th');
        th.innerText = header;
        trHeader.appendChild(th);
    });
    thead.appendChild(trHeader);

    // Crear filas de tabla
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

    // Crear pie de tabla para total de escuelas y actividades
    const trTotal = document.createElement('tr');
    const tdTotalSchools = document.createElement('td');
    tdTotalSchools.innerText = sortedSchools.length;
    const tdTotalActivities = document.createElement('td');
    tdTotalActivities.innerText = totalActivities;

    trTotal.appendChild(tdTotalSchools);
    trTotal.appendChild(tdTotalActivities);
    tfoot.appendChild(trTotal);

    table.appendChild(thead);
    table.appendChild(tbody);
    table.appendChild(tfoot);
    output.appendChild(table);
}
   // Función para leer el archivo CSV cargado
   function processCSV1() {
    const fileInput = document.getElementById('csvFileInput');
    const file = fileInput.files[0];

    if (!file) {
        alert('Primero seleccionar archivo CSV.');
        return;
    }

    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            complete: function(results) {
                resolve(results.data);
            },
            error: function(error) {
                reject(error);
            }
        });
    });
}

// Función para leer el archivo CSV desde el mismo directorio
function fetchCSVFile() {
    const url = 'escuelas-secciones-orientaciones-matricula.csv';
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al cargar el archivo CSV");
            }
            return response.text();
        })
        .then(text => {
            return Papa.parse(text, { header: true, skipEmptyLines: true }).data;
        });
}

// Función principal para generar el reporte
async function processCSVseccionesSinAcapOLD() {
    if (document.getElementById('csvFileInput').files.length === 0) {
        alert("Por favor, cargue el archivo CSV de actividades.");
        return;
    }

    try {
        const escuelasData = await fetchCSVFile(); // Nombre del archivo CSV de escuelas y secciones
        const actividadesData = await processCSV1();

        const reporte = generarReporteActividadesFaltantes(escuelasData, actividadesData);
        mostrarReporte(reporte);
    } catch (error) {
        console.error(error);
        alert("Error al obtener o procesar los archivos CSV.");
    }
}

//*******************************************************************************
// ************* Código para generar reporte de secciones SIN ACAP **************
//*******************************************************************************

// Función para leer el archivo CSV cargado
function processCSV1() {
    const fileInput = document.getElementById('csvFileInput');
    const file = fileInput.files[0];

    if (!file) {
        alert('Primero seleccionar archivo CSV.');
        return;
    }

    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            complete: function(results) {
                resolve(results.data);
            },
            error: function(error) {
                reject(error);
            }
        });
    });
}

// Función para leer el archivo CSV desde el mismo directorio
function fetchCSVFile1() {
    const url = 'escuelas-secciones-orientaciones-matricula.csv';
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al cargar el archivo CSV");
            }
            return response.text();
        })
        .then(text => {
            return Papa.parse(text, { header: true, skipEmptyLines: true }).data;
        });
}

// Función principal para generar el reporte
async function processCSVseccionesSinAcap() {
    if (document.getElementById('csvFileInput').files.length === 0) {
        alert("Por favor, cargue el archivo CSV de actividades.");
        return;
    }

    try {
        const escuelasData = await fetchCSVFile1(); // Nombre del archivo CSV de escuelas y secciones
        const actividadesData = await processCSV1();

        const reporte = generarReporteActividadesFaltantes(escuelasData, actividadesData);
        mostrarReporte1(reporte);
    } catch (error) {
        console.error(error);
        alert("Error al obtener o procesar los archivos CSV.");
    }
}

// Función para generar el reporte de actividades faltantes
function generarReporteActividadesFaltantes(escuelas, actividades) {
    const actividadesPorEscuelaSeccion = new Map();

    actividades.forEach(actividad => {
        const nombreEscuelaActividad = actividad.nombreEscuelaActividad ? actividad.nombreEscuelaActividad.trim() : '';
        const seccionEscuelaActividad = actividad.seccionEscuelaActividad ? actividad.seccionEscuelaActividad.trim() : '';
        const key = `${nombreEscuelaActividad}-${seccionEscuelaActividad}`;
        if (!actividadesPorEscuelaSeccion.has(key)) {
            actividadesPorEscuelaSeccion.set(key, []);
        }
        actividadesPorEscuelaSeccion.get(key).push(actividad.idActividad);
    });

    const reporte = [];

    escuelas.forEach(escuela => {
        const nombreEscuela = escuela.nombreEscuela ? escuela.nombreEscuela.trim() : '';
        const seccionEscuela = escuela.seccionEscuela ? escuela.seccionEscuela.trim() : '';
        const key = `${nombreEscuela}-${seccionEscuela}`;
        if (!actividadesPorEscuelaSeccion.has(key)) {
            reporte.push({
                nombreEscuela: escuela.nombreEscuela,
                seccionEscuela: escuela.seccionEscuela,
                actividadFaltante: true
            });
        }
    });

    return reporte;
}

// Función para mostrar el reporte en una tabla HTML
function mostrarReporte1(reporte) {
    const reportContainer = document.getElementById('output');
    reportContainer.innerHTML = '';

    const conteoFaltantes = reporte.length;

    const conteoDiv = document.createElement('div');
    //conteoDiv.textContent = `Cantidad de escuelas y secciones que NO realizaron actividades ACAP: ${conteoFaltantes}`;
    reportContainer.appendChild(conteoDiv);

    if (reporte.length === 0) {
        reportContainer.textContent = 'Todas las secciones tienen actividades registradas.';
        return;
    }

    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    const headerRow = document.createElement('tr');
    const headers = ['Nombre de la Escuela', 'Sección de la Escuela', 'Actividades Faltantes'];
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    reporte.forEach(rowData => {
        const row = document.createElement('tr');
        const cellNombreEscuela = document.createElement('td');
        const cellSeccionEscuela = document.createElement('td');
        const cellActividadFaltante = document.createElement('td');

        cellNombreEscuela.textContent = rowData.nombreEscuela;
        cellSeccionEscuela.textContent = rowData.seccionEscuela;
        cellActividadFaltante.textContent = rowData.actividadFaltante ? 'Sí' : 'No';

        row.appendChild(cellNombreEscuela);
        row.appendChild(cellSeccionEscuela);
        row.appendChild(cellActividadFaltante);

        tbody.appendChild(row);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    reportContainer.appendChild(table);

    document.getElementById('tituloDelReporte').innerHTML = `Secciones SIN ACAP - Total de secciones faltantes: ${conteoFaltantes}`;
    document.getElementById('tituloDelReporte').style.visibility = 'visible';
}
// fin de código para secciones SIN ACAP

// ************* Fin de código para generar reporte de secciones SIN ACAP **************


//*******************************************************************************
// ************* Código para generar reporte de secciones CON ACAP **************
//*******************************************************************************

// Función para leer el archivo CSV cargado
function processCSV2() {
    const fileInput = document.getElementById('csvFileInput');
    const file = fileInput.files[0];

    if (!file) {
        alert('Primero seleccionar archivo CSV.');
        return;
    }

    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            complete: function(results) {
                resolve(results.data);
            },
            error: function(error) {
                reject(error);
            }
        });
    });
}

// Función para leer el archivo CSV desde el mismo directorio
function fetchCSVFile2() {
    const url = 'escuelas-secciones-orientaciones-matricula.csv';
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al cargar el archivo CSV");
            }
            return response.text();
        })
        .then(text => {
            return Papa.parse(text, { header: true, skipEmptyLines: true }).data;
        });
}

// Función principal para generar el reporte
async function processCSVseccionesConAcap() {
    if (document.getElementById('csvFileInput').files.length === 0) {
        alert("Por favor, cargue el archivo CSV de actividades.");
        return;
    }

    try {
        const escuelasData = await fetchCSVFile2(); // Nombre del archivo CSV de escuelas y secciones
        const actividadesData = await processCSV2();

        const reporte = generarReporteActividades(escuelasData, actividadesData);
        mostrarReporte2(reporte, actividadesData.length);
    } catch (error) {
        console.error(error);
        alert("Error al obtener o procesar los archivos CSV.");
    }
}

// Función para generar el reporte de actividades
function generarReporteActividades(escuelas, actividades) {
    const actividadesPorEscuelaSeccion = new Map();

    actividades.forEach(actividad => {
        const nombreEscuelaActividad = actividad.nombreEscuelaActividad ? actividad.nombreEscuelaActividad.trim() : '';
        const seccionEscuelaActividad = actividad.seccionEscuelaActividad ? actividad.seccionEscuelaActividad.trim() : '';
        const key = `${nombreEscuelaActividad}-${seccionEscuelaActividad}`;
        if (!actividadesPorEscuelaSeccion.has(key)) {
            actividadesPorEscuelaSeccion.set(key, { ids: [], horas: 0, orientacion: actividad['Ori-Ppal'] });
        }
        actividadesPorEscuelaSeccion.get(key).ids.push(actividad.idActividad);
        actividadesPorEscuelaSeccion.get(key).horas += parseFloat(actividad['hs-ACAP-x-est'] || 0);
    });

    const reporte = [];

    escuelas.forEach(escuela => {
        const nombreEscuela = escuela.nombreEscuela ? escuela.nombreEscuela.trim() : '';
        const seccionEscuela = escuela.seccionEscuela ? escuela.seccionEscuela.trim() : '';
        const key = `${nombreEscuela}-${seccionEscuela}`;
        if (actividadesPorEscuelaSeccion.has(key)) {
            reporte.push({
                nombreEscuela: escuela.nombreEscuela,
                seccionEscuela: escuela.seccionEscuela,
                horasRealizadas: actividadesPorEscuelaSeccion.get(key).horas,
                orientacion: actividadesPorEscuelaSeccion.get(key).orientacion,
                actividadFaltante: false
            });
        }
    });

    return reporte;
}

// Función para mostrar el reporte en una tabla HTML
function mostrarReporte2(reporte, totalActividades) {
    const reportContainer = document.getElementById('output');
    reportContainer.innerHTML = '';

    if (reporte.length === 0) {
        reportContainer.textContent = 'No se encontraron secciones con actividades registradas.';
        return;
    }

    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    const headerRow = document.createElement('tr');
    const headers = ['Nombre de la Escuela', 'Sección de la Escuela', 'Horas Realizadas', 'Orientación ACAP', 'Actividades Registradas'];
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    reporte.forEach(rowData => {
        const row = document.createElement('tr');
        const cellNombreEscuela = document.createElement('td');
        const cellSeccionEscuela = document.createElement('td');
        const cellHorasRealizadas = document.createElement('td');
        const cellOrientacion = document.createElement('td');
        const cellActividadRegistrada = document.createElement('td');

        cellNombreEscuela.textContent = rowData.nombreEscuela;
        cellSeccionEscuela.textContent = rowData.seccionEscuela;
        cellHorasRealizadas.textContent = rowData.horasRealizadas;
        cellOrientacion.textContent = rowData.orientacion;
        cellActividadRegistrada.textContent = rowData.actividadFaltante ? 'No' : 'Sí';

        row.appendChild(cellNombreEscuela);
        row.appendChild(cellSeccionEscuela);
        row.appendChild(cellHorasRealizadas);
        row.appendChild(cellOrientacion);
        row.appendChild(cellActividadRegistrada);

        tbody.appendChild(row);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    reportContainer.appendChild(table);

    document.getElementById('tituloDelReporte').innerHTML = `Secciones CON ACAP - Total de actividades realizadas: ${totalActividades}`;
    document.getElementById('tituloDelReporte').style.visibility = 'visible';
}
// ************* Fin de código para generar reporte de secciones CON ACAP **************
