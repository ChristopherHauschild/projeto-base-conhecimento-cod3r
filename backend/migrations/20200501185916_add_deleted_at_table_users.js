// Adicionando coluna em users
exports.up = function(knex) {
    return knex.schema.alterTable('users', table => { 
        table.timestamp('deletedAt') // Coluna que contém data
    })
};

exports.down = function(knex) {
    return knex.schema.alterTable('users', table => {
        table.dropColumn('deletedAt')
    })
};
