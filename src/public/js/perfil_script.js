/**
 * Este script maneja la edición del perfil del usuario.
 * Espera a que el DOM esté completamente cargado para ejecutarse.
 */
document.addEventListener("DOMContentLoaded", function () {
  /**
   * Agrega un evento de clic al botón "Editar Perfil".
   * Cuando se hace clic en este botón, se muestra el formulario de edición.
   */
  document.getElementById("editarPerfilBtn").addEventListener("click", function () {
    document.getElementById("formularioEdicion").style.display = "block";
  });

  /**
   * Agrega un evento de clic al botón "Guardar Cambios".
   * Cuando se hace clic en este botón, se envían los cambios del perfil al servidor.
   */
  document.getElementById("guardarCambiosBtn").addEventListener("click", function () {
    // Obtiene los valores del nombre y la foto del perfil desde los campos de entrada.
    var nombre = document.getElementById("nombrePerfil").value;
    var foto = document.getElementById("fotoPerfilUrl").value;
    var telefono = document.getElementById("telefonoPerfil").value;
    var direccion = document.getElementById("direccionPerfil").value;
    var servicios = document.getElementById("serviciosPerfil").value;

    // Realiza una solicitud fetch para enviar los datos actualizados del perfil al servidor.
    fetch("/perfil/editar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          nombre: nombre,
          foto: foto, 
          telefono: telefono,
          direccion: direccion,
          servicios:servicios,

        },
      }),
    })
    // Maneja la respuesta de la solicitud fetch.
    .then((response) => response.text())
    // Si la solicitud se completa correctamente, actualiza la interfaz de usuario y muestra una alerta.
    .then((data) => {
      console.log(data);
      document.getElementById("formularioEdicion").style.display = "none";
      document.getElementById("fotoPerfil").src = foto;
      alert("Perfil editado exitosamente");
    })
    // Maneja cualquier error que ocurra durante la solicitud fetch y lo imprime en la consola.
    .catch((error) => {
      console.error("Error:", error);
    });
  });
});
