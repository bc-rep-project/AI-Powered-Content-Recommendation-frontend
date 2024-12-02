/// <reference types="cypress" />

describe('Recommendations and User Interactions', () => {
  beforeEach(() => {
    // Login before each test
    cy.login('test@example.com', 'password123');
    cy.visit('/dashboard');
  });

  describe('Dashboard Recommendations', () => {
    beforeEach(() => {
      cy.intercept('GET', '/api/v1/recommendations', {
        fixture: 'recommendations.json'
      }).as('getRecommendations');
    });

    it('displays personalized recommendations', () => {
      cy.wait('@getRecommendations');
      cy.get('[data-testid="recommendation-list"]').should('exist');
      cy.get('[data-testid="recommendation-item"]').should('have.length.at.least', 1);
    });

    it('allows liking a recommendation', () => {
      cy.intercept('POST', '/api/v1/recommendations/*/like', {
        statusCode: 200
      }).as('likeRecommendation');

      cy.get('[data-testid="recommendation-item"]').first()
        .find('[data-testid="like-button"]')
        .click();

      cy.wait('@likeRecommendation')
        .its('response.statusCode')
        .should('eq', 200);
    });

    it('allows saving a recommendation', () => {
      cy.intercept('POST', '/api/v1/recommendations/*/save', {
        statusCode: 200
      }).as('saveRecommendation');

      cy.get('[data-testid="recommendation-item"]').first()
        .find('[data-testid="save-button"]')
        .click();

      cy.wait('@saveRecommendation')
        .its('response.statusCode')
        .should('eq', 200);
    });
  });

  describe('Discover Page', () => {
    beforeEach(() => {
      cy.visit('/discover');
      cy.intercept('GET', '/api/v1/recommendations/discover', {
        fixture: 'discover.json'
      }).as('getDiscoverItems');
    });

    it('displays trending and new content', () => {
      cy.wait('@getDiscoverItems');
      cy.get('[data-testid="discover-grid"]').should('exist');
      cy.get('[data-testid="discover-item"]').should('have.length.at.least', 1);
    });

    it('allows filtering content by category', () => {
      cy.get('[data-testid="category-filter"]').click();
      cy.get('[data-testid="category-option"]').first().click();
      cy.get('[data-testid="discover-item"]').should('exist');
    });
  });

  describe('Favorites/Collections', () => {
    beforeEach(() => {
      cy.visit('/favorites');
      cy.intercept('GET', '/api/v1/users/me/favorites', {
        fixture: 'favorites.json'
      }).as('getFavorites');
    });

    it('displays saved items', () => {
      cy.wait('@getFavorites');
      cy.get('[data-testid="favorites-list"]').should('exist');
      cy.get('[data-testid="favorite-item"]').should('have.length.at.least', 1);
    });

    it('allows removing items from favorites', () => {
      cy.intercept('DELETE', '/api/v1/users/me/favorites/*', {
        statusCode: 200
      }).as('removeFavorite');

      cy.get('[data-testid="favorite-item"]').first()
        .find('[data-testid="remove-button"]')
        .click();

      cy.wait('@removeFavorite')
        .its('response.statusCode')
        .should('eq', 200);
    });
  });

  describe('User Settings', () => {
    beforeEach(() => {
      cy.visit('/settings');
    });

    it('allows updating preference settings', () => {
      cy.intercept('PATCH', '/api/v1/users/me/preferences', {
        statusCode: 200
      }).as('updatePreferences');

      cy.get('[data-testid="preference-form"]').within(() => {
        cy.get('[data-testid="category-preference"]').click();
        cy.get('[data-testid="category-option"]').first().click();
        cy.get('button[type="submit"]').click();
      });

      cy.wait('@updatePreferences')
        .its('response.statusCode')
        .should('eq', 200);
    });

    it('allows updating notification settings', () => {
      cy.intercept('PATCH', '/api/v1/users/me/notifications', {
        statusCode: 200
      }).as('updateNotifications');

      cy.get('[data-testid="notification-settings"]').within(() => {
        cy.get('[data-testid="email-notifications"]').click();
        cy.get('button[type="submit"]').click();
      });

      cy.wait('@updateNotifications')
        .its('response.statusCode')
        .should('eq', 200);
    });
  });
}); 