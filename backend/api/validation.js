module.exports = app => {
    function existsOrError(value, msg) { // Se tal nome foi informado
        if(!value) throw msg // Lançando mensagem caso value seja falso
        if(Array.isArray(value) && value.length === 0) throw msg // Caso array retorne vazio 
        if(typeof value === 'string' && !value.trim()) throw msg // Se for string e estiver vazia ou com espaços em branco
    }
    
    function notExistsOrError(value, msg) { // Para saber se usuário já não está cadastrado
        try {
            existsOrError(value, msg) // Se não resultar em erro lança mensagem
        } catch(msg) {
            return
        }
    
        throw msg
    }
    
    function equalsOrError(valueA, valueB, msg) {
        if(valueA !== valueB) throw msg // Comparar senha e confirmação de senha
    }
    // consign carrega funções
    return { existsOrError, notExistsOrError, equalsOrError }
}