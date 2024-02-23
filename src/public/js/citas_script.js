document.addEventListener("DOMContentLoaded", function () {


  document.querySelectorAll(".noPresenteBtn").forEach((button) => {
    button.addEventListener("click", function () {
      const citaId = this.getAttribute("data-id");

      fetch("/cita/no-presentada", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: citaId }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error al marcar cita como no presentada");
          }
          return response.text();
        })
        .then((data) => {
          console.log(data);
          alert("Cita marcada como no presentada exitosamente");
          window.location.reload(); // Recargar la página después de marcar la cita como no presentada
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
  });

 
});

document.querySelectorAll(".formularioAtencion form").forEach((form) => {
  form.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    // Suponiendo que tienes acceso al ID de la cita y la cédula de alguna manera
    const citaId = this.closest(".card").id; // Asegúrate de que esto refleje cómo estás asignando IDs a las tarjetas

    const datos = {
      fechaRevision: this.querySelector('[name="fechaAtencion"]').value,
      proximaVisita: this.querySelector('[name="proximaFechaRevision"]').value,
      motivo: this.querySelector('[name="motivo"]').value,
      sobre: this.querySelector('[name="sobre"]').value,
    };

   
  });

});
