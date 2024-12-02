/// <reference types="cypress" />

describe('Content Management Features', () => {
  beforeEach(() => {
    cy.login('moderator@example.com', 'moderator123');
  });

  describe('Content Moderation', () => {
    beforeEach(() => {
      cy.visit('/admin/moderation');
      cy.intercept('GET', '/api/v1/moderation/queue', {
        fixture: 'moderation-queue.json'
      }).as('getModerationQueue');
    });

    it('displays moderation queue', () => {
      cy.wait('@getModerationQueue');
      cy.get('[data-testid="moderation-queue"]').should('exist');
      cy.get('[data-testid="queue-item"]')
        .should('have.length.at.least', 1);
    });

    it('allows approving content', () => {
      cy.moderateContent('1', 'approve');
      cy.get('[data-testid="queue-item"]').first()
        .find('[data-testid="approve-button"]')
        .click();
      cy.wait('@moderateContent');
      cy.get('[data-testid="moderation-success"]')
        .should('contain', 'Content approved');
    });

    it('allows rejecting content with reason', () => {
      cy.moderateContent('2', 'reject');
      cy.get('[data-testid="queue-item"]').first()
        .find('[data-testid="reject-button"]')
        .click();
      cy.get('[data-testid="rejection-reason"]')
        .type('Inappropriate content');
      cy.get('[data-testid="confirm-reject"]')
        .click();
      cy.wait('@moderateContent');
      cy.get('[data-testid="moderation-success"]')
        .should('contain', 'Content rejected');
    });

    it('shows content details for review', () => {
      cy.get('[data-testid="queue-item"]').first()
        .click();
      cy.get('[data-testid="content-preview"]').within(() => {
        cy.get('[data-testid="content-title"]').should('exist');
        cy.get('[data-testid="content-description"]').should('exist');
        cy.get('[data-testid="content-metadata"]').should('exist');
      });
    });

    it('filters moderation queue by status', () => {
      cy.get('[data-testid="status-filter"]').click();
      cy.get('[data-testid="status-pending"]').click();
      cy.wait('@getModerationQueue');
      cy.get('[data-testid="queue-item"]')
        .should('have.length.at.least', 1)
        .each($item => {
          cy.wrap($item)
            .find('[data-testid="item-status"]')
            .should('contain', 'Pending');
        });
    });
  });

  describe('Recommendation Scheduling', () => {
    beforeEach(() => {
      cy.visit('/admin/scheduling');
      cy.intercept('GET', '/api/v1/recommendations/schedule', {
        fixture: 'recommendation-schedules.json'
      }).as('getSchedules');
    });

    it('creates new schedule', () => {
      const schedule = {
        startDate: '2023-08-10T10:00:00Z',
        endDate: '2023-08-17T10:00:00Z',
        priority: 'high',
        audience: ['new_users', 'active_users']
      };

      cy.scheduleRecommendation('1', schedule);
      cy.get('[data-testid="create-schedule"]').click();
      cy.get('[data-testid="schedule-form"]').within(() => {
        cy.get('[data-testid="start-date"]')
          .type('2023-08-10T10:00');
        cy.get('[data-testid="end-date"]')
          .type('2023-08-17T10:00');
        cy.get('[data-testid="priority"]')
          .select('high');
        cy.get('[data-testid="audience-select"]').click();
        cy.get('[data-testid="audience-new-users"]').click();
        cy.get('[data-testid="audience-active-users"]').click();
      });
      cy.get('[data-testid="save-schedule"]').click();
      cy.wait('@scheduleRecommendation');
    });

    it('displays schedule calendar', () => {
      cy.get('[data-testid="schedule-calendar"]').should('exist');
      cy.get('[data-testid="scheduled-item"]')
        .should('have.length.at.least', 1);
    });

    it('allows editing schedule', () => {
      cy.get('[data-testid="scheduled-item"]').first()
        .click();
      cy.get('[data-testid="edit-schedule"]').click();
      cy.get('[data-testid="priority"]')
        .select('medium');
      cy.get('[data-testid="save-schedule"]').click();
      cy.wait('@scheduleRecommendation');
      cy.get('[data-testid="schedule-success"]')
        .should('contain', 'Schedule updated');
    });

    it('shows schedule conflicts', () => {
      const conflictingSchedule = {
        startDate: '2023-08-10T10:00:00Z',
        endDate: '2023-08-17T10:00:00Z',
        priority: 'high'
      };

      cy.scheduleRecommendation('2', conflictingSchedule);
      cy.get('[data-testid="create-schedule"]').click();
      cy.get('[data-testid="schedule-form"]').within(() => {
        cy.get('[data-testid="start-date"]')
          .type('2023-08-10T10:00');
        cy.get('[data-testid="end-date"]')
          .type('2023-08-17T10:00');
      });
      cy.get('[data-testid="conflict-warning"]')
        .should('be.visible')
        .and('contain', 'Schedule conflict detected');
    });

    it('allows bulk scheduling', () => {
      cy.get('[data-testid="bulk-schedule"]').click();
      cy.get('[data-testid="item-select"]')
        .click()
        .get('[data-testid="select-all"]')
        .click();
      cy.get('[data-testid="bulk-schedule-form"]').within(() => {
        cy.get('[data-testid="start-date"]')
          .type('2023-08-20T10:00');
        cy.get('[data-testid="end-date"]')
          .type('2023-08-27T10:00');
        cy.get('[data-testid="distribution"]')
          .select('even');
      });
      cy.get('[data-testid="apply-bulk-schedule"]').click();
      cy.wait('@scheduleRecommendation');
      cy.get('[data-testid="bulk-success"]')
        .should('be.visible');
    });
  });
}); 