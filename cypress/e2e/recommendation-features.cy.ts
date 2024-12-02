/// <reference types="cypress" />

describe('Advanced Recommendation Features', () => {
  beforeEach(() => {
    cy.login('test@example.com', 'password123');
    cy.visit('/dashboard');
  });

  describe('Recommendation Sharing', () => {
    it('allows sharing recommendations on social platforms', () => {
      cy.shareRecommendation('1', 'twitter');
      cy.get('[data-testid="recommendation-item"]').first()
        .find('[data-testid="share-button"]').click();
      cy.get('[data-testid="share-twitter"]').click();
      cy.wait('@shareRecommendation')
        .its('response.body.shareUrl')
        .should('include', 'share.example.com');
    });

    it('allows copying share link', () => {
      cy.shareRecommendation('1', 'copy');
      cy.get('[data-testid="recommendation-item"]').first()
        .find('[data-testid="share-button"]').click();
      cy.get('[data-testid="copy-link"]').click();
      cy.get('[data-testid="share-success"]')
        .should('contain', 'Link copied to clipboard');
    });

    it('tracks sharing analytics', () => {
      cy.intercept('POST', '/api/v1/analytics/share', {
        statusCode: 200
      }).as('trackShare');
      cy.shareRecommendation('1', 'linkedin');
      cy.get('[data-testid="recommendation-item"]').first()
        .find('[data-testid="share-button"]').click();
      cy.get('[data-testid="share-linkedin"]').click();
      cy.wait('@trackShare');
    });
  });

  describe('Recommendation Analytics', () => {
    beforeEach(() => {
      cy.visit('/analytics');
    });

    it('displays engagement metrics', () => {
      cy.checkAnalytics('engagement');
      cy.wait('@getAnalytics');
      cy.get('[data-testid="engagement-chart"]').should('exist');
      cy.get('[data-testid="engagement-metrics"]').within(() => {
        cy.get('[data-testid="click-through-rate"]').should('exist');
        cy.get('[data-testid="average-time-spent"]').should('exist');
        cy.get('[data-testid="conversion-rate"]').should('exist');
      });
    });

    it('allows filtering analytics by date range', () => {
      cy.get('[data-testid="date-range-picker"]').click();
      cy.get('[data-testid="last-30-days"]').click();
      cy.wait('@getAnalytics');
      cy.get('[data-testid="analytics-data"]')
        .should('contain', 'Last 30 Days');
    });

    it('exports analytics reports', () => {
      cy.get('[data-testid="export-button"]').click();
      cy.get('[data-testid="export-csv"]').click();
      cy.readFile('cypress/downloads/analytics-report.csv')
        .should('exist');
    });
  });

  describe('Recommendation Personalization', () => {
    beforeEach(() => {
      cy.visit('/settings/personalization');
    });

    it('allows updating content preferences', () => {
      const preferences = {
        categories: ['Technology', 'Education'],
        contentTypes: ['Articles', 'Videos'],
        difficulty: 'Intermediate'
      };

      cy.updatePersonalization(preferences);
      cy.get('[data-testid="category-select"]').click();
      cy.get('[data-testid="category-technology"]').click();
      cy.get('[data-testid="category-education"]').click();
      cy.get('[data-testid="content-type-select"]').click();
      cy.get('[data-testid="type-articles"]').click();
      cy.get('[data-testid="type-videos"]').click();
      cy.get('[data-testid="difficulty-select"]')
        .select('Intermediate');
      cy.get('[data-testid="save-preferences"]').click();
      cy.wait('@updatePersonalization');
    });

    it('allows setting content filters', () => {
      cy.get('[data-testid="content-filters"]').within(() => {
        cy.get('[data-testid="exclude-viewed"]').click();
        cy.get('[data-testid="exclude-saved"]').click();
        cy.get('[data-testid="min-rating"]').type('4');
      });
      cy.get('[data-testid="apply-filters"]').click();
      cy.wait('@updatePersonalization');
    });

    it('shows personalization impact', () => {
      cy.intercept('GET', '/api/v1/recommendations/impact', {
        statusCode: 200,
        body: {
          beforeAccuracy: 0.75,
          afterAccuracy: 0.85,
          improvement: '13.3%'
        }
      }).as('getImpact');

      cy.get('[data-testid="show-impact"]').click();
      cy.wait('@getImpact');
      cy.get('[data-testid="impact-metrics"]').within(() => {
        cy.get('[data-testid="accuracy-improvement"]')
          .should('contain', '13.3%');
      });
    });
  });

  describe('Search and Discovery', () => {
    it('allows searching recommendations', () => {
      cy.intercept('GET', '/api/v1/recommendations/search*', {
        statusCode: 200,
        fixture: 'search-results.json'
      }).as('searchRecommendations');

      cy.get('[data-testid="search-input"]')
        .type('machine learning{enter}');
      cy.wait('@searchRecommendations');
      cy.get('[data-testid="search-results"]')
        .should('contain', 'Machine Learning Basics');
    });

    it('provides advanced search filters', () => {
      cy.get('[data-testid="advanced-search"]').click();
      cy.get('[data-testid="date-range"]')
        .select('Last 7 days');
      cy.get('[data-testid="min-rating"]')
        .select('4 stars');
      cy.get('[data-testid="apply-search-filters"]').click();
      cy.wait('@searchRecommendations');
    });

    it('shows trending topics', () => {
      cy.intercept('GET', '/api/v1/recommendations/trending', {
        statusCode: 200,
        fixture: 'trending.json'
      }).as('getTrending');

      cy.get('[data-testid="trending-topics"]').click();
      cy.wait('@getTrending');
      cy.get('[data-testid="trending-list"]')
        .should('have.length.at.least', 1);
    });
  });
}); 