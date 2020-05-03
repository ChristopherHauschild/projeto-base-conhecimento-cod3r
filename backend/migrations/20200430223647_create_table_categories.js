// Criado a partir de knex migrate:make create_table_categories
exports.up = function(knex) {
    return knex.schema.createTable('categories', table => {
        table.increments('id').primary()
        table.string('name').notNull()
        table.integer('parentId').references('id') // Auto referenciamento
            .inTable('categories')
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('categories')
};
