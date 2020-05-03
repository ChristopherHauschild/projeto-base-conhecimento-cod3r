const bodyParser = require('body-parser') // Interpreta o body da requisição
const cors = require('cors') // Cors permite uma outra aplicação acessar a API deste backend | backend > frontend

// Consign auxilia a definir dependências da aplicação
module.exports = app => {
    app.use(bodyParser.json())
    app.use(cors())
}