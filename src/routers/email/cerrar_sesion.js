const { auth } = require("../../firebase");
const { signOut } = require("firebase/auth");
const express = require("express");
const router = express.Router();

router.get("/logout", async (req, res) => {
  signOut(auth).then(() => {
    res.clearCookie("user");
    res.status(200).redirect("/");
  }).catch((error) => {
    console.error("Error al cerrar sesión:", error);
    res.status(500).render("error", {
      errorMessage: "Error al cerrar sesión: " + error.message,
      errorCode: error.code,
    });
  }).finally(() => {
    res.end();
  });
});

module.exports = router;
