const express = require("express");
const router = express.Router();
const { auth } = require("../auth/session_auth");
const multer = require("multer");
const {
  subirFotoAFirebaseStorage,
  escribirEnFirestore,
} = require("../utils/firestore_utils");

const upload = multer({ storage: multer.memoryStorage() });

router.post("/new-mascota", auth, upload.single("foto"), async (req, res) => {
  try {
    const userId = req.body.userId;
  
    const { nombre, raza, edad, dueno, categoria, peso, altura, sexo } =
      req.body;

      let photo = null; // Inicializamos photo como null

      if (req.file) {
        const tipoMime = req.file.mimetype;
        const archivo = req.file;
        const nombreArchivo = `${Date.now()}-${archivo.originalname}`;
        photo = await subirFotoAFirebaseStorage(
          archivo.buffer,
          nombreArchivo,
          "pets",
          tipoMime
        );
      }

    await escribirEnFirestore("Mascotas", {
      nombre,
      raza,
      edad,
      dueño: dueno,
      categoria,
      peso,
      altura,
      sexo,
      photo,
    });

    res.redirect(`/presentar_mascota?id=${userId}`);
  } catch (error) {
    console.error("Error al guardar mascota:", error);
    res.status(500).send("Error al guardar mascota");
  }
});

module.exports = router;
