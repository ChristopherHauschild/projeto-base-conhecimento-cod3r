module.exports = app => {
    const { existsOrError, notExistsOrError } = app.api.validation

    const save = (req, res) => { // Salvar e alterar categoria
        const category = {
            id: req.body.id,
            name: req.body.name,
            parentId: req.body.parentId
         } 
        if(req.params.id) category.id = req.params.id // Fazer alteração caso ID esteja informado na URL e já exista no BD
    
        try {
            existsOrError(category.name, 'Nome não informado')
        } catch(msg) {
            return res.status(400).send(msg)
        }

        if(category.id) { // Se id da URL já estiver registrado no BD | ID setado
            app.db('categories')
                .update(category)
                .where({ id: category.id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else { // Se id da URL naõ estiver registrado no BD
            app.db('categories')
                .insert(category)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }
    // Não é possível excluir categoria caso a mesma possua dados vinculados
    const remove = async (req, res) => {
        try {
            existsOrError(req.params.id, 'Código da Categoria não informado.')
        
            const subcategory = await app.db('categories') // Consulta no DB
                .where({ parentId: req.params.id })

            notExistsOrError(subcategory, 'Categoria possui subcategorias.') // Se existe retorna erro

            const articles = await app.db('articles')
                .where({ categoryId: req.params.id })
            notExistsOrError(articles, 'Categoria possui artigos.')

            const rowsDeleted = await app.db('categories')
                .where({ id: req.params.id }).del()
            existsOrError(rowsDeleted,'Categoria não foi encontrada.')

            res.status(204).send()
        } catch(msg) {
            res.status(400).send(msg)
        }
    }

    const withPath = categories => { // Estruturando path: catPai > catFilho > catNeto...
        const getParent = (categories, parentId) => {
            const parent = categories.filter(parent => parent.id === parentId)
            return parent.length ? parent[0] : null // -> caso não encontre parent
        }

        const categoriesWithPath = categories.map(category => {
            let path = category.name // Path iniciado com nome da categoria
            let parent = getParent(categories, category.parentId) // Procurar parent da categoria

            while(parent) { // Enquanto existir parent continua procurando 
                path = `${parent.name} > ${path}`
                parent = getParent(categories, parent.parentId) // Monta caminho completo
            }

            return { ...category, path }
        })

        categoriesWithPath.sort((a, b) => { // Definindo ordenamento
            if(a.path < b.path) return -1
            if(a.path > b.path) return 1
            return 0
        })

        return categoriesWithPath
    }

    const get = (req, res) => {
        app.db('categories')
            .then(categories => res.json(withPath(categories)))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('categories')
            .where({ id: req.params.id })
            .first()
            .then(category => res.json(category))
            .catch(err => res.status(500).send(err))
    }

    const toTree = (categories, tree) => {
        // Se árvore não estiver setada, gerar inicial a partir de categorias sem parent
        if(!tree) tree = categories.filter(c => !c.parentId)
        tree = tree.map(parentNode => { // Encontrar filhos de nó pai
            const isChild = node => node.parentId == parentNode.id // Se true filho direto
            parentNode.children = toTree(categories, categories.filter(isChild)) // Passando filhos diretos para nó pai
            return parentNode // De forma recursiva
        })
        return tree
    }

    const getTree = (req, res) => {
        app.db('categories')
            .then(categories => res.json(toTree(categories)))
            .catch(err => res.status(500).send(err))
    }

    return { save, remove, get, getById, getTree }
}