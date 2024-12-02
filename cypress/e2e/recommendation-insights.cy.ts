/// <reference types="cypress" />

describe('Recommendation Insights and Content Lifecycle', () => {
  beforeEach(() => {
    cy.login('content_manager@example.com', 'manager123');
  });

  describe('Recommendation Explanations', () => {
    beforeEach(() => {
      cy.visit('/recommendations/1/insights');
    });

    it('displays recommendation explanation', () => {
      cy.getRecommendationExplanation('1');
      cy.wait('@getExplanation');
      cy.get('[data-testid="explanation-card"]').within(() => {
        cy.get('[data-testid="similarity-score"]')
          .should('exist');
        cy.get('[data-testid="user-preferences"]')
          .should('exist');
        cy.get('[data-testid="interaction-history"]')
          .should('exist');
      });
    });

    it('shows feature importance breakdown', () => {
      cy.getFeatureImportance('1');
      cy.wait('@getFeatures');
      cy.get('[data-testid="feature-importance"]').within(() => {
        cy.get('[data-testid="feature-chart"]')
          .should('exist');
        cy.get('[data-testid="feature-list"]')
          .children()
          .should('have.length.at.least', 3);
      });
    });

    it('collects explanation feedback', () => {
      cy.getExplanationFeedback('1');
      cy.get('[data-testid="feedback-form"]').within(() => {
        cy.get('[data-testid="helpful-rating"]')
          .click();
        cy.get('[data-testid="feedback-text"]')
          .type('This explanation helped me understand the recommendation');
        cy.get('[data-testid="submit-feedback"]')
          .click();
      });
      cy.get('[data-testid="feedback-success"]')
        .should('be.visible');
    });

    it('shows similar content recommendations', () => {
      cy.get('[data-testid="similar-content"]').within(() => {
        cy.get('[data-testid="similar-item"]')
          .should('have.length.at.least', 3);
        cy.get('[data-testid="similarity-reason"]')
          .first()
          .should('exist');
      });
    });

    it('exports explanation report', () => {
      cy.get('[data-testid="export-explanation"]').click();
      cy.get('[data-testid="export-options"]').within(() => {
        cy.get('[data-testid="include-features"]')
          .check();
        cy.get('[data-testid="include-similar"]')
          .check();
        cy.get('[data-testid="format-select"]')
          .select('pdf');
      });
      cy.get('[data-testid="download-report"]').click();
      cy.readFile('cypress/downloads/explanation-report.pdf')
        .should('exist');
    });
  });

  describe('Content Lifecycle Management', () => {
    beforeEach(() => {
      cy.visit('/content/lifecycle');
    });

    it('displays content lifecycle stages', () => {
      cy.getContentLifecycle('1');
      cy.wait('@getLifecycle');
      cy.get('[data-testid="lifecycle-timeline"]').within(() => {
        cy.get('[data-testid="stage-draft"]').should('exist');
        cy.get('[data-testid="stage-review"]').should('exist');
        cy.get('[data-testid="stage-published"]').should('exist');
        cy.get('[data-testid="stage-archived"]').should('exist');
      });
    });

    it('updates content stage', () => {
      cy.updateContentStage('1', 'review');
      cy.get('[data-testid="content-item"]').first()
        .find('[data-testid="stage-select"]')
        .select('review');
      cy.wait('@updateStage');
      cy.get('[data-testid="stage-updated"]')
        .should('be.visible');
    });

    it('shows content performance metrics', () => {
      cy.getContentPerformance('1');
      cy.wait('@getPerformance');
      cy.get('[data-testid="performance-metrics"]').within(() => {
        cy.get('[data-testid="views-trend"]').should('exist');
        cy.get('[data-testid="engagement-rate"]').should('exist');
        cy.get('[data-testid="completion-rate"]').should('exist');
        cy.get('[data-testid="feedback-score"]').should('exist');
      });
    });

    it('manages content metadata', () => {
      const metadata = {
        tags: ['machine-learning', 'beginner'],
        category: 'education',
        targetAudience: ['students', 'developers']
      };

      cy.updateContentMetadata('1', metadata);
      cy.get('[data-testid="edit-metadata"]').click();
      cy.get('[data-testid="metadata-form"]').within(() => {
        cy.get('[data-testid="tags-input"]')
          .type('machine-learning{enter}beginner{enter}');
        cy.get('[data-testid="category-select"]')
          .select('education');
        cy.get('[data-testid="audience-select"]')
          .click()
          .get('[data-testid="audience-students"]').click()
          .get('[data-testid="audience-developers"]').click();
      });
      cy.get('[data-testid="save-metadata"]').click();
      cy.wait('@updateMetadata');
    });

    it('archives outdated content', () => {
      cy.archiveContent('1');
      cy.get('[data-testid="content-item"]').first()
        .find('[data-testid="archive-button"]')
        .click();
      cy.get('[data-testid="archive-reason"]')
        .type('Content is outdated');
      cy.get('[data-testid="confirm-archive"]')
        .click();
      cy.wait('@archiveContent');
      cy.get('[data-testid="archive-success"]')
        .should('be.visible');
    });

    it('shows content health indicators', () => {
      cy.get('[data-testid="content-health"]').within(() => {
        cy.get('[data-testid="freshness-score"]')
          .should('exist');
        cy.get('[data-testid="relevance-score"]')
          .should('exist');
        cy.get('[data-testid="quality-score"]')
          .should('exist');
      });
    });

    it('generates content lifecycle report', () => {
      cy.get('[data-testid="generate-report"]').click();
      cy.get('[data-testid="report-options"]').within(() => {
        cy.get('[data-testid="date-range"]')
          .select('last-30-days');
        cy.get('[data-testid="include-performance"]')
          .check();
        cy.get('[data-testid="include-stages"]')
          .check();
      });
      cy.get('[data-testid="download-report"]').click();
      cy.readFile('cypress/downloads/lifecycle-report.pdf')
        .should('exist');
    });
  });
}); 