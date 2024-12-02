/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>
      shareRecommendation(itemId: string, platform: string): Chainable<void>
      checkAnalytics(metric: string): Chainable<void>
      updatePersonalization(settings: object): Chainable<void>
      exportRecommendations(format: string): Chainable<void>
      moderateContent(itemId: string, action: string): Chainable<void>
      scheduleRecommendation(itemId: string, schedule: object): Chainable<void>
      checkModeration(itemId: string): Chainable<void>
      checkSchedule(itemId: string): Chainable<void>
      runAiModeration(itemId: string): Chainable<void>
      checkAiModeration(itemId: string): Chainable<void>
      getQualityScore(itemId: string): Chainable<void>
      updateQualityThresholds(thresholds: object): Chainable<void>
      checkContentQuality(itemId: string): Chainable<void>
      getAiInsights(itemId: string): Chainable<void>
      startModelRetraining(config: object): Chainable<void>
      checkTrainingStatus(): Chainable<void>
      getModelMetrics(): Chainable<void>
      validateDataset(datasetId: string): Chainable<void>
      checkDataQuality(datasetId: string): Chainable<void>
      getDatasetStats(datasetId: string): Chainable<void>
      updateDataQualityRules(rules: object): Chainable<void>
      getRecommendationExplanation(itemId: string): Chainable<void>
      getFeatureImportance(itemId: string): Chainable<void>
      getContentLifecycle(itemId: string): Chainable<void>
      updateContentStage(itemId: string, stage: string): Chainable<void>
      getContentPerformance(itemId: string): Chainable<void>
      getExplanationFeedback(itemId: string): Chainable<void>
      updateContentMetadata(itemId: string, metadata: object): Chainable<void>
      archiveContent(itemId: string): Chainable<void>
    }
  }
}

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login');
  cy.get('[data-testid="email-input"]').type(email);
  cy.get('[data-testid="password-input"]').type(password);
  cy.get('[data-testid="login-button"]').click();
  cy.url().should('include', '/dashboard');
});

Cypress.Commands.add('shareRecommendation', (itemId: string, platform: string) => {
  cy.intercept('POST', `/api/v1/recommendations/${itemId}/share`, {
    statusCode: 200,
    body: { success: true, shareUrl: `https://share.example.com/${itemId}` }
  }).as('shareRecommendation');
});

Cypress.Commands.add('checkAnalytics', (metric: string) => {
  cy.intercept('GET', `/api/v1/analytics/${metric}`, {
    statusCode: 200,
    fixture: 'analytics.json'
  }).as('getAnalytics');
});

Cypress.Commands.add('updatePersonalization', (settings: object) => {
  cy.intercept('PATCH', '/api/v1/users/me/personalization', {
    statusCode: 200,
    body: { success: true, settings }
  }).as('updatePersonalization');
});

Cypress.Commands.add('exportRecommendations', (format: string) => {
  cy.intercept('GET', `/api/v1/recommendations/export?format=${format}`, {
    statusCode: 200,
    body: { success: true, downloadUrl: `https://export.example.com/recommendations.${format}` }
  }).as('exportRecommendations');
});

Cypress.Commands.add('moderateContent', (itemId: string, action: string) => {
  cy.intercept('POST', `/api/v1/moderation/items/${itemId}/actions`, {
    statusCode: 200,
    body: { success: true, action, status: 'completed' }
  }).as('moderateContent');
});

Cypress.Commands.add('scheduleRecommendation', (itemId: string, schedule: object) => {
  cy.intercept('POST', `/api/v1/recommendations/${itemId}/schedule`, {
    statusCode: 200,
    body: { success: true, schedule }
  }).as('scheduleRecommendation');
});

Cypress.Commands.add('checkModeration', (itemId: string) => {
  cy.intercept('GET', `/api/v1/moderation/items/${itemId}`, {
    statusCode: 200,
    fixture: 'moderation-status.json'
  }).as('checkModeration');
});

Cypress.Commands.add('checkSchedule', (itemId: string) => {
  cy.intercept('GET', `/api/v1/recommendations/${itemId}/schedule`, {
    statusCode: 200,
    fixture: 'recommendation-schedule.json'
  }).as('checkSchedule');
});

Cypress.Commands.add('runAiModeration', (itemId: string) => {
  cy.intercept('POST', `/api/v1/moderation/ai/${itemId}`, {
    statusCode: 200,
    body: {
      success: true,
      status: 'completed',
      results: {
        inappropriate: false,
        confidence: 0.95,
        categories: {
          spam: 0.01,
          offensive: 0.02,
          misleading: 0.01
        }
      }
    }
  }).as('runAiModeration');
});

Cypress.Commands.add('checkAiModeration', (itemId: string) => {
  cy.intercept('GET', `/api/v1/moderation/ai/${itemId}/status`, {
    statusCode: 200,
    fixture: 'ai-moderation-status.json'
  }).as('checkAiModeration');
});

