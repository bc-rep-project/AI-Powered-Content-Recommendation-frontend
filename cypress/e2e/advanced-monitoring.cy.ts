/// <reference types="cypress" />

describe('Advanced Monitoring and Configuration', () => {
  beforeEach(() => {
    cy.login('admin@example.com', 'admin123');
    cy.visit('/admin/monitoring');
  });

  describe('Automated Alerts', () => {
    beforeEach(() => {
      cy.intercept('GET', '/api/v1/alerts/config', {
        fixture: 'alert-config.json'
      }).as('getAlertConfig');
      cy.intercept('GET', '/api/v1/alerts/history', {
        fixture: 'alert-history.json'
      }).as('getAlertHistory');
    });

    it('configures performance threshold alerts', () => {
      cy.get('[data-testid="alert-config"]').within(() => {
        cy.get('[data-testid="metric-select"]').select('recommendation_ctr');
        cy.get('[data-testid="threshold-input"]').type('0.15');
        cy.get('[data-testid="duration-input"]').type('24');
        cy.get('[data-testid="save-alert"]').click();
      });
      cy.get('[data-testid="alert-success"]').should('be.visible');
    });

    it('displays alert history with status', () => {
      cy.get('[data-testid="alert-history"]').within(() => {
        cy.get('[data-testid="alert-item"]').should('have.length.at.least', 1);
        cy.get('[data-testid="alert-status"]').should('exist');
        cy.get('[data-testid="alert-timestamp"]').should('exist');
      });
    });
  });

  describe('Custom Model Configurations', () => {
    beforeEach(() => {
      cy.intercept('GET', '/api/v1/models/config', {
        fixture: 'model-config.json'
      }).as('getModelConfig');
    });

    it('updates model hyperparameters', () => {
      cy.get('[data-testid="model-config"]').within(() => {
        cy.get('[data-testid="learning-rate"]').clear().type('0.001');
        cy.get('[data-testid="batch-size"]').clear().type('64');
        cy.get('[data-testid="embedding-dim"]').clear().type('128');
        cy.get('[data-testid="save-config"]').click();
      });
      cy.get('[data-testid="config-success"]').should('be.visible');
    });

    it('validates configuration changes', () => {
      cy.get('[data-testid="model-config"]').within(() => {
        cy.get('[data-testid="learning-rate"]').clear().type('-0.001');
        cy.get('[data-testid="save-config"]').click();
        cy.get('[data-testid="validation-error"]').should('be.visible');
      });
    });
  });

  describe('Performance Tracking', () => {
    beforeEach(() => {
      cy.intercept('GET', '/api/v1/metrics/performance', {
        fixture: 'performance-metrics.json'
      }).as('getPerformanceMetrics');
    });

    it('displays key performance indicators', () => {
      cy.get('[data-testid="performance-dashboard"]').within(() => {
        cy.get('[data-testid="ctr-metric"]').should('exist');
        cy.get('[data-testid="engagement-rate"]').should('exist');
        cy.get('[data-testid="retention-score"]').should('exist');
      });
    });

    it('filters performance by time range', () => {
      cy.get('[data-testid="date-range"]').click();
      cy.get('[data-testid="last-30-days"]').click();
      cy.wait('@getPerformanceMetrics');
      cy.get('[data-testid="performance-chart"]').should('be.visible');
    });
  });

  describe('Content Version Control', () => {
    beforeEach(() => {
      cy.intercept('GET', '/api/v1/content/versions', {
        fixture: 'content-versions.json'
      }).as('getContentVersions');
    });

    it('shows version history', () => {
      cy.get('[data-testid="version-history"]').within(() => {
        cy.get('[data-testid="version-item"]').should('have.length.at.least', 1);
        cy.get('[data-testid="version-diff"]').should('exist');
        cy.get('[data-testid="version-author"]').should('exist');
      });
    });

    it('allows version rollback', () => {
      cy.get('[data-testid="version-item"]').first().within(() => {
        cy.get('[data-testid="rollback-button"]').click();
      });
      cy.get('[data-testid="confirm-rollback"]').click();
      cy.get('[data-testid="rollback-success"]').should('be.visible');
    });
  });

  describe('Content Localization', () => {
    beforeEach(() => {
      cy.intercept('GET', '/api/v1/content/locales', {
        fixture: 'content-locales.json'
      }).as('getContentLocales');
    });

    it('manages content translations', () => {
      cy.get('[data-testid="locale-manager"]').within(() => {
        cy.get('[data-testid="add-locale"]').click();
        cy.get('[data-testid="locale-select"]').select('es');
        cy.get('[data-testid="translate-content"]').click();
      });
      cy.get('[data-testid="translation-success"]').should('be.visible');
    });

    it('validates translation completeness', () => {
      cy.get('[data-testid="translation-status"]').within(() => {
        cy.get('[data-testid="completion-rate"]').should('exist');
        cy.get('[data-testid="missing-translations"]').should('exist');
      });
    });
  });
}); 