const app = require('express')() // Instância do express que será utilizada nos demais arquivos
const consign = require('consign') // Consign auxilia a definir dependências da aplicação
const db = require('./config/db') // Knex passand conf de conexão ao banco de dados
const mongoose = require('mongoose')

require('./config/mongodb')

app.db = db // Banco de dados fica a disposição para realizar as operações necessárias
app.mongoose = mongoose

consign()
    .include('./config/passport.js')
    .then('./config/middlewares.js')
    .then('./api/validation.js') // Executa primeiro validação do usuário
    .then('./api')
    .then('./schedule')
    .then('./config/routes.js')
    .into(app) // Injeta app em cada uma das dependências

app.listen(3000, () => {
    console.log('Backend executando...')
})