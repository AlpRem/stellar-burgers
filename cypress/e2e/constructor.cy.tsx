import { TIngredient } from '@utils-types';

describe('Проверяем функциональность работы с ингредиентами', function () {
  beforeEach(() => {
    cy.intercept('GET', '**/ingredients', {
      fixture: 'ingredients.json'
    }).as('getListIngredients');
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
    [0, 1, 2].forEach((i: number) => {
      cy.get('[data-cy=cy-ingredients-category]').eq(i).as('category');
      cy.get('@category')
        .find('[data-cy=cy-ingredient]')
        .first()
        .as('ingredient');
      cy.get('@ingredient')
        .find('[data-cy=cy-ingredient-name]')
        .invoke('text')
        .then((ingredientName) => {
          cy.get('@ingredient').find('button').click();
          if (i === 0) {
            cy.get('[data-cy=cy-bun-top]')
              .should('exist')
              .and('contain.text', ingredientName);
            cy.get('[data-cy=cy-bun-bottom]')
              .should('exist')
              .and('contain.text', ingredientName);
          } else
            cy.get('[data-cy=cy-element]')
              .should('exist')
              .and('contain.text', ingredientName);
        });
    });
  });

  it('Проверка работы открытия модального окна ингредиента', function () {
    cy.get('[data-cy=cy-ingredient]').should('exist').first().as('ingredient');
    cy.get('@ingredient').click();
    cy.get('[data-cy=cy-modal]').should('exist');
    cy.get('[data-cy=cy-ingredient-details-name]').should('exist');
  });

  it('Проверка работы закрытия модального окна через крестик', function () {
    cy.get('[data-cy=cy-ingredient]').should('exist').first().as('ingredient');
    cy.get('@ingredient').click();
    cy.get('[data-cy=cy-modal-btn-close]').click();
    cy.get('[data-cy=cy-modal]').should('not.exist');
  });

  it('Проверка работы закрытия модального окна по клику на оверлей', function () {
    cy.get('[data-cy=cy-ingredient]').should('exist').first().as('ingredient');
    cy.get('@ingredient').click();
    cy.get('[data-cy=cy-modal-overlay]').click({ force: true });
    cy.get('[data-cy=cy-modal]').should('not.exist');
  });
});
