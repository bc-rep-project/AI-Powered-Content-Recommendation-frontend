/// <reference types="cypress" />

// Import commands.js using ES2015 syntax:
import './commands';

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to login via API
       * @example cy.login('test@example.com', 'password123')
       */
      login(email: string, password: string): Chainable<any>;

      /**
       * Custom command to register via API
       * @example cy.register('testuser', 'test@example.com', 'password123')
       */
      register(username: string, email: string, password: string): Chainable<any>;

      /**
       * Custom command to request password reset
       * @example cy.requestPasswordReset('test@example.com')
       */
      requestPasswordReset(email: string): Chainable<any>;

      /**
       * Custom command to reset password
       * @example cy.resetPassword('reset-token', 'newPassword123')
       */
      resetPassword(token: string, newPassword: string): Chainable<any>;

      /**
       * Custom command to validate reset token
       * @example cy.validateResetToken('reset-token')
       */
      validateResetToken(token: string): Chainable<any>;
    }
  }
} 