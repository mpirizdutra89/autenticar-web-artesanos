exports.inicio = (req, res) => {
    let logeado = false;
    if (logeado) {
        res.render('album', {
            logeado: logeado
        });
    } else {
        res.render('obras_publicas', {
            logeado: logeado
        });
    }

}

exports.obrasPublica = (req, res) => {
    //seva usar un usuario limitado y cuando se use un usuario logeado las credenciales son otras
    let logeado = false;
    res.render('obras_publicas', {
        logeado: logeado
    });
}