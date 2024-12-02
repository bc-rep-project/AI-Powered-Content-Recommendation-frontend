/// <reference types="cypress" />

describe('AI Moderation and Content Quality', () => {
  beforeEach(() => {
    cy.login('moderator@example.com', 'moderator123');
    cy.visit('/admin/ai-moderation');
  });

  describe('AI Moderation', () => {
    beforeEach(() => {
      cy.intercept('GET', '/api/v1/moderation/ai/queue', {
        fixture: 'ai-moderation-queue.json'
      }).as('getAiQueue');
    });

    it('runs automated content moderation', () => {
      cy.runAiModeration('1');
      cy.get('[data-testid="queue-item"]').first()
        .find('[data-testid="run-ai-moderation"]')
        .click();
      cy.wait('@runAiModeration');
      cy.get('[data-testid="ai-results"]').within(() => {
        cy.get('[data-testid="confidence-score"]')
          .should('contain', '95%');
        cy.get('[data-testid="safety-status"]')
          .should('contain', 'Safe');
      });
    });

    it('shows detailed AI analysis', () => {
      cy.getAiInsights('1');
      cy.get('[data-testid="queue-item"]').first()
        .find('[data-testid="view-ai-insights"]')
        .click();
      cy.wait('@getAiInsights');
      cy.get('[data-testid="ai-insights"]').within(() => {
        cy.get('[data-testid="content-category"]').should('exist');
        cy.get('[data-testid="sentiment-analysis"]').should('exist');
        cy.get('[data-testid="topic-extraction"]').should('exist');
        cy.get('[data-testid="readability-score"]').should('exist');
      });
    });

    it('allows adjusting AI sensitivity', () => {
      cy.get('[data-testid="ai-settings"]').click();
      cy.get('[data-testid="sensitivity-slider"]')
        .invoke('val', 0.8)
        .trigger('change');
      cy.get('[data-testid="save-settings"]').click();
      cy.get('[data-testid="settings-success"]')
        .should('be.visible');
    });

    it('handles AI moderation errors', () => {
      cy.intercept('POST', '/api/v1/moderation/ai/2', {
        statusCode: 500,
        body: {
          error: 'AI service unavailable'
        }
      }).as('aiError');

      cy.get('[data-testid="queue-item"]').eq(1)
        .find('[data-testid="run-ai-moderation"]')
        .click();
      cy.wait('@aiError');
      cy.get('[data-testid="error-message"]')
        .should('contain', 'AI service unavailable');
    });
  });

  describe('Content Quality Scoring', () => {
    beforeEach(() => {
      cy.visit('/admin/content-quality');
      cy.intercept('GET', '/api/v1/content/quality/overview', {
        fixture: 'quality-overview.json'
      }).as('getQualityOverview');
    });

    it('displays quality score breakdown', () => {
      cy.getQualityScore('1');
      cy.get('[data-testid="content-item"]').first()
        .click();
      cy.wait('@getQualityScore');
      cy.get('[data-testid="quality-breakdown"]').within(() => {
        cy.get('[data-testid="readability-score"]').should('exist');
        cy.get('[data-testid="technical-accuracy"]').should('exist');
        cy.get('[data-testid="content-depth"]').should('exist');
        cy.get('[data-testid="engagement-potential"]').should('exist');
      });
    });

    it('updates quality thresholds', () => {
      const newThresholds = {
        readability: 0.7,
        technicalAccuracy: 0.8,
        contentDepth: 0.75,
        engagementPotential: 0.8
      };

      cy.updateQualityThresholds(newThresholds);
      cy.get('[data-testid="quality-settings"]').click();
      cy.get('[data-testid="readability-threshold"]')
        .clear()
        .type('0.7');
      cy.get('[data-testid="technical-accuracy-threshold"]')
        .clear()
        .type('0.8');
      cy.get('[data-testid="content-depth-threshold"]')
        .clear()
        .type('0.75');
      cy.get('[data-testid="engagement-threshold"]')
        .clear()
        .type('0.8');
      cy.get('[data-testid="save-thresholds"]').click();
      cy.wait('@updateQualityThresholds');
    });

    it('runs quality check on content', () => {
      cy.checkContentQuality('1');
      cy.get('[data-testid="content-item"]').first()
        .find('[data-testid="check-quality"]')
        .click();
      cy.wait('@checkContentQuality');
      cy.get('[data-testid="quality-results"]').within(() => {
        cy.get('[data-testid="overall-score"]')
          .should('exist');
        cy.get('[data-testid="improvement-suggestions"]')
          .should('exist');
      });
    });

    it('shows quality trends over time', () => {
      cy.get('[data-testid="quality-trends"]').should('exist');
      cy.get('[data-testid="trend-chart"]').within(() => {
        cy.get('[data-testid="average-score-trend"]')
          .should('exist');
        cy.get('[data-testid="quality-distribution"]')
          .should('exist');
      });
    });

    it('exports quality reports', () => {
      cy.get('[data-testid="export-quality-report"]').click();
      cy.get('[data-testid="export-options"]').within(() => {
        cy.get('[data-testid="date-range"]')
          .select('last-30-days');
        cy.get('[data-testid="format"]')
          .select('csv');
      });
      cy.get('[data-testid="download-report"]').click();
      cy.readFile('cypress/downloads/quality-report.csv')
        .should('exist');
    });
  });
}); 