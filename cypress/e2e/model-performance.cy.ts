/// <reference types="cypress" />

describe('Model Performance and A/B Testing', () => {
  beforeEach(() => {
    cy.login('admin@example.com', 'admin123');
  });

  describe('Model Performance Metrics', () => {
    beforeEach(() => {
      cy.visit('/admin/model-performance');
      cy.intercept('GET', '/api/v1/models/metrics', {
        fixture: 'model-metrics.json'
      }).as('getModelMetrics');
    });

    it('displays overall model performance metrics', () => {
      cy.wait('@getModelMetrics');
      cy.get('[data-testid="performance-metrics"]').within(() => {
        cy.get('[data-testid="precision"]').should('exist');
        cy.get('[data-testid="recall"]').should('exist');
        cy.get('[data-testid="f1-score"]').should('exist');
        cy.get('[data-testid="mae"]').should('exist');
      });
    });

    it('shows performance trends over time', () => {
      cy.get('[data-testid="metrics-chart"]').should('exist');
      cy.get('[data-testid="trend-indicators"]').within(() => {
        cy.get('[data-testid="precision-trend"]')
          .should('contain', '+5.2%');
      });
    });

    it('allows filtering metrics by model version', () => {
      cy.get('[data-testid="version-select"]').click();
      cy.get('[data-testid="version-option"]').first().click();
      cy.wait('@getModelMetrics');
      cy.get('[data-testid="version-metrics"]')
        .should('contain', 'Version 2.1.0');
    });

    it('displays feature importance analysis', () => {
      cy.get('[data-testid="feature-importance"]').should('exist');
      cy.get('[data-testid="feature-item"]')
        .should('have.length.at.least', 3);
    });
  });

  describe('A/B Testing Management', () => {
    beforeEach(() => {
      cy.visit('/admin/experiments');
      cy.intercept('GET', '/api/v1/experiments', {
        fixture: 'experiments.json'
      }).as('getExperiments');
    });

    it('creates new A/B test experiment', () => {
      cy.intercept('POST', '/api/v1/experiments', {
        statusCode: 201,
        body: {
          id: 'new-experiment',
          name: 'Content Ranking Test',
          status: 'active'
        }
      }).as('createExperiment');

      cy.get('[data-testid="create-experiment"]').click();
      cy.get('[data-testid="experiment-name"]')
        .type('Content Ranking Test');
      cy.get('[data-testid="experiment-description"]')
        .type('Testing new ranking algorithm');
      cy.get('[data-testid="control-group"]')
        .type('current_model');
      cy.get('[data-testid="treatment-group"]')
        .type('new_model');
      cy.get('[data-testid="traffic-split"]')
        .type('50');
      cy.get('[data-testid="save-experiment"]').click();

      cy.wait('@createExperiment');
      cy.get('[data-testid="experiment-success"]')
        .should('contain', 'Experiment created successfully');
    });

    it('monitors experiment results', () => {
      cy.get('[data-testid="experiment-list"]')
        .find('[data-testid="experiment-item"]')
        .first()
        .click();

      cy.get('[data-testid="experiment-metrics"]').within(() => {
        cy.get('[data-testid="conversion-diff"]')
          .should('exist');
        cy.get('[data-testid="engagement-diff"]')
          .should('exist');
        cy.get('[data-testid="statistical-significance"]')
          .should('exist');
      });
    });

    it('allows stopping experiments', () => {
      cy.intercept('PATCH', '/api/v1/experiments/*/status', {
        statusCode: 200
      }).as('updateStatus');

      cy.get('[data-testid="experiment-list"]')
        .find('[data-testid="experiment-item"]')
        .first()
        .find('[data-testid="stop-experiment"]')
        .click();

      cy.get('[data-testid="confirm-stop"]').click();
      cy.wait('@updateStatus');
      cy.get('[data-testid="experiment-status"]')
        .should('contain', 'Completed');
    });

    it('exports experiment results', () => {
      cy.get('[data-testid="experiment-list"]')
        .find('[data-testid="experiment-item"]')
        .first()
        .find('[data-testid="export-results"]')
        .click();

      cy.get('[data-testid="export-format"]')
        .select('csv');
      cy.get('[data-testid="confirm-export"]')
        .click();

      cy.readFile('cypress/downloads/experiment-results.csv')
        .should('exist');
    });
  });

  describe('Model Deployment', () => {
    beforeEach(() => {
      cy.visit('/admin/model-deployment');
    });

    it('deploys new model version', () => {
      cy.intercept('POST', '/api/v1/models/deploy', {
        statusCode: 200
      }).as('deployModel');

      cy.get('[data-testid="deploy-model"]').click();
      cy.get('[data-testid="model-version"]')
        .type('2.1.0');
      cy.get('[data-testid="deployment-notes"]')
        .type('Improved ranking algorithm');
      cy.get('[data-testid="confirm-deploy"]')
        .click();

      cy.wait('@deployModel');
      cy.get('[data-testid="deployment-success"]')
        .should('be.visible');
    });

    it('shows deployment history', () => {
      cy.get('[data-testid="deployment-history"]')
        .should('exist');
      cy.get('[data-testid="deployment-item"]')
        .should('have.length.at.least', 1);
    });

    it('allows rollback to previous version', () => {
      cy.intercept('POST', '/api/v1/models/rollback', {
        statusCode: 200
      }).as('rollbackModel');

      cy.get('[data-testid="deployment-history"]')
        .find('[data-testid="deployment-item"]')
        .first()
        .find('[data-testid="rollback-button"]')
        .click();

      cy.get('[data-testid="confirm-rollback"]')
        .click();
      cy.wait('@rollbackModel');
      cy.get('[data-testid="rollback-success"]')
        .should('be.visible');
    });
  });
}); 