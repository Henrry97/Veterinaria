const { Router } = require("express");
const { db } = require("../firebase");
const route = Router();
const { auth } = require("../auth/session_auth");
const {
  obtenerUsuarioPorId,
  leerConFiltroFirestore,
  escribirEnFirestore,
} = require("../utils/firestore_utils");

// Ruta para cargar mensajes
route.get("/mensajes/:idPersona", auth, async (req, res) => {
  try {
    const idUsuario = req.params.idPersona;
    const mensajes = await leerConFiltroFirestore(
      `chat/${idUsuario}/mensajes`
    );

    const usuario = await obtenerUsuarioPorId(idUsuario);

    mensajes.forEach((mensaje) =>{
        if (mensaje.datos.idEmisor == 'admin'){
            mensaje["emisor"] = "Admin"
            mensaje["esAdmin"] = true
        } else {
            mensaje["emisor"] = usuario.nombre
        }
    });

    const mensajeOrdenados = mensajes.sort((a, b) => a.datos.timestamp - b.datos.timestamp);

    res.render("mensajes", {
      mensajes: mensajeOrdenados,
      usuario: usuario,
      idUsuario: idUsuario,
    });
  } catch (error) {
    res.render("error", {
      errorMessage: "Error al cargar mensajes: " + error,
      errorCode: "500",
    });
  }
});

// Ruta para enviar mensajes
route.post("/mensajes/enviar", auth, async (req, res) => {
  try {
    const idUsuario = req.body.idUsuario;
    const dateNow = new Date();
    const mensaje = {
      idEmisor: "admin",
      mensaje: req.body.mensaje,
      timestamp: dateNow,
      hora: dateNow.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }),
    };

    await escribirEnFirestore(`chat/${idUsuario}/mensajes`, mensaje);
    res.redirect("/mensajes/" + idUsuario);
  } catch (error) {
    console.error("Error al enviar mensaje:", error);
    res.render("error", {
      errorMessage: "Error al enviar mensaje" + error,
      errorCode: "500",
    });
  }
});
module.exports = route;
