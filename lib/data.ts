import { 
  Client, 
  Technician, 
  Job, 
  Invoice, 
  Contract, 
  Equipment, 
  Callback, 
  Attachment, 
  PricebookItem 
} from '@/types';

// Import JSON data directly (edge-safe)
import clientsData from '@/data/clients.json';
import techniciansData from '@/data/technicians.json';
import jobsData from '@/data/jobs.json';
import invoicesData from '@/data/invoices.json';
import contractsData from '@/data/contracts.json';
import equipmentData from '@/data/equipment.json';
import callbacksData from '@/data/callbacks.json';
import attachmentsData from '@/data/attachments.json';
import pricebookData from '@/data/pricebook.json';

// Type-safe data exports
export const clients: Client[] = clientsData as Client[];
export const technicians: Technician[] = techniciansData as Technician[];
export const jobs: Job[] = jobsData as Job[];
export const invoices: Invoice[] = invoicesData as Invoice[];
export const contracts: Contract[] = contractsData as Contract[];
export const equipment: Equipment[] = equipmentData as Equipment[];
export const callbacks: Callback[] = callbacksData as Callback[];
export const attachments: Attachment[] = attachmentsData as Attachment[];
export const pricebook: PricebookItem[] = pricebookData as PricebookItem[];

// Utility functions for data access
export function getClientById(id: string): Client | undefined {
  return clients.find(client => client.id === id);
}

export function getTechnicianById(id: string): Technician | undefined {
  return technicians.find(tech => tech.id === id);
}

export function getJobById(id: string): Job | undefined {
  return jobs.find(job => job.id === id);
}

export function getInvoiceByJobId(jobId: string): Invoice | undefined {
  return invoices.find(invoice => invoice.job_id === jobId);
}

export function getContractsByClientId(clientId: string): Contract[] {
  return contracts.filter(contract => contract.client_id === clientId);
}

export function getEquipmentByClientId(clientId: string): Equipment[] {
  return equipment.filter(eq => eq.client_id === clientId);
}

export function getJobsByClientId(clientId: string): Job[] {
  return jobs.filter(job => job.client_id === clientId);
}

export function getJobsByTechnicianId(technicianId: string): Job[] {
  return jobs.filter(job => job.technician_ids.includes(technicianId));
}

export function getCallbacksByRootJobId(jobId: string): Callback[] {
  return callbacks.filter(callback => callback.root_job_id === jobId);
}

export function getAttachmentsByJobId(jobId: string): Attachment[] {
  return attachments.filter(attachment => attachment.job_id === jobId);
}

// Date utility functions
export function isDateInRange(date: string, startDate: Date, endDate: Date): boolean {
  const checkDate = new Date(date);
  return checkDate >= startDate && checkDate <= endDate;
}

export function getMonthStart(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function getMonthEnd(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export function getYearStart(date: Date): Date {
  return new Date(date.getFullYear(), 0, 1);
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}