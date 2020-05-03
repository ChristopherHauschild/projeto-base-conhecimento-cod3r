// Criado a partir de knex migrate:make create_table_users
// Migrations -> controla a evolução do banco dados

exports.up = function(knex) {
    return knex.schema.createTable('users', table => { // Criando colunas da tabela users
        table.increments('id').primary()
        table.string('name').notNull()
        table.string('email').notNull().unique()
        table.string('password').notNull()
        table.boolean('admin').notNull().defaultTo(false)
    })
};

// up -> indo pra novas versões
// down -> fazendo o contrário do up para facilitar migration

exports.down = function(knex) {
    return knex.schema.dropTable('users')
};
