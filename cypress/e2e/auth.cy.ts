/// <reference types="cypress" />

describe('Authentication Flow', () => {
  const testUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'Test123!@#',
  };

  beforeEach(() => {
    cy.intercept('POST', '/api/v1/auth/register').as('register');
    cy.intercept('POST', '/api/v1/auth/token').as('login');
    cy.intercept('GET', '/api/v1/users/me').as('getUser');
  });

  describe('Registration', () => {
    beforeEach(() => {
      cy.visit('/register');
    });

    it('displays registration form', () => {
      cy.get('h2').should('contain', 'Create Account');
      cy.get('input[placeholder="Enter your username"]').should('exist');
      cy.get('input[placeholder="Enter your email"]').should('exist');
      cy.get('input[placeholder="Enter your password"]').should('exist');
      cy.get('input[placeholder="Confirm your password"]').should('exist');
      cy.get('button[type="submit"]').should('contain', 'Register');
    });

    it('validates required fields', () => {
      cy.get('button[type="submit"]').click();
      cy.contains('Username is required').should('be.visible');
      cy.contains('Email is required').should('be.visible');
      cy.contains('Password is required').should('be.visible');
    });

    it('validates email format', () => {
      cy.get('input[placeholder="Enter your email"]').type('invalid-email');
      cy.get('button[type="submit"]').click();
      cy.contains('Email is invalid').should('be.visible');
    });

    it('validates password requirements', () => {
      // Test weak password
      cy.get('input[placeholder="Enter your password"]').type('weak');
      cy.get('button[type="submit"]').click();
      cy.contains('Password does not meet requirements').should('be.visible');

      // Test password without uppercase
      cy.get('input[placeholder="Enter your password"]').clear().type('test123!@#');
      cy.get('button[type="submit"]').click();
      cy.contains('Password does not meet requirements').should('be.visible');

      // Test password without special character
      cy.get('input[placeholder="Enter your password"]').clear().type('Test123abc');
      cy.get('button[type="submit"]').click();
      cy.contains('Password does not meet requirements').should('be.visible');
    });

    it('validates password match', () => {
      cy.get('input[placeholder="Enter your password"]').type(testUser.password);
      cy.get('input[placeholder="Confirm your password"]').type(testUser.password + 'different');
      cy.get('button[type="submit"]').click();
      cy.contains('Passwords do not match').should('be.visible');
    });

    it('handles successful registration', () => {
      // Fill form
      cy.get('input[placeholder="Enter your username"]').type(testUser.username);
      cy.get('input[placeholder="Enter your email"]').type(testUser.email);
      cy.get('input[placeholder="Enter your password"]').type(testUser.password);
      cy.get('input[placeholder="Confirm your password"]').type(testUser.password);

      // Submit form
      cy.get('button[type="submit"]').click();

      // Check API call
      cy.wait('@register').its('request.body').should('deep.equal', {
        username: testUser.username,
        email: testUser.email,
        password: testUser.password,
      });

      // Should redirect to dashboard
      cy.url().should('include', '/dashboard');
    });

    it('handles registration error', () => {
      cy.intercept('POST', '/api/v1/auth/register', {
        statusCode: 400,
        body: { detail: 'Email already registered' },
      });

      // Fill form
      cy.get('input[placeholder="Enter your username"]').type(testUser.username);
      cy.get('input[placeholder="Enter your email"]').type(testUser.email);
      cy.get('input[placeholder="Enter your password"]').type(testUser.password);
      cy.get('input[placeholder="Confirm your password"]').type(testUser.password);

      // Submit form
      cy.get('button[type="submit"]').click();

      // Should show error
      cy.contains('Registration failed').should('be.visible');
      cy.contains('Email already registered').should('be.visible');
    });
  });

  describe('Login', () => {
    beforeEach(() => {
      cy.visit('/login');
    });

    it('displays login form', () => {
      cy.get('h2').should('contain', 'Login');
      cy.get('input[placeholder="Enter your email"]').should('exist');
      cy.get('input[placeholder="Enter your password"]').should('exist');
      cy.get('button[type="submit"]').should('contain', 'Login');
    });

    it('validates required fields', () => {
      cy.get('button[type="submit"]').click();
      cy.contains('Email is required').should('be.visible');
      cy.contains('Password is required').should('be.visible');
    });

    it('validates email format', () => {
      cy.get('input[placeholder="Enter your email"]').type('invalid-email');
      cy.get('button[type="submit"]').click();
      cy.contains('Email is invalid').should('be.visible');
    });

    it('handles successful login', () => {
      // Fill form
      cy.get('input[placeholder="Enter your email"]').type(testUser.email);
      cy.get('input[placeholder="Enter your password"]').type(testUser.password);

      // Submit form
      cy.get('button[type="submit"]').click();

      // Check API call
      cy.wait('@login').its('request.body').should('deep.equal', {
        username: testUser.email,
        password: testUser.password,
      });

      // Should redirect to dashboard
      cy.url().should('include', '/dashboard');
    });

    it('handles login error', () => {
      cy.intercept('POST', '/api/v1/auth/token', {
        statusCode: 401,
        body: { detail: 'Invalid credentials' },
      });

      // Fill form
      cy.get('input[placeholder="Enter your email"]').type(testUser.email);
      cy.get('input[placeholder="Enter your password"]').type(testUser.password);

      // Submit form
      cy.get('button[type="submit"]').click();

      // Should show error
      cy.contains('Login failed').should('be.visible');
      cy.contains('Invalid credentials').should('be.visible');
    });

    it('provides link to registration', () => {
      cy.contains('Register here').should('have.attr', 'href', '/register');
    });

    it('provides link to forgot password', () => {
      cy.contains('Forgot your password?').should('have.attr', 'href', '/forgot-password');
    });
  });

  describe('Social Authentication', () => {
    beforeEach(() => {
      cy.visit('/login');
    });

    it('displays social login buttons', () => {
      cy.contains('Continue with Google').should('exist');
      cy.contains('Continue with GitHub').should('exist');
      cy.contains('Continue with Facebook').should('exist');
    });

    it('handles Google login', () => {
      cy.window().then((win) => {
        cy.stub(win, 'open').as('windowOpen');
      });

      cy.contains('Continue with Google').click();
      cy.get('@windowOpen').should('be.calledWith', 
        '/api/v1/auth/google',
        'Google Login',
        'width=500,height=600'
      );
    });

    it('handles GitHub login', () => {
      cy.window().then((win) => {
        cy.stub(win, 'open').as('windowOpen');
      });

      cy.contains('Continue with GitHub').click();
      cy.get('@windowOpen').should('be.calledWith', 
        '/api/v1/auth/github',
        'GitHub Login',
        'width=500,height=600'
      );
    });

    it('handles Facebook login', () => {
      cy.window().then((win) => {
        cy.stub(win, 'open').as('windowOpen');
      });

      cy.contains('Continue with Facebook').click();
      cy.get('@windowOpen').should('be.calledWith', 
        '/api/v1/auth/facebook',
        'Facebook Login',
        'width=500,height=600'
      );
    });
  });

  describe('Protected Routes', () => {
    it('redirects to login when accessing protected route without auth', () => {
      cy.visit('/dashboard');
      cy.url().should('include', '/login');
    });

    it('allows access to protected route with auth', () => {
      // Login first
      cy.login(testUser.email, testUser.password);

      // Visit protected route
      cy.visit('/dashboard');
      cy.url().should('include', '/dashboard');
    });

    it('persists auth state across page reloads', () => {
      // Login first
      cy.login(testUser.email, testUser.password);

      // Visit protected route
      cy.visit('/dashboard');

      // Reload page
      cy.reload();

      // Should still be on dashboard
      cy.url().should('include', '/dashboard');
    });

    it('handles logout', () => {
      // Login first
      cy.login(testUser.email, testUser.password);

      // Visit dashboard
      cy.visit('/dashboard');

      // Click logout
      cy.contains('Logout').click();

      // Should redirect to login
      cy.url().should('include', '/login');

      // Try to visit dashboard again
      cy.visit('/dashboard');
      cy.url().should('include', '/login');
    });
  });
}); 