describe('Проверяем функциональность работы с ингредиентами', function () {
  beforeEach(() => {
    Cypress.on('uncaught:exception', (err, runnable) => {
      if (err.message.includes('certificate')) {
        return false;
      }
    });

    cy.intercept('GET', '**/ingredients', {
      fixture: 'ingredients.json'
    }).as('getListIngredients');
    localStorage.clear();
    cy.visit('http://localhost:4000/');
  });

  it('Проверка вывода ингредиентов с моковыми данными', function () {
    cy.wait('@getListIngredients').its('response.statusCode').should('eq', 200);
    cy.get('[data-cy=ingredient-container]').should('have.length.at.least', 1);
    cy.fixture('ingredients.json').then((data) => {
      data.data.forEach((ingredient: { name: string | number | RegExp }) => {
        cy.get('[data-cy=ingredient-container]').contains(ingredient.name);
      });
    });
  });
});
