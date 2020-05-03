module.exports = middleware => {
    return (req, res, next) => {
        if(req.user.admin) { // Middleware será chamado caso user seja admin
            middleware(req, res, next)
        } else {
            res.status(401).send('Usuário não é administrador.')
        }
    }
}