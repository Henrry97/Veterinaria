
const express = require("express");
const router = express.Router();
const { auth } = require("../../firebase");
const { createUserWithEmailAndPassword } = require("firebase/auth");
const {
  leerDeFirestore,
  escribirEnFirestore,
} = require("../../utils/firestore_utils");
const { isLogged } = require("../../auth/session_auth");

router.post("/crear_usuario", isLogged, async (req, res) => {
  const adminExiste = await verificarAdminExistente();
  if (adminExiste) {
    res.status(500).render("error", {
      errorMessage:   "Solo se puede crear un usuario administrador. Ya existe uno.",
      errorCode: 500,
    });
    return;
  }
  const { correo, clave } = req.body; // Extrae el correo electrónico y la clave del cuerpo de la solicitud
  if (!correo || !clave) {
    console.error("Correo o clave faltante");
    return res.status(500).render("error", {
      errorMessage: "Llenar campos del formulario primero.",
      errorCode: 500,
    });
  }
  try {
    const user = await createUserWithEmailAndPassword(auth, correo, clave);
    await actualizarAdmin(
      correo,
      user.user.displayName,
      user.user.emailVerified,
      user.user.photoURL
    );
    if (!req.cookies.user) {
      res.cookie("user", user.user, {
        maxAge: 3600 * 1000,
        httpOnly: true,
        secure: false,
      });
    }
    res.redirect("/perfil");
  } catch (error) {
    console.error("Error al registrar usuario:", error.message);
    console.error("Código de error:", error.code);
    res.status(500).render("error", {
      errorMessage: "Error al registrar usuario" + error.message,
      errorCode: error.code,
    });
  }
});
async function verificarAdminExistente() {
  const adminList = await leerDeFirestore("admin_user");
  if (adminList.length > 0 && adminList[0].creado) {
    return true;
  }
  return false;
}
async function actualizarAdmin(correo, nombre, verificado, foto) {
  await escribirEnFirestore(
    "admin_user",
    {
      creado: true,
      correo: correo,
      nombre: nombre,
      verificado: verificado,
      foto: foto,
    },
    "admin_user"
  );
}
module.exports = router;
