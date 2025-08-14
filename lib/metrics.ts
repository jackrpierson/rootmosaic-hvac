import { 
  KPIMetrics, 
  TechnicianMetrics, 
  ClientMetrics,
  Job,
  Invoice,
  Contract,
  Callback,
  Client,
  Technician
} from '@/types';
import { 
  jobs, 
  invoices, 
  contracts, 
  callbacks, 
  clients, 
  technicians,
  getJobsByTechnicianId,
  getJobsByClientId,
  getContractsByClientId,
  getTechnicianById,
  getClientById,
  getInvoiceByJobId,
  isDateInRange,
  getMonthStart,
  getMonthEnd,
  getYearStart,
  addDays
} from './data';

// Constants for calculations
const OVERHEAD_MULTIPLIER = 1.4; // 40% overhead on labor costs
const TAX_RATE = 0.0825; // Nevada sales tax

/**
 * Calculate KPI metrics for the dashboard
 */
export function calculateKPIMetrics(asOfDate: Date = new Date()): KPIMetrics {
  const monthStart = getMonthStart(asOfDate);
  const monthEnd = getMonthEnd(asOfDate);
  const yearStart = getYearStart(asOfDate);
  
  // Revenue calculations
  const paidInvoicesYTD = invoices.filter(invoice => 
    invoice.paid_at && isDateInRange(invoice.paid_at, yearStart, asOfDate)
  );
  const paidInvoicesMTD = paidInvoicesYTD.filter(invoice =>
    invoice.paid_at && isDateInRange(invoice.paid_at, monthStart, monthEnd)
  );
  
  const revenueYTD = paidInvoicesYTD.reduce((sum, invoice) => sum + invoice.total, 0);
  const revenueMTD = paidInvoicesMTD.reduce((sum, invoice) => sum + invoice.total, 0);
  
  // Gross margin calculation
  const completedJobsYTD = jobs.filter(job => 
    job.completed_at && isDateInRange(job.completed_at, yearStart, asOfDate)
  );
  
  let totalRevenue = 0;
  let totalCosts = 0;
  
  completedJobsYTD.forEach(job => {
    const invoice = getInvoiceByJobId(job.id);
    if (invoice && invoice.paid_at) {
      totalRevenue += invoice.total;
      
      // Calculate total costs
      const laborCost = (job.labor_hours_actual || 0) * getBlendedLaborCost(job.technician_ids);
      const partsCost = job.parts_cost;
      const subCost = job.subcontractor_cost;
      
      totalCosts += laborCost + partsCost + subCost;
    }
  });
  
  const grossMarginPercentage = totalRevenue > 0 ? ((totalRevenue - totalCosts) / totalRevenue) * 100 : 0;
  
  // Callback rate (rolling 90 days)
  const ninetyDaysAgo = addDays(asOfDate, -90);
  const recentCompletedJobs = jobs.filter(job => 
    job.completed_at && isDateInRange(job.completed_at, ninetyDaysAgo, asOfDate)
  );
  const recentCallbacks = callbacks.filter(callback => {
    const rootJob = jobs.find(job => job.id === callback.root_job_id);
    return rootJob && rootJob.completed_at && isDateInRange(rootJob.completed_at, ninetyDaysAgo, asOfDate);
  });
  
  const callbackRate = recentCompletedJobs.length > 0 ? 
    (recentCallbacks.length / recentCompletedJobs.length) * 100 : 0;
  
  // First-time fix rate
  const firstTimeFixRate = recentCompletedJobs.length > 0 ? 
    ((recentCompletedJobs.length - recentCallbacks.length) / recentCompletedJobs.length) * 100 : 0;
  
  // AR Aging
  const unpaidInvoices = invoices.filter(invoice => !invoice.paid_at);
  const arAging = {
    current: 0,
    days_30: 0,
    days_60: 0,
    days_90_plus: 0
  };
  
  unpaidInvoices.forEach(invoice => {
    const daysOutstanding = Math.floor((asOfDate.getTime() - new Date(invoice.issued_at).getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysOutstanding <= 30) {
      arAging.current += invoice.total;
    } else if (daysOutstanding <= 60) {
      arAging.days_30 += invoice.total;
    } else if (daysOutstanding <= 90) {
      arAging.days_60 += invoice.total;
    } else {
      arAging.days_90_plus += invoice.total;
    }
  });
  
  // Jobs over budget
  const jobsOverBudget = completedJobsYTD.filter(job => {
    if (!job.labor_hours_actual) return false;
    return job.labor_hours_actual > job.labor_hours_estimated * 1.1; // 10% tolerance
  }).length;
  
  // Contracts due for renewal (next 90 days)
  const ninetyDaysFromNow = addDays(asOfDate, 90);
  const contractsDueRenewal = contracts.filter(contract => 
    contract.status === 'active' && 
    new Date(contract.renewal_date) <= ninetyDaysFromNow
  ).length;
  
  return {
    revenue_mtd: revenueMTD,
    revenue_ytd: revenueYTD,
    gross_margin_percentage: grossMarginPercentage,
    callback_rate: callbackRate,
    first_time_fix_rate: firstTimeFixRate,
    ar_aging: arAging,
    jobs_over_budget: jobsOverBudget,
    contracts_due_renewal: contractsDueRenewal
  };
}

/**
 * Calculate technician performance metrics
 */
export function calculateTechnicianMetrics(technicianId: string, asOfDate: Date = new Date()): TechnicianMetrics {
  const ninetyDaysAgo = addDays(asOfDate, -90);
  const techJobs = getJobsByTechnicianId(technicianId).filter(job => 
    job.completed_at && isDateInRange(job.completed_at, ninetyDaysAgo, asOfDate)
  );
  
  if (techJobs.length === 0) {
    return {
      technician_id: technicianId,
      first_time_fix_rate: 0,
      callback_rate: 0,
      efficiency_index: 0,
      avg_margin_contribution: 0,
      labor_variance_percentage: 0,
      total_jobs: 0
    };
  }
  
  // Callback rate for this technician
  const techCallbacks = callbacks.filter(callback => {
    const rootJob = jobs.find(job => job.id === callback.root_job_id);
    return rootJob && rootJob.technician_ids.includes(technicianId);
  });
  
  const callbackRate = (techCallbacks.length / techJobs.length) * 100;
  const firstTimeFixRate = 100 - callbackRate;
  
  // Labor variance
  let totalVariance = 0;
  let jobsWithVariance = 0;
  
  techJobs.forEach(job => {
    if (job.labor_hours_actual && job.labor_hours_estimated) {
      const variance = ((job.labor_hours_actual - job.labor_hours_estimated) / job.labor_hours_estimated) * 100;
      totalVariance += variance;
      jobsWithVariance++;
    }
  });
  
  const laborVariancePercentage = jobsWithVariance > 0 ? totalVariance / jobsWithVariance : 0;
  
  // Margin contribution
  let totalMarginContribution = 0;
  let marginJobs = 0;
  
  techJobs.forEach(job => {
    const invoice = getInvoiceByJobId(job.id);
    if (invoice && invoice.paid_at && job.labor_hours_actual) {
      const revenue = invoice.total;
      const laborCost = job.labor_hours_actual * getBlendedLaborCost([technicianId]);
      const totalCosts = laborCost + job.parts_cost + job.subcontractor_cost;
      const margin = revenue - totalCosts;
      
      totalMarginContribution += margin;
      marginJobs++;
    }
  });
  
  const avgMarginContribution = marginJobs > 0 ? totalMarginContribution / marginJobs : 0;
  
  // Efficiency index (composite score)
  const technician = getTechnicianById(technicianId);
  const baseEfficiency = technician?.efficiency_score || 70;
  const ftfBonus = firstTimeFixRate > 90 ? 10 : firstTimeFixRate > 80 ? 5 : 0;
  const variancePenalty = Math.abs(laborVariancePercentage) > 20 ? -10 : Math.abs(laborVariancePercentage) > 10 ? -5 : 0;
  
  const efficiencyIndex = Math.max(0, Math.min(100, baseEfficiency + ftfBonus + variancePenalty));
  
  return {
    technician_id: technicianId,
    first_time_fix_rate: firstTimeFixRate,
    callback_rate: callbackRate,
    efficiency_index: efficiencyIndex,
    avg_margin_contribution: avgMarginContribution,
    labor_variance_percentage: laborVariancePercentage,
    total_jobs: techJobs.length
  };
}

/**
 * Calculate client value metrics
 */
export function calculateClientMetrics(clientId: string, asOfDate: Date = new Date()): ClientMetrics {
  const sixMonthsAgo = addDays(asOfDate, -180);
  const clientJobs = getJobsByClientId(clientId).filter(job => 
    job.completed_at && isDateInRange(job.completed_at, sixMonthsAgo, asOfDate)
  );
  
  // Revenue calculation
  let trailing6moRevenue = 0;
  let totalDaysToPay = 0;
  let paidInvoicesCount = 0;
  let totalMargin = 0;
  let marginJobsCount = 0;
  
  clientJobs.forEach(job => {
    const invoice = getInvoiceByJobId(job.id);
    if (invoice) {
      if (invoice.paid_at) {
        trailing6moRevenue += invoice.total;
        
        if (invoice.days_to_pay) {
          totalDaysToPay += invoice.days_to_pay;
          paidInvoicesCount++;
        }
        
        // Margin calculation
        if (job.labor_hours_actual) {
          const laborCost = job.labor_hours_actual * getBlendedLaborCost(job.technician_ids);
          const totalCosts = laborCost + job.parts_cost + job.subcontractor_cost;
          const margin = invoice.total - totalCosts;
          
          totalMargin += margin;
          marginJobsCount++;
        }
      }
    }
  });
  
  const avgDaysToPay = paidInvoicesCount > 0 ? totalDaysToPay / paidInvoicesCount : 0;
  const marginPercentage = trailing6moRevenue > 0 ? (totalMargin / trailing6moRevenue) * 100 : 0;
  
  // Callback load
  const clientCallbacks = callbacks.filter(callback => {
    const rootJob = jobs.find(job => job.id === callback.root_job_id);
    return rootJob && rootJob.client_id === clientId;
  });
  const callbackLoad = clientJobs.length > 0 ? (clientCallbacks.length / clientJobs.length) * 100 : 0;
  
  // Renewal likelihood (for clients with contracts)
  const clientContracts = getContractsByClientId(clientId);
  let renewalLikelihood = 50; // Default
  
  if (clientContracts.length > 0) {
    // Factors: payment history, callback rate, margin
    let score = 50;
    
    if (avgDaysToPay <= 20) score += 20;
    else if (avgDaysToPay <= 35) score += 10;
    else if (avgDaysToPay > 45) score -= 20;
    
    if (callbackLoad < 5) score += 15;
    else if (callbackLoad > 15) score -= 15;
    
    if (marginPercentage > 25) score += 15;
    else if (marginPercentage < 10) score -= 15;
    
    renewalLikelihood = Math.max(0, Math.min(100, score));
  }
  
  // Value score (composite metric)
  let valueScore = 0;
  
  // Revenue component (0-40 points)
  if (trailing6moRevenue > 50000) valueScore += 40;
  else if (trailing6moRevenue > 25000) valueScore += 30;
  else if (trailing6moRevenue > 10000) valueScore += 20;
  else if (trailing6moRevenue > 5000) valueScore += 10;
  
  // Margin component (0-25 points)
  if (marginPercentage > 30) valueScore += 25;
  else if (marginPercentage > 20) valueScore += 20;
  else if (marginPercentage > 15) valueScore += 15;
  else if (marginPercentage > 10) valueScore += 10;
  
  // Payment component (0-20 points)
  if (avgDaysToPay <= 15) valueScore += 20;
  else if (avgDaysToPay <= 30) valueScore += 15;
  else if (avgDaysToPay <= 45) valueScore += 10;
  
  // Callback component (0-15 points, penalty)
  if (callbackLoad < 5) valueScore += 15;
  else if (callbackLoad < 10) valueScore += 10;
  else if (callbackLoad < 15) valueScore += 5;
  
  return {
    client_id: clientId,
    trailing_6mo_revenue: trailing6moRevenue,
    avg_days_to_pay: avgDaysToPay,
    margin_percentage: marginPercentage,
    callback_load: callbackLoad,
    renewal_likelihood: renewalLikelihood,
    value_score: valueScore
  };
}

/**
 * Get blended labor cost for a set of technicians
 */
function getBlendedLaborCost(technicianIds: string[]): number {
  if (technicianIds.length === 0) return 50; // Default rate
  
  const techCosts = technicianIds.map(id => {
    const tech = getTechnicianById(id);
    return tech ? tech.hourly_cost * OVERHEAD_MULTIPLIER : 50;
  });
  
  return techCosts.reduce((sum, cost) => sum + cost, 0) / techCosts.length;
}

/**
 * Calculate revenue by month for charting
 */
export function getRevenueByMonth(asOfDate: Date = new Date()): Array<{ month: string; revenue: number; margin: number }> {
  const yearStart = getYearStart(asOfDate);
  const months = [];
  
  for (let i = 0; i < 6; i++) {
    const monthDate = new Date(yearStart.getFullYear(), i, 1);
    const monthStart = getMonthStart(monthDate);
    const monthEnd = getMonthEnd(monthDate);
    
    const monthInvoices = invoices.filter(invoice => 
      invoice.paid_at && isDateInRange(invoice.paid_at, monthStart, monthEnd)
    );
    
    const revenue = monthInvoices.reduce((sum, invoice) => sum + invoice.total, 0);
    
    // Calculate margin for the month
    let totalCosts = 0;
    monthInvoices.forEach(invoice => {
      const job = jobs.find(j => j.id === invoice.job_id);
      if (job && job.labor_hours_actual) {
        const laborCost = job.labor_hours_actual * getBlendedLaborCost(job.technician_ids);
        totalCosts += laborCost + job.parts_cost + job.subcontractor_cost;
      }
    });
    
    const margin = revenue - totalCosts;
    
    months.push({
      month: monthDate.toLocaleDateString('en-US', { month: 'short' }),
      revenue,
      margin
    });
  }
  
  return months;
}

/**
 * Get top clients by revenue
 */
export function getTopClientsByRevenue(limit: number = 10, asOfDate: Date = new Date()): Array<{ client: Client; revenue: number; margin: number }> {
  const sixMonthsAgo = addDays(asOfDate, -180);
  
  const clientRevenues = clients.map(client => {
    const clientJobs = getJobsByClientId(client.id).filter(job => 
      job.completed_at && isDateInRange(job.completed_at, sixMonthsAgo, asOfDate)
    );
    
    let revenue = 0;
    let totalCosts = 0;
    
    clientJobs.forEach(job => {
      const invoice = getInvoiceByJobId(job.id);
      if (invoice && invoice.paid_at) {
        revenue += invoice.total;
        
        if (job.labor_hours_actual) {
          const laborCost = job.labor_hours_actual * getBlendedLaborCost(job.technician_ids);
          totalCosts += laborCost + job.parts_cost + job.subcontractor_cost;
        }
      }
    });
    
    return {
      client,
      revenue,
      margin: revenue - totalCosts
    };
  });
  
  return clientRevenues
    .filter(item => item.revenue > 0)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit);
}

/**
 * Get callback trends by category
 */
export function getCallbackTrends(asOfDate: Date = new Date()): Array<{ category: string; count: number; percentage: number }> {
  const ninetyDaysAgo = addDays(asOfDate, -90);
  const recentCallbacks = callbacks.filter(callback => {
    const rootJob = jobs.find(job => job.id === callback.root_job_id);
    return rootJob && rootJob.completed_at && isDateInRange(rootJob.completed_at, ninetyDaysAgo, asOfDate);
  });
  
  const categoryMap = new Map<string, number>();
  
  recentCallbacks.forEach(callback => {
    const current = categoryMap.get(callback.reason_category) || 0;
    categoryMap.set(callback.reason_category, current + 1);
  });
  
  const totalCallbacks = recentCallbacks.length;
  
  return Array.from(categoryMap.entries()).map(([category, count]) => ({
    category: category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    count,
    percentage: totalCallbacks > 0 ? (count / totalCallbacks) * 100 : 0
  }));
}