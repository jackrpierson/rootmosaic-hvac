import fs from 'fs';
import path from 'path';
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

// Data loading function
function loadJsonData<T>(filename: string): T[] {
  const dataPath = path.join(process.cwd(), 'data', filename);
  const fileContents = fs.readFileSync(dataPath, 'utf8');
  return JSON.parse(fileContents) as T[];
}

// Type-safe data exports
export const clients: Client[] = loadJsonData<Client>('clients.json');
export const technicians: Technician[] = loadJsonData<Technician>('technicians.json');
export const jobs: Job[] = loadJsonData<Job>('jobs.json');
export const invoices: Invoice[] = loadJsonData<Invoice>('invoices.json');
export const contracts: Contract[] = loadJsonData<Contract>('contracts.json');
export const equipment: Equipment[] = loadJsonData<Equipment>('equipment.json');
export const callbacks: Callback[] = loadJsonData<Callback>('callbacks.json');
export const attachments: Attachment[] = loadJsonData<Attachment>('attachments.json');
export const pricebook: PricebookItem[] = loadJsonData<PricebookItem>('pricebook.json');

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