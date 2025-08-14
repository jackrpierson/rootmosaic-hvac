export interface Client {
  id: string;
  name: string;
  industry: string;
  address: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  credit_terms: number; // days
  service_level: 'standard' | 'priority' | 'premium';
  created_at: string;
}

export interface Technician {
  id: string;
  name: string;
  role: 'junior' | 'senior' | 'lead' | 'specialist';
  certifications: string[];
  hire_date: string;
  skill_ratings: {
    hvac_systems: number; // 1-10
    electrical: number;
    refrigeration: number;
    troubleshooting: number;
    customer_service: number;
  };
  hourly_cost: number; // includes overhead
  efficiency_score: number; // 0-100
}

export interface Job {
  id: string;
  client_id: string;
  technician_ids: string[];
  job_type: 'service' | 'install' | 'pm';
  system_type: 'RTU' | 'split' | 'mini-split' | 'chiller' | 'boiler' | 'refrigeration';
  site_location: string;
  scheduled_at: string;
  started_at: string | null;
  completed_at: string | null;
  labor_hours_actual: number | null;
  labor_hours_estimated: number;
  parts_cost: number;
  subcontractor_cost: number;
  travel_time_hours: number;
  notes: string;
  source_docs: string[];
  status: 'scheduled' | 'in_progress' | 'done' | 'invoiced' | 'paid' | 'canceled';
  came_back: boolean;
  comeback_id: string | null;
}

export interface Invoice {
  id: string;
  job_id: string;
  subtotal_labor: number;
  subtotal_parts: number;
  tax: number;
  total: number;
  issued_at: string;
  paid_at: string | null;
  days_to_pay: number | null;
  payment_method: 'check' | 'ach' | 'credit_card' | 'cash' | null;
}

export interface Contract {
  id: string;
  client_id: string;
  start_date: string;
  end_date: string;
  annual_value: number;
  visits_per_year: number;
  equipment_list: string[];
  renewal_date: string;
  status: 'active' | 'expired' | 'cancelled' | 'pending_renewal';
}

export interface Equipment {
  id: string;
  client_id: string;
  make: string;
  model: string;
  install_year: number;
  tonnage: number | null;
  refrigerant_type: string;
  last_service_date: string | null;
  failure_risk_score: number; // 0-100
}

export interface Callback {
  id: string;
  root_job_id: string;
  callback_job_id: string;
  reason_category: 'misdiagnosis' | 'part_failure' | 'workmanship' | 'documentation' | 'other';
  outcome: 'resolved' | 'repeat';
  corrective_action: string;
}

export interface Attachment {
  id: string;
  job_id: string;
  type: 'quote' | 'invoice' | 'field_note' | 'photo' | 'diagnostic';
  filename: string;
  extracted_summary: string;
}

export interface PricebookItem {
  id: string;
  part_number: string;
  description: string;
  category: string;
  cost: number;
  list_price: number;
  markup_percentage: number;
  supplier: string;
}

// Computed metrics interfaces
export interface KPIMetrics {
  revenue_mtd: number;
  revenue_ytd: number;
  gross_margin_percentage: number;
  callback_rate: number;
  first_time_fix_rate: number;
  ar_aging: {
    current: number;
    days_30: number;
    days_60: number;
    days_90_plus: number;
  };
  jobs_over_budget: number;
  contracts_due_renewal: number;
}

export interface TechnicianMetrics {
  technician_id: string;
  first_time_fix_rate: number;
  callback_rate: number;
  efficiency_index: number;
  avg_margin_contribution: number;
  labor_variance_percentage: number;
  total_jobs: number;
}

export interface ClientMetrics {
  client_id: string;
  trailing_6mo_revenue: number;
  avg_days_to_pay: number;
  margin_percentage: number;
  callback_load: number;
  renewal_likelihood: number;
  value_score: number;
}