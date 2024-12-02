/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    login(email: string, password: string): Chainable<void>
    register(username: string, email: string, password: string): Chainable<void>
    requestPasswordReset(email: string): Chainable<void>
    resetPassword(token: string, newPassword: string): Chainable<void>
    validateResetToken(token: string): Chainable<void>
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
    getRecommendationExplanation(itemId: string): Chainable<void>
    getFeatureImportance(itemId: string): Chainable<void>
  }
} 