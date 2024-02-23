const { Router } = require("express");
const { db } = require("../firebase");
const route = Router();
const { auth } = require("../auth/session_auth");
const {
  leerDeFirestore,
  escribirEnFirestore,
  leerConFiltroFirestore,
} = require("../utils/firestore_utils");

// Ruta para renderizar la página de citas
route.get("/home", auth, async (req, res) => {
  try {
    const citas = await leerConFiltroFirestore("Citas", [
      "status",
      "==",
      "pendiente",
    ]);
    res.render("home", {
      citas: citas,
      scripts: '<script src="/js/home_script.js"></script>',
    });
  } catch (error) {
    // El manejo de errores ya se hace dentro de leerConFiltroFirestore, pero puedes añadir acciones adicionales si es necesario
    console.error("Error al cargar citas:", error);
    res.status(500).render("error", {
      errorMessage: "Error al cargar citas" + error,
      errorCode: "500",
    });
  }
});

// Ruta para marcar una cita como aceptada
route.post("/home/aceptar-cita", auth, async (req, res) => {
  try {
    const { id } = req.body;
    await escribirEnFirestore("Citas", { status: "aceptada" }, id);
    res.status(200).json({ message: "Cita aceptada exitosamente" });
  } catch (error) {
    console.error("Error al aceptar cita:", error);
    res.status(500).render("error", {
      errorMessage: "Error al aceptar cita: " + error,
      errorCode: "500",
    });
  }
});

// Ruta para marcar una cita como rechazada
route.post("/home/rechazar-cita", auth, async (req, res) => {
  try {
    const { id } = req.body;
    await escribirEnFirestore("Citas", { status: "rechazada" , razon: "Por el momento no te podemos atender, para mas informacion comunicate a nuetros numero telefonico 0999433025" }, id);
    // await escribirEnFirestore("Citas",)
    res.send("Cita rechazada exitosamente");
  } catch (error) {
    console.error("Error al rechazar cita:", error);
    res.status(500).render("error", {
      errorMessage: "Error al rechazar cita: " + error,
      errorCode: "500",
    });
  }
});

module.exports = route;
