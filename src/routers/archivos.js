const { Router } = require("express");
const { db } = require("../firebase");
const route = Router();
const { auth } = require("../auth/session_auth");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const {
  leerDeFirestore,
  escribirEnFirestore,
  subirFotoAFirebaseStorage,
} = require("../utils/firestore_utils");
const { doc, deleteDoc } = require("firebase/firestore/lite");

// Ruta para renderizar la página de archivos
route.get("/archivos", auth, async (req, res) => {
  try {
    const contactos = await leerDeFirestore("usuario");
    res.render("archivos", { contactos });
  } catch (error) {
    console.error("Error al cargar contactos:", error);
    res.status(500).send("Error al cargar contactos");
  }
});

route.post("/archivos/nuevo", auth, upload.single("photo"), async (req, res) => {
  try {
    const { cedula, nombre, telefono, correo, direccion } = req.body;
   
    const tipoMime = req.file.mimetype;
    const archivo = req.file;
    const nombreArchivo = `${Date.now()}-${archivo.originalname}`;
    const photo = await subirFotoAFirebaseStorage(
      archivo.buffer,
      nombreArchivo,
      "usuarios",
      tipoMime
    );
    await escribirEnFirestore("usuario", {
      cedula,
      nombre,
      telefono,
      correo,
      direccion,
      photo,
    });
    res.redirect("/archivos");
  } catch (error) {
    console.error("Error al guardar contacto:", error);
    res.status(500).send("Error al guardar contacto");
  }
});

route.get("/borrar/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await deleteDoc(doc(db, "usuario", id));
    console.log("Documento eliminado correctamente");
    res.redirect("/archivos");
  } catch (error) {
    console.error("Error al eliminar el documento:", error);
    res.status(500).send("Error al eliminar el documento");
  }
});

module.exports = route;
