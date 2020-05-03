const config = require('../knexfile.js') // Criado a partir de knex init
const knex = require('knex')(config)

knex.migrate.latest([config]) // Executa a migração quando carregar backend
module.exports = knex // Para acessar knex em index.js