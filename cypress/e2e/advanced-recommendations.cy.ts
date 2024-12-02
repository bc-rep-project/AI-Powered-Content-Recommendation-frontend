/// <reference types="cypress" />

describe('Advanced Recommendation Features', () => {
  beforeEach(() => {
    cy.login('test@example.com', 'password123');
  });

  describe('Recommendation Sorting and Filtering', () => {
    beforeEach(() => {
      cy.visit('/dashboard');
      cy.intercept('GET', '/api/v1/recommendations*', {
        fixture: 'recommendations.json'
      }).as('getRecommendations');
    });

    it('allows sorting recommendations by relevance score', () => {
      cy.get('[data-testid="sort-dropdown"]').click();
      cy.get('[data-testid="sort-by-relevance"]').click();
      cy.get('[data-testid="recommendation-item"]').first()
        .should('contain', 'Machine Learning Basics');
    });

    it('allows filtering recommendations by category', () => {
      cy.get('[data-testid="category-filter"]').click();
      cy.get('[data-testid="category-option-technology"]').click();
      cy.get('[data-testid="recommendation-item"]')
        .should('have.length', 2)
        .first().should('contain', 'Data Science Projects');
    });

    it('allows filtering by liked status', () => {
      cy.get('[data-testid="liked-filter"]').click();
      cy.get('[data-testid="recommendation-item"]')
        .should('have.length', 1)
        .first().should('contain', 'Data Science Projects');
    });
  });

  describe('Interaction History', () => {
    beforeEach(() => {
      cy.visit('/history');
      cy.intercept('GET', '/api/v1/users/me/interactions', {
        fixture: 'interaction-history.json'
      }).as('getHistory');
    });

    it('displays interaction timeline', () => {
      cy.wait('@getHistory');
      cy.get('[data-testid="interaction-timeline"]').should('exist');
      cy.get('[data-testid="interaction-item"]')
        .should('have.length.at.least', 1);
    });

    it('shows detailed interaction statistics', () => {
      cy.get('[data-testid="interaction-stats"]').within(() => {
        cy.get('[data-testid="likes-count"]').should('exist');
        cy.get('[data-testid="saves-count"]').should('exist');
        cy.get('[data-testid="views-count"]').should('exist');
      });
    });
  });

  describe('Custom Collections', () => {
    beforeEach(() => {
      cy.visit('/collections');
      cy.intercept('GET', '/api/v1/users/me/collections', {
        fixture: 'collections.json'
      }).as('getCollections');
    });

    it('allows creating a new collection', () => {
      cy.intercept('POST', '/api/v1/users/me/collections', {
        statusCode: 201,
        body: {
          id: 'new-collection',
          name: 'ML Resources',
          description: 'Machine learning study materials'
        }
      }).as('createCollection');

      cy.get('[data-testid="create-collection-btn"]').click();
      cy.get('[data-testid="collection-name-input"]')
        .type('ML Resources');
      cy.get('[data-testid="collection-description-input"]')
        .type('Machine learning study materials');
      cy.get('[data-testid="save-collection-btn"]').click();

      cy.wait('@createCollection');
      cy.get('[data-testid="collection-card"]')
        .should('contain', 'ML Resources');
    });

    it('allows adding items to collection', () => {
      cy.intercept('POST', '/api/v1/users/me/collections/*/items', {
        statusCode: 200
      }).as('addToCollection');

      cy.visit('/dashboard');
      cy.get('[data-testid="recommendation-item"]').first()
        .find('[data-testid="add-to-collection-btn"]').click();
      cy.get('[data-testid="collection-select"]')
        .click()
        .get('[data-testid="collection-option"]').first().click();
      
      cy.wait('@addToCollection')
        .its('response.statusCode').should('eq', 200);
    });
  });

  describe('Recommendation Feedback', () => {
    beforeEach(() => {
      cy.visit('/dashboard');
    });

    it('allows providing detailed feedback on recommendations', () => {
      cy.intercept('POST', '/api/v1/recommendations/*/feedback', {
        statusCode: 200
      }).as('submitFeedback');

      cy.get('[data-testid="recommendation-item"]').first()
        .find('[data-testid="feedback-btn"]').click();
      
      cy.get('[data-testid="feedback-form"]').within(() => {
        cy.get('[data-testid="relevance-rating"]')
          .click('[data-testid="rating-4"]');
        cy.get('[data-testid="feedback-text"]')
          .type('Very helpful content, but could use more examples');
        cy.get('[data-testid="submit-feedback-btn"]').click();
      });

      cy.wait('@submitFeedback')
        .its('response.statusCode').should('eq', 200);
    });

    it('shows feedback success message', () => {
      cy.get('[data-testid="feedback-success"]')
        .should('be.visible')
        .and('contain', 'Thank you for your feedback');
    });
  });
}); 