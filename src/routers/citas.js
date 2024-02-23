const { Router } = require("express");
const { db } = require("../firebase");
const route = Router();
const { auth } = require("../auth/session_auth");
const {
  escribirEnFirestore,
  leerConFiltroFirestore,
} = require("../utils/firestore_utils");

// Ruta para marcar una cita como aceptada
route.get("/cita", auth, async (req, res) => {
  try {
    const citas = await leerConFiltroFirestore("Citas", [
      "status",
      "==",
      "aceptada",
    ]);
    res.render("citas", {
      citas: citas,
      scripts: '<script src="/js/citas_script.js"></script>',
    });
  } catch (error) {
    // El manejo de errores ya se hace dentro de leerConFiltroFirestore, pero puedes añadir acciones adicionales si es necesario
    res.status(500).send("Error al cargar citas");
  }
});

// Ruta para marcar una cita como atendida
route.post("/cita/atender", auth, async (req, res) => {
  try {
    const {
      peso,
      altura,
      edad,
      fechaAtencion,
      proximaFechaRevision,
      motivo,
      sobre,
      citaId,
      mascotaId,
      contactoId,

    } = req.body;

    await escribirRegistroMedico({
      fechaRevision: fechaAtencion,
      motivo: motivo,
      proximaVisita: proximaFechaRevision,
      sobre: sobre,
      citaId: citaId,
      mascotaId: mascotaId,
    });


    console.log(mascotaId);


    if (citaId != "") {
      await escribirEnFirestore("Citas", { status: "atendida" }, citaId);

    }

    if(mascotaId != null){

      await escribirEnFirestore("Mascotas", { edad: edad, peso: peso, altura: altura }, mascotaId);
    }else{

      console.log("Error", mascotaId);
    }
    res.redirect(`/presentar_mascota?id=${contactoId}`);
  } catch (error) {
    console.error("Error al atender cita:", error);
    res.render("error", {
      errorMessage: "Error al atender cita: " + error,
      errorCode: "500",
    });
  }
});

// Ruta para marcar una cita como no se presentó
route.post("/cita/no-presentada", auth, async (req, res) => {
  try {
    const { id } = req.body;
    await escribirRegistroMedico({
      fechaRevision: new Date().toISOString(),
      motivo: "No se presentó",
      proximaVisita: "",
      sobre: "No asistió",
      citaId: id,
    });
    await escribirEnFirestore("Citas", { status: "cancelada" }, id);
    res.send("Cita marcada como no presentada exitosamente");
  } catch (error) {
    console.error("Error al marcar cita como no presentada:", error);
    res.render("error", {
      errorMessage: "Error al marcar cita como no presentada: " + error,
      errorCode: "500",
    });
  }
});

// Función para escribir un registro médico




async function escribirRegistroMedico(datos) {
  const data = {
    fechaRevision: datos.fechaRevision,
    motivo: datos.motivo,
    proximaVisita: datos.proximaVisita,
    sobre: datos.sobre,
    citaId: datos.citaId,
    mascotaId: datos.mascotaId,
  };

  const response = await escribirEnFirestore("registro_medico", data);

  console.log("Registro médico creado:", response);
}

module.exports = route;
