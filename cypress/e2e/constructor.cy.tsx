import { TConstructorIngredientFromOrder } from '../support/types';
import { TIngredient } from '@utils-types';

describe('Проверяем функциональность работы с ингредиентами', function () {
  let ingredientListData: TIngredient[] = [];
  beforeEach(() => {
    cy.fixture('ingredients.json').then((ingredients) => {
      ingredientListData = ingredients.data;
      cy.intercept('GET', '**/ingredients', {
        body: ingredients
      }).as('getListIngredients');
    });
    cy.fixture('ingredients-order.json').as('ingredientsOnOrder');
    cy.visit('/');
  });

  afterEach(() => {
    cy.clearLocalStorage();
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
    cy.contains('[data-cy=cy-ingredient]', ingredientListData[0].name).click();
    cy.get('[data-cy=cy-modal]')
      .should('exist')
      .within(() => {
        cy.get('[data-cy=cy-ingredient-details-name]').should(
          'contain.text',
          ingredientListData[0].name
        );
        cy.get('[data-cy=cy-ingredient-details-calories]').should(
          'contain.text',
          ingredientListData[0].calories
        );
        cy.get('[data-cy=cy-ingredient-details-proteins]').should(
          'contain.text',
          ingredientListData[0].proteins
        );
        cy.get('[data-cy=cy-ingredient-details-fat]').should(
          'contain.text',
          ingredientListData[0].fat
        );
        cy.get('[data-cy=cy-ingredient-details-carbohydrates]').should(
          'contain.text',
          ingredientListData[0].carbohydrates
        );
      });
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

describe('Проверяем функциональность работы с заказом', function () {
  let orderData: TConstructorIngredientFromOrder;
  let orderNumber: number;

  beforeEach(() => {
    cy.setCookie('accessToken', 'my-accessToken');
    cy.setCookie('refreshToken', 'my-refreshToken');
    cy.fixture('ingredients-order.json').then((data) => {
      orderData = data;
      localStorage.setItem('burger', JSON.stringify(orderData));
    });
    cy.fixture('order.json').then((orderData) => {
      orderNumber = orderData.order.number;
    });
    cy.intercept('GET', '**/auth/user', {
      fixture: 'user.json'
    });
    cy.intercept('POST', '**/orders', { fixture: 'order.json' });
    cy.visit('/login');
  });

  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('Проверка работы хранилища ингридиентов через мок-данные', function () {
    cy.get('[data-cy=cy-bun-top]')
      .should('exist')
      .and('contain.text', orderData.bun.name);
    cy.get('[data-cy=cy-bun-bottom]')
      .should('exist')
      .and('contain.text', orderData.bun.name);
    cy.get('[data-cy=cy-element]')
      .should('have.length', orderData.ingredients.length)
      .each(($element, index) => {
        cy.wrap($element).should(
          'contain.text',
          orderData.ingredients[index].name
        );
      });
  });

  it('Проверка номера заказа и закрытия модального окна,', () => {
    cy.get('[data-cy=cy-order-button] button').click();
    cy.get('[data-cy=cy-modal]').should('exist');
    cy.get('[data-cy=cy-order-number]')
      .should('exist')
      .and('contain.text', orderNumber);
    cy.get('[data-cy=cy-modal-btn-close]').click();
  });

  it('Проверка очистки конструктора,', () => {
    cy.get('[data-cy=cy-order-button] button').click();
    cy.get('[data-cy=cy-modal-btn-close]').click();
    cy.get('[data-cy=cy-bun-top]').should('not.exist');
    cy.get('[data-cy=cy-bun-bottom]').should('not.exist');
    cy.get('[data-cy=cy-element]').should('not.exist');
    cy.window().then((win) => {
      expect(win.localStorage.getItem('burger')).to.be.null;
    });
  });
});
