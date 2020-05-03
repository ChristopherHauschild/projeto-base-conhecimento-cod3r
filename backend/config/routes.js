const admin = require('./admin')

module.exports = app => {
    // Públicas
    app.post('/signup', app.api.user.save)
    app.post('/signin', app.api.auth.signin)
    app.post('/validateToken', app.api.auth.validateToken)

    
    app.route('/users') // Consign acessa função de outro arquivo em outro pasta
        .all(app.config.passport.authenticate()) // Autentica usuário logado
        .post(admin(app.api.user.save))
        .get(admin(app.api.user.get))

    app.route('/users/:id')
        .all(app.config.passport.authenticate()) // Autentica usuário logado
        .put(admin(app.api.user.save))
        .get(admin(app.api.user.getUserById))
        .delete(admin(app.api.user.remove))

    app.route('/categories')
        .all(app.config.passport.authenticate()) // Autentica usuário logado
        .get(admin(app.api.category.get))
        .post(admin(app.api.category.save))

    // Ordem tem importância. Url's mais específicas devem ser declaradas por último

    app.route('/categories/tree')
        .all(app.config.passport.authenticate()) // Autentica usuário logado
        .get(app.api.category.getTree)

    app.route('/categories/:id')
        .all(app.config.passport.authenticate())
        .get(app.api.category.getById)
        .put(admin(app.api.category.save))
        .delete(admin(app.api.category.remove))

    app.route('/articles')
        .all(app.config.passport.authenticate())
        .get(admin(app.api.article.get))
        .post(admin(app.api.article.save))
    
    app.route('/articles/:id')
        .all(app.config.passport.authenticate())
        .get(app.api.article.getById)
        .put(admin(app.api.article.save))
        .delete(admin(app.api.article.remove))

    app.route('/categories/:id/articles')
        .all(app.config.passport.authenticate())
        .get(app.api.article.getByCategory)

    app.route('/stats')
        .all(app.config.passport.authenticate())
        .get(app.api.stat.get)
}