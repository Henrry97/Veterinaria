const express = require("express");
const router = express.Router();
const { auth } = require("../auth/session_auth");
const {
  leerDeFirestore,
  leerConFiltroFirestore,
} = require("../utils/firestore_utils");

router.get("/presentar_mascota", auth, async (req, res) => {

  const { id, cita_id } = req.query;

  const usuario = await leerDeFirestore("usuario", id);
  const cedula = usuario.cedula;
  const mascotas = await leerConFiltroFirestore("Mascotas", [
    "dueño",
    "==",
    cedula,
  ]);

  for (mascota of mascotas) {
    mascota["datos"]["registro_medico"] = await leerConFiltroFirestore(
      "registro_medico",
      ["mascotaId", "==", mascota.id]
    );
  }

  res.render("presentar_mascota", {
    contacto: usuario,
    mascotas: mascotas,
    cita_id: cita_id,
    id: id,
  });
});

router.get("/editar", (req, res) => {
  const { mascota_id, cita_id, persona_id } = req.query;

  res.render("editar", {
    id_mascota: mascota_id,
    id_cita: cita_id,
    id_persona: persona_id,
  });
});

module.exports = router;
