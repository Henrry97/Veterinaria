const express = require('express');
const router = express.Router(); // Aquí se define el enrutador
const { db } = require('../firebase');
const {auth} = require('../auth/session_auth');

router.get('/usuarios/:mascotaId', auth, async(req, res) => {
    try {
        const mascotaId = req.params.mascotaId;
        const usuariosSnapshot = await db.collection('Mascotas').doc(mascotaId).collection('Usuarios').get();
        const idsUsuarios = usuariosSnapshot.docs.map(doc => doc.id);
        res.render('usuarios', { mascotaId, idsUsuarios }); // Pasar los IDs de los usuarios a la plantilla HBS
    } catch (error) {
        console.error('Error al obtener IDs de usuarios:', error);
        res.status(500).send('Error al obtener IDs de usuarios');
    }
});

module.exports = router; // Aquí se exporta el enrutador