function auth(req, res, next) {
    if (!req.cookies.user) {
        res.redirect('/login'); // Si no está logueado, redirige al login
    }   else {
        next(); // Si está logueado, pasa al siguiente middleware
    }
}

function isLogged(req, res, next) {
    if (req.cookies.user) {
        res.redirect('home'); // Si está logueado, redirige al home
    }   else {
        next(); // Si no está logueado, pasa al siguiente middleware
    }
}

module.exports = {auth, isLogged}; // Exporta la función para poder usarla en otros archivos