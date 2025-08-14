import { describe, it, expect } from 'vitest';
import { calculateKPIMetrics, calculateTechnicianMetrics, calculateClientMetrics } from '../metrics';

describe('Metrics Calculations', () => {
  describe('calculateKPIMetrics', () => {
    it('should return valid KPI metrics structure', () => {
      const metrics = calculateKPIMetrics();
      
      expect(metrics).toHaveProperty('revenue_mtd');
      expect(metrics).toHaveProperty('revenue_ytd');
      expect(metrics).toHaveProperty('gross_margin_percentage');
      expect(metrics).toHaveProperty('callback_rate');
      expect(metrics).toHaveProperty('first_time_fix_rate');
      expect(metrics).toHaveProperty('ar_aging');
      expect(metrics).toHaveProperty('jobs_over_budget');
      expect(metrics).toHaveProperty('contracts_due_renewal');
      
      expect(typeof metrics.revenue_mtd).toBe('number');
      expect(typeof metrics.revenue_ytd).toBe('number');
      expect(typeof metrics.gross_margin_percentage).toBe('number');
      expect(typeof metrics.callback_rate).toBe('number');
      expect(typeof metrics.first_time_fix_rate).toBe('number');
      
      expect(metrics.ar_aging).toHaveProperty('current');
      expect(metrics.ar_aging).toHaveProperty('days_30');
      expect(metrics.ar_aging).toHaveProperty('days_60');
      expect(metrics.ar_aging).toHaveProperty('days_90_plus');
    });

    it('should calculate reasonable percentage values', () => {
      const metrics = calculateKPIMetrics();
      
      expect(metrics.gross_margin_percentage).toBeGreaterThanOrEqual(0);
      expect(metrics.gross_margin_percentage).toBeLessThanOrEqual(100);
      
      expect(metrics.callback_rate).toBeGreaterThanOrEqual(0);
      expect(metrics.callback_rate).toBeLessThanOrEqual(100);
      
      expect(metrics.first_time_fix_rate).toBeGreaterThanOrEqual(0);
      expect(metrics.first_time_fix_rate).toBeLessThanOrEqual(100);
    });
  });

  describe('calculateTechnicianMetrics', () => {
    it('should return valid technician metrics', () => {
      // Using a known technician ID from our generated data
      const metrics = calculateTechnicianMetrics('test-tech-id');
      
      expect(metrics).toHaveProperty('technician_id');
      expect(metrics).toHaveProperty('first_time_fix_rate');
      expect(metrics).toHaveProperty('callback_rate');
      expect(metrics).toHaveProperty('efficiency_index');
      expect(metrics).toHaveProperty('avg_margin_contribution');
      expect(metrics).toHaveProperty('labor_variance_percentage');
      expect(metrics).toHaveProperty('total_jobs');
      
      expect(metrics.technician_id).toBe('test-tech-id');
      expect(typeof metrics.first_time_fix_rate).toBe('number');
      expect(typeof metrics.callback_rate).toBe('number');
      expect(typeof metrics.efficiency_index).toBe('number');
    });

    it('should handle technician with no jobs gracefully', () => {
      const metrics = calculateTechnicianMetrics('non-existent-tech');
      
      expect(metrics.total_jobs).toBe(0);
      expect(metrics.first_time_fix_rate).toBe(0);
      expect(metrics.callback_rate).toBe(0);
      expect(metrics.efficiency_index).toBe(0);
    });
  });

  describe('calculateClientMetrics', () => {
    it('should return valid client metrics', () => {
      const metrics = calculateClientMetrics('test-client-id');
      
      expect(metrics).toHaveProperty('client_id');
      expect(metrics).toHaveProperty('trailing_6mo_revenue');
      expect(metrics).toHaveProperty('avg_days_to_pay');
      expect(metrics).toHaveProperty('margin_percentage');
      expect(metrics).toHaveProperty('callback_load');
      expect(metrics).toHaveProperty('renewal_likelihood');
      expect(metrics).toHaveProperty('value_score');
      
      expect(metrics.client_id).toBe('test-client-id');
      expect(typeof metrics.trailing_6mo_revenue).toBe('number');
      expect(typeof metrics.value_score).toBe('number');
    });

    it('should calculate value score within reasonable range', () => {
      const metrics = calculateClientMetrics('test-client-id');
      
      expect(metrics.value_score).toBeGreaterThanOrEqual(0);
      expect(metrics.value_score).toBeLessThanOrEqual(100);
      
      expect(metrics.renewal_likelihood).toBeGreaterThanOrEqual(0);
      expect(metrics.renewal_likelihood).toBeLessThanOrEqual(100);
    });
  });
});