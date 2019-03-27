exports.get404 = ( req, res, next) => {
    res.status(404).send('Page not found! 404');
}

exports.get403 = ( req, res, next) => {
    res.status(404).send('Access Denied');
}