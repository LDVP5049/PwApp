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
        statusMessage.innerHTML = 'Estás sin internet... La aplicación podría usar datos en caché.';
        statusMessage.style.display = 'block';
    }
}

window.addEventListener("load", updateConnectionStatus);
window.addEventListener("online", updateConnectionStatus);
window.addEventListener("offline", updateConnectionStatus);

async function fetchTareas() {
  if (!navigator.onLine) {
    tareasContainer.innerHTML =
      "No se puede cargar la lista de tareas: la aplicación está sin conexión.";
    return;
  }

  tareasContainer.innerHTML = "Cargando tareas...";

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(
        `Error en la API: ${response.status} ${response.statusText}`
      );
    }

    const tareas = await response.json();

    renderTareas(tareas);
  } catch (error) {
    console.error("Error al consumir la API:", error);
    tareasContainer.innerHTML = `Error al cargar las tareas: ${error.message}`;
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

fetchTareas();
