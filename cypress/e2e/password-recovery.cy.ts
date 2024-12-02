/// <reference types="cypress" />

describe('Password Recovery Flow', () => {
  beforeEach(() => {
    cy.intercept('POST', '/api/v1/auth/forgot-password').as('forgotPassword');
    cy.intercept('POST', '/api/v1/auth/validate-reset-token').as('validateToken');
    cy.intercept('POST', '/api/v1/auth/reset-password').as('resetPassword');
  });

  describe('Forgot Password Page', () => {
    beforeEach(() => {
      cy.visit('/forgot-password');
    });

    it('displays the forgot password form', () => {
      cy.get('h2').should('contain', 'Reset Password');
      cy.get('input[type="email"]').should('exist');
      cy.get('button[type="submit"]').should('contain', 'Send Reset Link');
    });

    it('validates required email', () => {
      cy.get('button[type="submit"]').click();
      cy.get('form').contains('Email is required').should('be.visible');
    });

    it('validates email format', () => {
      cy.get('input[type="email"]').type('invalid-email');
      cy.get('button[type="submit"]').click();
      cy.get('form').contains('Email is invalid').should('be.visible');
    });

    it('handles successful password reset request', () => {
      const email = 'test@example.com';

      cy.get('input[type="email"]').type(email);
      cy.get('button[type="submit"]').click();

      cy.wait('@forgotPassword').its('response.statusCode').should('eq', 200);
      cy.contains('Check Your Email').should('be.visible');
      cy.contains(email).should('be.visible');
      cy.contains('Return to Login').should('be.visible');
    });

    it('handles failed password reset request', () => {
      cy.intercept('POST', '/api/v1/auth/forgot-password', {
        statusCode: 500,
        body: { detail: 'Server error' },
      });

      cy.get('input[type="email"]').type('test@example.com');
      cy.get('button[type="submit"]').click();

      cy.contains('Error').should('be.visible');
      cy.contains('An error occurred').should('be.visible');
    });

    it('shows loading state during submission', () => {
      cy.intercept('POST', '/api/v1/auth/forgot-password', {
        delay: 1000,
        body: {},
      });

      cy.get('input[type="email"]').type('test@example.com');
      cy.get('button[type="submit"]').click();

      cy.get('button[type="submit"]').should('be.disabled');
      cy.get('button[type="submit"]').should('have.attr', 'data-loading');
    });
  });

  describe('Reset Password Page', () => {
    const validToken = 'valid-reset-token';

    beforeEach(() => {
      cy.visit(`/reset-password?token=${validToken}`);
    });

    it('validates reset token on mount', () => {
      cy.wait('@validateToken')
        .its('request.body')
        .should('deep.equal', { token: validToken });
    });

    it('redirects on invalid token', () => {
      cy.intercept('POST', '/api/v1/auth/validate-reset-token', {
        statusCode: 400,
        body: { detail: 'Invalid token' },
      });

      cy.visit(`/reset-password?token=invalid-token`);
      cy.url().should('include', '/forgot-password');
      cy.contains('Invalid or expired link').should('be.visible');
    });

    it('validates password requirements', () => {
      // Test weak password
      cy.get('input[placeholder="Enter your new password"]').type('weak');
      cy.get('button[type="submit"]').click();
      cy.contains('Password does not meet requirements').should('be.visible');

      // Test password without uppercase
      cy.get('input[placeholder="Enter your new password"]').clear().type('test123!@#');
      cy.get('button[type="submit"]').click();
      cy.contains('Password does not meet requirements').should('be.visible');

      // Test password without special character
      cy.get('input[placeholder="Enter your new password"]').clear().type('Test123abc');
      cy.get('button[type="submit"]').click();
      cy.contains('Password does not meet requirements').should('be.visible');
    });

    it('validates password match', () => {
      cy.get('input[placeholder="Enter your new password"]').type('Test123!@#');
      cy.get('input[placeholder="Confirm your new password"]').type('Test123!@#different');
      cy.get('button[type="submit"]').click();
      cy.contains('Passwords do not match').should('be.visible');
    });

    it('handles successful password reset', () => {
      const newPassword = 'Test123!@#';

      cy.get('input[placeholder="Enter your new password"]').type(newPassword);
      cy.get('input[placeholder="Confirm your new password"]').type(newPassword);
      cy.get('button[type="submit"]').click();

      cy.wait('@resetPassword')
        .its('request.body')
        .should('deep.equal', {
          token: validToken,
          new_password: newPassword,
        });

      cy.url().should('include', '/login');
      cy.contains('Password reset successful').should('be.visible');
    });

    it('handles failed password reset', () => {
      cy.intercept('POST', '/api/v1/auth/reset-password', {
        statusCode: 400,
        body: { detail: 'Invalid token' },
      });

      cy.get('input[placeholder="Enter your new password"]').type('Test123!@#');
      cy.get('input[placeholder="Confirm your new password"]').type('Test123!@#');
      cy.get('button[type="submit"]').click();

      cy.contains('Password reset failed').should('be.visible');
    });

    it('shows loading state during submission', () => {
      cy.intercept('POST', '/api/v1/auth/reset-password', {
        delay: 1000,
        body: {},
      });

      cy.get('input[placeholder="Enter your new password"]').type('Test123!@#');
      cy.get('input[placeholder="Confirm your new password"]').type('Test123!@#');
      cy.get('button[type="submit"]').click();

      cy.get('button[type="submit"]').should('be.disabled');
      cy.get('button[type="submit"]').should('have.attr', 'data-loading');
    });
  });
}); 