const API_URL = "https://pwapi-21z1.onrender.com/api/tareas";

const statusMessage = document.getElementById("status-message");
const tareasContainer = document.getElementById("tareas-container");

function updateConnectionStatus() {
    statusMessage.classList.remove('status-online', 'status-offline');
    
    if (navigator.onLine) {
        statusMessage.classList.add('status-online'); 
        statusMessage.innerHTML = 'Estás en línea.';
        statusMessage.style.display = 'block';

        setTimeout(() => {
            statusMessage.style.display = 'none';
        }, 3000);

        fetchTareas();

    } else {
        statusMessage.classList.add('status-offline'); 
        statusMessage.innerHTML = 'Estás sin conexión, usando datos de caché';
        statusMessage.style.display = 'block';
        
        fetchTareas(); 
    }
}

window.addEventListener("load", updateConnectionStatus);
window.addEventListener("online", updateConnectionStatus);
window.addEventListener("offline", updateConnectionStatus);

async function fetchTareas() {
    tareasContainer.innerHTML = "Cargando tareas...";

    try {
        const response = await fetch(API_URL); 

        if (!response.ok) {
            throw new Error(
                `Error: Código ${response.status}. ${response.statusText}.`
            );
        }

        const tareas = await response.json();
        
        renderTareas(tareas);

    } catch (error) {
        console.error("Error al consumir la API:", error);
        
        tareasContainer.innerHTML = `
              No hay datos disponibles. ${error.message}.
            <p>Conéctate a internet y recarga para guardar la lista de tareas en caché.</p>
        `;
    }
}

function renderTareas(tareas) {
    if (tareas.length === 0) {
        tareasContainer.innerHTML = "No hay tareas registradas en la API.";
        return;
    }

    const listaHtml = tareas
        .map(
            (tarea) =>
                `<div class="tarea ${tarea.completado ? "completada" : ""}">
                    ID: ${tarea.id} | Título: ${tarea.titulo} 
                    (${tarea.completado ? "Completada" : "Pendiente"})
                </div>`
        )
        .join("");

    tareasContainer.innerHTML = listaHtml;
}