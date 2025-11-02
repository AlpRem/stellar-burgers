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
    cy.get('[data-cy=cy-ingredient]').should('have.length.at.least', 1);
    cy.fixture('ingredients.json').then((data) => {
      data.data.forEach((ingredient: { name: string }) => {
        cy.get('[data-cy=cy-ingredient]').should(
          'contain.text',
          ingredient.name
        );
      });
    });
  });

  it('Проверка добавления ингредиента из списка в конструктор', function () {
    cy.get('[data-cy=cy-ingredient]').first().as('ingredient');
    cy.get('@ingredient')
      .find('[data-cy=cy-ingredient-name]')
      .invoke('text')
      .then((ingredientName) => {
        cy.get('@ingredient').find('button').click();
        cy.get('[data-cy=cy-bun]')
          .should('exist')
          .and('contain.text', ingredientName);
      });
  });

  it('Проверка работы модальных окн (открытие окна ингредиента, закрытия по клику на крестик)', function () {
    cy.get('[data-cy=cy-ingredient]').first().click();
    cy.get('[data-cy=cy-modal]').should('exist');
    cy.get('[data-cy=cy-modal-btn-close]').click();
    cy.get('[data-cy=cy-modal]').should('not.exist');
  });


});
