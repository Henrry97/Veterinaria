document.addEventListener("DOMContentLoaded", function () {
  // Agregar listener para botones aceptar
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("btn-success")) {
      var citaId = e.target.closest(".card").id.replace("cita-", "");
      enviarCita(citaId, "aceptar");
    }
  });

  // Agregar listener para botones rechazar
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("btn-danger")) {
      var citaId = e.target.closest(".card").id.replace("cita-", "");
      enviarCita(citaId, "rechazar");
    }
  });

  function enviarCita(id, accion) {
    fetch(`/home/${accion}-cita`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        alert("Cita " + accion + " exitosamente");
        window.location.reload();
      })
      .then((data) => {
        console.log(data);
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error:", error);
        window.location.reload();
      });
  }
});
