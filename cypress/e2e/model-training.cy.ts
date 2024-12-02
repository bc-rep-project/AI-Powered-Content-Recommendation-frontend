/// <reference types="cypress" />

describe('Model Training and Data Quality', () => {
  beforeEach(() => {
    cy.login('data_scientist@example.com', 'datascience123');
    cy.visit('/admin/model-training');
  });

  describe('Model Retraining', () => {
    beforeEach(() => {
      cy.intercept('GET', '/api/v1/models/training/overview', {
        fixture: 'training-overview.json'
      }).as('getTrainingOverview');
    });

    it('initiates model retraining', () => {
      const trainingConfig = {
        datasetId: 'dataset-123',
        epochs: 50,
        batchSize: 32,
        learningRate: 0.001,
        validationSplit: 0.2
      };

      cy.startModelRetraining(trainingConfig);
      cy.get('[data-testid="start-training"]').click();
      cy.get('[data-testid="training-form"]').within(() => {
        cy.get('[data-testid="dataset-select"]')
          .select('dataset-123');
        cy.get('[data-testid="epochs"]')
          .type('50');
        cy.get('[data-testid="batch-size"]')
          .type('32');
        cy.get('[data-testid="learning-rate"]')
          .type('0.001');
        cy.get('[data-testid="validation-split"]')
          .type('0.2');
      });
      cy.get('[data-testid="confirm-training"]').click();
      cy.wait('@startTraining');
    });

    it('monitors training progress', () => {
      cy.checkTrainingStatus();
      cy.get('[data-testid="training-progress"]').within(() => {
        cy.get('[data-testid="current-epoch"]')
          .should('exist');
        cy.get('[data-testid="loss-chart"]')
          .should('exist');
        cy.get('[data-testid="accuracy-chart"]')
          .should('exist');
        cy.get('[data-testid="eta"]')
          .should('exist');
      });
    });

    it('compares model versions', () => {
      cy.getModelMetrics();
      cy.get('[data-testid="model-comparison"]').click();
      cy.wait('@getMetrics');
      cy.get('[data-testid="metrics-comparison"]').within(() => {
        cy.get('[data-testid="accuracy-diff"]')
          .should('exist');
        cy.get('[data-testid="loss-diff"]')
          .should('exist');
        cy.get('[data-testid="performance-change"]')
          .should('exist');
      });
    });

    it('handles training failures', () => {
      cy.intercept('GET', '/api/v1/models/train/status', {
        statusCode: 500,
        body: {
          error: 'Out of memory error'
        }
      }).as('trainingError');

      cy.get('[data-testid="check-status"]').click();
      cy.wait('@trainingError');
      cy.get('[data-testid="error-message"]')
        .should('contain', 'Out of memory error');
      cy.get('[data-testid="retry-training"]')
        .should('be.visible');
    });
  });

  describe('Data Quality Monitoring', () => {
    beforeEach(() => {
      cy.visit('/admin/data-quality');
    });

    it('validates training dataset', () => {
      cy.validateDataset('dataset-123');
      cy.get('[data-testid="validate-dataset"]').click();
      cy.wait('@validateDataset');
      cy.get('[data-testid="validation-results"]').within(() => {
        cy.get('[data-testid="completeness-score"]')
          .should('exist');
        cy.get('[data-testid="consistency-score"]')
          .should('exist');
        cy.get('[data-testid="accuracy-score"]')
          .should('exist');
      });
    });

    it('shows data quality metrics', () => {
      cy.checkDataQuality('dataset-123');
      cy.get('[data-testid="quality-metrics"]').within(() => {
        cy.get('[data-testid="missing-values"]')
          .should('exist');
        cy.get('[data-testid="outliers"]')
          .should('exist');
        cy.get('[data-testid="distribution-chart"]')
          .should('exist');
      });
    });

    it('displays dataset statistics', () => {
      cy.getDatasetStats('dataset-123');
      cy.wait('@getDatasetStats');
      cy.get('[data-testid="dataset-stats"]').within(() => {
        cy.get('[data-testid="sample-size"]')
          .should('exist');
        cy.get('[data-testid="feature-stats"]')
          .should('exist');
        cy.get('[data-testid="correlation-matrix"]')
          .should('exist');
      });
    });

    it('configures data quality rules', () => {
      const qualityRules = {
        completeness: {
          threshold: 0.95,
          fields: ['user_id', 'interaction_type']
        },
        consistency: {
          rules: [
            {
              field: 'rating',
              condition: 'range',
              min: 1,
              max: 5
            }
          ]
        }
      };

      cy.updateDataQualityRules(qualityRules);
      cy.get('[data-testid="quality-settings"]').click();
      cy.get('[data-testid="completeness-threshold"]')
        .clear()
        .type('0.95');
      cy.get('[data-testid="add-field"]').click();
      cy.get('[data-testid="field-name"]')
        .type('rating');
      cy.get('[data-testid="rule-type"]')
        .select('range');
      cy.get('[data-testid="min-value"]')
        .type('1');
      cy.get('[data-testid="max-value"]')
        .type('5');
      cy.get('[data-testid="save-rules"]').click();
      cy.wait('@updateDataQualityRules');
    });

    it('generates data quality report', () => {
      cy.get('[data-testid="generate-report"]').click();
      cy.get('[data-testid="report-options"]').within(() => {
        cy.get('[data-testid="time-range"]')
          .select('last-7-days');
        cy.get('[data-testid="include-metrics"]')
          .check();
        cy.get('[data-testid="include-visualizations"]')
          .check();
      });
      cy.get('[data-testid="download-report"]').click();
      cy.readFile('cypress/downloads/data-quality-report.pdf')
        .should('exist');
    });
  });
}); 