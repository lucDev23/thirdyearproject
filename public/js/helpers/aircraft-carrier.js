const aircraft = document.querySelectorAll(".swordfish");
const configureButton = document.getElementById("configure-button");
const cancelButton = document.getElementById("cancel-button");
const acceptButton = document.getElementById("accept-button");
const modal = document.getElementById("modal-bg");
const checkboxes = document.querySelectorAll("#checkbox-container input[type='checkbox']");
let aircraftSelected = null;
let crewSelected = null;

// Logica para elegir un avion
aircraft.forEach((aircraftButton) => {
  aircraftButton.addEventListener("click", function() {
    aircraftButton.classList.add("clicked"); 
    if(aircraftSelected != aircraftButton && aircraftSelected) {
      aircraftSelected.classList.remove("clicked");
    }
    aircraftSelected = aircraftButton;
    configureButton.classList.add("enabled"); // Habilita el botón "Seleccionar tripulación"
  });
});

configureButton.addEventListener("click", function() {
    if(aircraftSelected) {
        modal.style.display = "block"; // Abre el modal para elegir la tripulacion
    }
});

cancelButton.addEventListener("click", function() {
    modal.style.display = "none"; // Cierra el modal
});

// Logica para que despegar el avion
acceptButton.addEventListener("click", function() {
    modal.style.display = "none";

    aircraftSelected.classList.add("swordfish-takeoff");

    // Calcular el movimiento del avion
    const currentRotation = getRotationAngle(aircraftSelected);

    const moveDistance = 800;
    const radians = (currentRotation * Math.PI) / 180; 
    const deltaX = -moveDistance * Math.cos(radians);
    const deltaY = moveDistance * Math.sin(radians) * 1.01; 

    aircraftSelected.style.transition = "transform 2s ease-in-out";
    aircraftSelected.style.transform = `translate(${deltaX}px, ${-deltaY}px) rotate(${currentRotation}deg)`;

    // Obtener los datos de la tripulacion
    crewSelected = getSelectedCrew();

    // Enviar datos del avión y la tripulación al juego principal
    sendAircraftData(aircraftSelected, crewSelected);

    // Reestablecer elementos
    checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
    });

    setTimeout(() => {
      aircraftSelected.remove(); // Elimina el avión del DOM
      aircraftSelected = null;   
    }, 2000);

    configureButton.classList.remove("enabled");
});

function getSelectedCrew() {
  let crew = [];
  checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
          crew.push(checkbox.closest("label").querySelector("span").textContent);
      }
  });
  return crew;
}

function sendAircraftData(aircraft, crew) {
  const aircraftData = {
      id: aircraft.id,
      crew: crew
  };

  console.log(aircraftData);
  // ENVIAR DATOS
}

function getRotationAngle(aircraft) {
    const matrix = window.getComputedStyle(aircraft).transform;
  
    if (matrix !== "none") {
      const values = matrix.split("(")[1].split(")")[0].split(",");
      const a = values[0];
      const b = values[1];
      const angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
      return angle;
    }
    return 0;
}


