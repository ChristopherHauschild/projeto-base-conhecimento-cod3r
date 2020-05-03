const queries = require('./queries')

module.exports = app => {
    const { existsOrError } = app.api.validation

    const save = (req, res) => {
        const article = { ...req.body }
        if(req.params.id) article.id = req.params.id // Recebe id da requisição
        
        try {
            existsOrError(article.name, 'Nome não informado')
            existsOrError(article.description, 'Descrição não informada')
            existsOrError(article.categoryId, 'Categoria não informada')
            existsOrError(article.userId, 'Autor não informado')
            existsOrError(article.content, 'Conteúdo não informado')
        } catch(msg) {
            res.status(400).send(msg)
        }

        if(article.id) {
            app.db('articles')
                .update(article)
                .where({ id: article.id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('articles')
                .insert(article)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const remove = async (req, res) => {
        try {
            const rowsDeleted = await app.db('articles')
                .where({ id: req.params.id }).del()
            
            try {
                existsOrError(rowsDeleted, 'Artigo não foi encontrado.')
            } catch(msg) {
                return res.status(400).send(msg)
            }

            res.status(204).send()
        } catch(msg) {
            res.status(500).send(msg)
        }
    }

    const limit = 10 // No máximo 10 registros por paginação
    const get = async (req, res) => {
        const page = req.query.page || 1

        const result = await app.db('articles').count('id').first() // Pegar numero de artigos para definir quantidade de páginas
        const count = parseInt(result.count)

        app.db('articles')
            .select('id', 'name', 'description')
            .limit(limit).offset(page * limit - limit) // Começa offset no 0, depois 10, 20, 30... | A partir de onde começa registro para 10 artigos
            .then(articles => res.json({ data: articles, count, limit })) // Frontend terá dados para renderizar paginador
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('articles')
            .where({ id: req.params.id })
            .first()
            .then(article => { // Converte de binário para string
                article.content = article.content.toString()
                return res.json(article)
            })
            .catch(err => res.status(500).send(err)) // Pega todos id's que pertencem à categoria informado e seus filhos
    }

    const getByCategory = async(req, res) => {
        const categoryId = req.params.id

        const page = req.query.page || 1 // Caso não obter retorno assume página 1
        const categories = await app.db.raw(queries.categoryWithChildren, categoryId)
    
        const ids = categories.rows.map(c => c.id)

        app.db({ a: 'articles', u: 'users' })
            .select('a.id', 'a.name', 'a.description', 'a.imageUrl', { author: 'u.name' })
            .limit(limit).offset(page * limit -limit)
            .whereRaw('?? = ??', ['u.id', 'a.userId']) // Igualando tabelas
            .whereIn('categoryId', ids) // Dentro dos parâmetros estabelecidos 
            .orderBy('a.id', 'desc')
            .then(articles => res.json(articles))
            .catch(err => res.status(500).send(err))
    }

    return { save, remove, get, getById, getByCategory }
}