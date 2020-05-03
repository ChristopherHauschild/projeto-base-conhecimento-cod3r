module.exports = {
    categoryWithChildren: `
        WITH RECURSIVE subcategories (id) AS (
            SELECT id FROM categories WHERE id = ?
            UNION ALL
            SELECT c.id FROM subcategories, categories c
                WHERE "parentId" = subcategories.id
        )
        SELECT id FROM subcategories
    `
}

// Gera de forma recursiva dentro da consulta a tabela subcategories
// que irá retornar id da própria categoria passada como parâmetro
// e unir com subcategorias em que o parent da categoria é o mesmo

// ? -> id retornado em getByCategory em article.js