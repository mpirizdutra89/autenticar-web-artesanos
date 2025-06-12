exports.inicio = (req, res) => {

    if (false) {
        res.render('album');
    } else {
        res.render('obras_publicas');
    }

}

exports.obrasPublica = (req, res) => {
    //seva usar un usuario limitado y cuando se use un usuario logeado las credenciales son otras
    let logeado = false;
    res.render('obras_publicas');
}