Cypress.Commands.add('getQualityScore', (itemId: string) => {
  cy.intercept('GET', `/api/v1/content/${itemId}/quality`, {
    statusCode: 200,
    fixture: 'content-quality.json'
  }).as('getQualityScore');
});

Cypress.Commands.add('updateQualityThresholds', (thresholds: object) => {
  cy.intercept('PATCH', '/api/v1/settings/quality-thresholds', {
    statusCode: 200,
    body: { success: true, thresholds }
  }).as('updateQualityThresholds');
});

Cypress.Commands.add('checkContentQuality', (itemId: string) => {
  cy.intercept('GET', `/api/v1/content/${itemId}/quality/check`, {
    statusCode: 200,
    fixture: 'quality-check.json'
  }).as('checkContentQuality');
});

Cypress.Commands.add('getAiInsights', (itemId: string) => {
  cy.intercept('GET', `/api/v1/content/${itemId}/ai-insights`, {
    statusCode: 200,
    fixture: 'ai-insights.json'
  }).as('getAiInsights');
});

Cypress.Commands.add('startModelRetraining', (config: object) => {
  cy.intercept('POST', '/api/v1/models/train', {
    statusCode: 200,
    body: {
      success: true,
      jobId: 'train-123',
      status: 'started',
      config
    }
  }).as('startTraining');
});

Cypress.Commands.add('checkTrainingStatus', () => {
  cy.intercept('GET', '/api/v1/models/train/status', {
    statusCode: 200,
    fixture: 'training-status.json'
  }).as('checkTraining');
});

Cypress.Commands.add('getModelMetrics', () => {
  cy.intercept('GET', '/api/v1/models/metrics/latest', {
    statusCode: 200,
    fixture: 'model-performance.json'
  }).as('getMetrics');
});

Cypress.Commands.add('validateDataset', (datasetId: string) => {
  cy.intercept('POST', `/api/v1/datasets/${datasetId}/validate`, {
    statusCode: 200,
    fixture: 'dataset-validation.json'
  }).as('validateDataset');
});

Cypress.Commands.add('checkDataQuality', (datasetId: string) => {
  cy.intercept('GET', `/api/v1/datasets/${datasetId}/quality`, {
    statusCode: 200,
    fixture: 'data-quality.json'
  }).as('checkDataQuality');
});

Cypress.Commands.add('getDatasetStats', (datasetId: string) => {
  cy.intercept('GET', `/api/v1/datasets/${datasetId}/stats`, {
    statusCode: 200,
    fixture: 'dataset-stats.json'
  }).as('getDatasetStats');
});

Cypress.Commands.add('updateDataQualityRules', (rules: object) => {
  cy.intercept('PATCH', '/api/v1/settings/data-quality', {
    statusCode: 200,
    body: { success: true, rules }
  }).as('updateDataQualityRules');
});

Cypress.Commands.add('getRecommendationExplanation', (itemId: string) => {
  cy.intercept('GET', `/api/v1/recommendations/${itemId}/explanation`, {
    statusCode: 200,
    fixture: 'recommendation-explanation.json'
  }).as('getExplanation');
});

Cypress.Commands.add('getFeatureImportance', (itemId: string) => {
  cy.intercept('GET', `/api/v1/recommendations/${itemId}/features`, {
    statusCode: 200,
    fixture: 'feature-importance.json'
  }).as('getFeatures');
});

Cypress.Commands.add('getContentLifecycle', (itemId: string) => {
  cy.intercept('GET', `/api/v1/content/${itemId}/lifecycle`, {
    statusCode: 200,
    fixture: 'content-lifecycle.json'
  }).as('getLifecycle');
});

Cypress.Commands.add('updateContentStage', (itemId: string, stage: string) => {
  cy.intercept('PATCH', `/api/v1/content/${itemId}/stage`, {
    statusCode: 200,
    body: { success: true, stage }
  }).as('updateStage');
});

Cypress.Commands.add('getContentPerformance', (itemId: string) => {
  cy.intercept('GET', `/api/v1/content/${itemId}/performance`, {
    statusCode: 200,
    fixture: 'content-performance.json'
  }).as('getPerformance');
});

Cypress.Commands.add('getExplanationFeedback', (itemId: string) => {
  cy.intercept('GET', `/api/v1/recommendations/${itemId}/explanation/feedback`, {
    statusCode: 200,
    fixture: 'explanation-feedback.json'
  }).as('getExplanationFeedback');
});

Cypress.Commands.add('updateContentMetadata', (itemId: string, metadata: object) => {
  cy.intercept('PATCH', `/api/v1/content/${itemId}/metadata`, {
    statusCode: 200,
    body: { success: true, metadata }
  }).as('updateMetadata');
});

Cypress.Commands.add('archiveContent', (itemId: string) => {
  cy.intercept('POST', `/api/v1/content/${itemId}/archive`, {
    statusCode: 200,
    body: { success: true, status: 'archived' }
  }).as('archiveContent');
}); 