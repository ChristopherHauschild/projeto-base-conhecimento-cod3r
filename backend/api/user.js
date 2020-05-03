const bcrypt = require('bcrypt-nodejs') // Encriptar senha do usuário

module.exports = app => { // app -> instância do express
    const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation // instância expressa / pasta / arquivo

    const encryptPassword = password => {
        const salt = bcrypt.genSaltSync(10) // Hash diferente para cada geração
        return bcrypt.hashSync(password, salt)
    }

    const save = async (req, res) => { // Inserir ou atualizar usuário
        const user = { ...req.body } // Clonando body

        if(req.params.id) user.id = req.params.id // Fazer alteração caso ID esteja informado na URL e já exista no BD

        // Garantindo para que usuário não seja cadastrado a partir de signup
        // Apenas admin pode cadastrar outro admin
        if(!req.originalUrl.startsWith('/users')) user.admin = false
        if(!req.user || !req.user.admin) user.admin = false

        try { // Se não existir | value, mgs
            existsOrError(user.name, 'Nome não informado')
            existsOrError(user.email, 'E-mail não informado')
            existsOrError(user.password, 'Senha não informada')
            existsOrError(user.confirmPassword), 'Confirmação de senha inválida'
            
            equalsOrError(user.password, user.confirmPassword,
                'Senhas não conferem')
            
            const userFromDB = await app.db('users') // Acessando Knex
                .where({ email: user.email }).first() // Caso exista usuário com o e-mail informado
            if(!user.id) { 
                notExistsOrError(userFromDB, 'Usuário já cadastrado') // Se não existir email no BD ok, se existir gera erro
            }

        } catch(msg) { // Try retorna erros para catch
            return res.status(400).send(msg)
        }

        user.password = encryptPassword(req.body.password) // Criptografando senha
        delete user.confirmPassword // Deletando confirmação de senha para não enviar ao BD

        if(user.id) { // Caso ID já exista, altera o usuário mesmo no BD
            app.db('users')
                .update(user)
                .where({ id: user.id })
                .whereNull('deletedAt')
                .then(_ => res.status(204).send()) // Se ocorrer com sucesso
                .catch(err => res.status(500).send(err)) // Se ocorrer erro no lado do servidor
        } else { // Caso ID não exista, insere usuário no BD
            app.db('users') 
                .insert(user)
                .then(_ = res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }
        const get = (req, res) => { // Pega todos usuários do BD
            app.db('users')
                .select('id', 'name', 'email', 'admin')
                .whereNull('deletedAt')
                .then(users => res.json(users)) // Ao receber usuários retorna como json
                .catch(err => res.status(500).send(err))
        }

        const getUserById = (req, res) => { // Pega todos usuários do BD
            app.db('users')
                .select('id', 'name', 'email', 'admin')
                .where({ id: req.params.id })
                .whereNull('deletedAt')
                .first()
                .then(user => res.json(user)) // Ao receber usuários retorna como json
                .catch(err => res.status(500).send(err))
        }

        const remove = async (req, res) => {
            try {
                const articles = await app.db('articles')
                    .where({ userId: req.params.id })
                notExistsOrError(articles, 'Usuário possui artigos vinculados.')
                
                const rowsUpdated = await app.db('users')
                    .update({ deletedAt: new Date() })
                    .where({ id: req.params.id  })
                existsOrError(rowsUpdated, 'Usuário não foi encontrado.')

                res.status(204).send()
            } catch(msg) {
                res.status(400).send(msg)
            }
        }

    return { save, get, getUserById, remove } // Retorna objeto com cada uma das constantes criada
}