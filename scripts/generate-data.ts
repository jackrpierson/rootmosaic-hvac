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
} from '../types';

// Seeded random number generator for consistent results
class SeededRandom {
  private seed: number;
  
  constructor(seed: number) {
    this.seed = seed;
  }
  
  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
  
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }
  
  choice<T>(array: T[]): T {
    return array[this.nextInt(0, array.length - 1)];
  }
  
  weighted<T>(choices: { item: T; weight: number }[]): T {
    const totalWeight = choices.reduce((sum, choice) => sum + choice.weight, 0);
    let random = this.next() * totalWeight;
    
    for (const choice of choices) {
      random -= choice.weight;
      if (random <= 0) return choice.item;
    }
    
    return choices[choices.length - 1].item;
  }
}

const rng = new SeededRandom(42);

const INDUSTRIES = [
  'Restaurant', 'Retail Store', 'Office Building', 'Warehouse', 
  'Medical Facility', 'Auto Shop', 'Hotel', 'Grocery Store',
  'Manufacturing', 'Gym/Fitness', 'School/Daycare', 'Church'
];

const SYSTEM_TYPES = ['RTU', 'split', 'mini-split', 'chiller', 'boiler', 'refrigeration'];

const HVAC_MAKES = ['Carrier', 'Trane', 'Lennox', 'Rheem', 'Goodman', 'York', 'Daikin', 'Mitsubishi'];

const REFRIGERANTS = ['R-410A', 'R-22', 'R-134a', 'R-404A', 'R-507A'];

const CERTIFICATIONS = [
  'EPA 608 Universal', 'NATE Certified', 'HVAC Excellence', 'Refrigeration Service Engineers Society',
  'Electrical License', 'OSHA 10', 'Carrier Factory Trained', 'Trane Certified'
];

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

function formatDate(date: Date): string {
  return date.toISOString();
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function generateClients(): Client[] {
  const clients: Client[] = [];
  const baseNames = [
    'Vegas Steakhouse', 'Desert Rose Retail', 'Canyon Office Plaza', 'Silver State Warehouse',
    'Sunrise Medical Center', 'Red Rock Auto', 'Mirage Hotel', 'Valley Fresh Market',
    'Nevada Manufacturing', 'Fit Zone Gym', 'Little Angels Daycare', 'Community Church',
    'Neon Nights Restaurant', 'Strip Mall Shops', 'Corporate Tower', 'Logistics Hub',
    'Urgent Care Clinic', 'Elite Motors', 'Oasis Resort', 'Fresh Foods Market',
    'Precision Parts', 'Iron Gym', 'Bright Start School', 'Grace Chapel'
  ];
  
  for (let i = 0; i < 60; i++) {
    const industry = rng.choice(INDUSTRIES);
    const baseName = rng.choice(baseNames);
    const createdDate = new Date(2024, rng.nextInt(0, 11), rng.nextInt(1, 28));
    
    clients.push({
      id: generateId(),
      name: `${baseName} ${i > 23 ? rng.nextInt(2, 9) : ''}`.trim(),
      industry,
      address: `${rng.nextInt(100, 9999)} ${rng.choice(['S Las Vegas Blvd', 'W Flamingo Rd', 'N Decatur Blvd', 'E Tropicana Ave', 'S Rainbow Blvd'])}, Las Vegas, NV ${rng.nextInt(89101, 89199)}`,
      contact_name: `${rng.choice(['John', 'Sarah', 'Mike', 'Lisa', 'David', 'Amy', 'Robert', 'Jennifer'])} ${rng.choice(['Smith', 'Johnson', 'Williams', 'Brown', 'Davis', 'Miller', 'Wilson', 'Garcia'])}`,
      contact_email: `contact${i}@${baseName.toLowerCase().replace(/\\s+/g, '')}.com`,
      contact_phone: `(702) ${rng.nextInt(200, 999)}-${rng.nextInt(1000, 9999)}`,
      credit_terms: rng.weighted([
        { item: 30, weight: 60 },
        { item: 15, weight: 25 },
        { item: 45, weight: 10 },
        { item: 0, weight: 5 } // Net due on receipt
      ]),
      service_level: rng.weighted([
        { item: 'standard', weight: 60 },
        { item: 'priority', weight: 30 },
        { item: 'premium', weight: 10 }
      ]),
      created_at: formatDate(createdDate)
    });
  }
  
  return clients;
}

function generateTechnicians(): Technician[] {
  const names = [
    'Carlos Martinez', 'Jake Thompson', 'Miguel Rodriguez', 'Tony Russo', 'Steve Johnson',
    'Dave Wilson', 'Frank Garcia', 'Eddie Chen', 'Mario Lopez', 'Alex Kim',
    'Ryan O\'Connor', 'Sam Patel', 'Chris Anderson', 'Tyler Brown'
  ];
  
  return names.map((name, i) => {
    const hireDate = new Date(2020 + rng.nextInt(0, 4), rng.nextInt(0, 11), rng.nextInt(1, 28));
    const role = rng.weighted([
      { item: 'junior' as const, weight: 20 },
      { item: 'senior' as const, weight: 50 },
      { item: 'lead' as const, weight: 20 },
      { item: 'specialist' as const, weight: 10 }
    ]);
    
    const baseCost = role === 'junior' ? 35 : role === 'senior' ? 45 : role === 'lead' ? 55 : 65;
    
    return {
      id: generateId(),
      name,
      role,
      certifications: CERTIFICATIONS.slice(0, rng.nextInt(2, 5)),
      hire_date: formatDate(hireDate),
      skill_ratings: {
        hvac_systems: rng.nextInt(role === 'junior' ? 5 : 7, 10),
        electrical: rng.nextInt(role === 'junior' ? 4 : 6, 10),
        refrigeration: rng.nextInt(role === 'junior' ? 4 : 6, 10),
        troubleshooting: rng.nextInt(role === 'junior' ? 5 : 7, 10),
        customer_service: rng.nextInt(6, 10)
      },
      hourly_cost: baseCost + rng.nextInt(-5, 10),
      efficiency_score: rng.nextInt(role === 'junior' ? 60 : 70, 95)
    };
  });
}

function generateJobs(clients: Client[], technicians: Technician[]): Job[] {
  const jobs: Job[] = [];
  const startDate = new Date(2025, 0, 1); // January 1, 2025
  const endDate = new Date(2025, 5, 30); // June 30, 2025
  
  // Generate roughly 1200 jobs over 6 months (200 per month)
  for (let month = 0; month < 6; month++) {
    const monthStart = new Date(2025, month, 1);
    const monthEnd = new Date(2025, month + 1, 0);
    const daysInMonth = monthEnd.getDate();
    
    // Seasonal adjustment - more emergency calls in May/June
    const baseJobsPerMonth = 200;
    const seasonalMultiplier = month >= 4 ? 1.3 : 1.0;
    const jobsThisMonth = Math.floor(baseJobsPerMonth * seasonalMultiplier);
    
    for (let j = 0; j < jobsThisMonth; j++) {
      const scheduledDate = new Date(monthStart);
      scheduledDate.setDate(rng.nextInt(1, daysInMonth));
      scheduledDate.setHours(rng.nextInt(7, 17), rng.nextInt(0, 59));
      
      const client = rng.choice(clients);
      const jobType = rng.weighted([
        { item: 'service' as const, weight: 65 },
        { item: 'pm' as const, weight: 25 },
        { item: 'install' as const, weight: 10 }
      ]);
      
      const systemType = rng.choice(SYSTEM_TYPES);
      const estimatedHours = jobType === 'install' ? rng.nextInt(4, 16) : 
                           jobType === 'pm' ? rng.nextInt(1, 3) : 
                           rng.nextInt(1, 8);
      
      const numTechs = estimatedHours > 8 ? 2 : 1;
      const assignedTechs = [rng.choice(technicians)];
      if (numTechs === 2) {
        let secondTech = rng.choice(technicians);
        while (secondTech.id === assignedTechs[0].id) {
          secondTech = rng.choice(technicians);
        }
        assignedTechs.push(secondTech);
      }
      
      const isCompleted = scheduledDate < new Date();
      const startedAt = isCompleted ? new Date(scheduledDate.getTime() + rng.nextInt(0, 30) * 60000) : null;
      const actualHours = isCompleted ? estimatedHours + rng.nextInt(-2, 4) : null;
      const completedAt = isCompleted && startedAt ? 
        new Date(startedAt.getTime() + (actualHours || estimatedHours) * 3600000) : null;
      
      const partsCost = jobType === 'install' ? rng.nextInt(500, 3000) :
                       jobType === 'service' ? rng.nextInt(0, 800) :
                       rng.nextInt(0, 200);
      
      const notes = generateJobNotes(jobType, systemType);
      
      const job: Job = {
        id: generateId(),
        client_id: client.id,
        technician_ids: assignedTechs.map(t => t.id),
        job_type: jobType,
        system_type: systemType as any,
        site_location: client.address,
        scheduled_at: formatDate(scheduledDate),
        started_at: startedAt ? formatDate(startedAt) : null,
        completed_at: completedAt ? formatDate(completedAt) : null,
        labor_hours_actual: actualHours,
        labor_hours_estimated: estimatedHours,
        parts_cost: partsCost,
        subcontractor_cost: jobType === 'install' && rng.next() < 0.2 ? rng.nextInt(200, 1000) : 0,
        travel_time_hours: rng.nextInt(0, 2),
        notes,
        source_docs: generateSourceDocs(jobType),
        status: isCompleted ? 
          rng.weighted([
            { item: 'done' as const, weight: 20 },
            { item: 'invoiced' as const, weight: 40 },
            { item: 'paid' as const, weight: 40 }
          ]) : 
          rng.weighted([
            { item: 'scheduled' as const, weight: 70 },
            { item: 'in_progress' as const, weight: 30 }
          ]),
        came_back: false, // Will be set later when generating callbacks
        comeback_id: null
      };
      
      jobs.push(job);
    }
  }
  
  return jobs;
}

function generateJobNotes(jobType: string, systemType: string): string {
  const serviceNotes = [
    'Unit not cooling properly. Found low refrigerant levels, leak in evaporator coil. Sealed leak and recharged system.',
    'Customer reported strange noises from unit. Diagnosed faulty compressor relay. Replaced relay, tested operation.',
    'No heat complaint. Discovered cracked heat exchanger. Recommended unit replacement for safety.',
    'Intermittent operation issues. Found loose electrical connections at contactor. Tightened connections, cleaned contacts.',
    'High energy bills complaint. Found dirty filters and coils. Performed thorough cleaning, replaced filters.',
    'Unit short cycling. Diagnosed oversized equipment for space. Adjusted settings, recommended proper sizing for future.',
    'Water leak around unit. Found clogged drain line. Cleared blockage, treated with biocide tablets.',
    'Poor airflow throughout building. Found multiple duct leaks. Sealed ducts, balanced system.',
    'Unit not starting. Found failed capacitor. Replaced start and run capacitors, tested motor operation.',
    'Thermostat issues reported. Found outdated manual thermostat. Upgraded to programmable digital unit.'
  ];
  
  const pmNotes = [
    'Routine preventive maintenance completed. Changed filters, cleaned coils, checked refrigerant levels.',
    'Annual service performed. Lubricated motors, tightened electrical connections, tested safety controls.',
    'Quarterly PM visit. Inspected belts and pulleys, cleaned condenser coils, verified proper operation.',
    'Maintenance contract service. Replaced worn contactors, checked system pressures, calibrated controls.',
    'Seasonal startup performed. Tested heating and cooling modes, verified proper refrigerant charge.',
    'Building maintenance checkup. Inspected ductwork, changed filters, cleaned outdoor units.'
  ];
  
  const installNotes = [
    'New HVAC system installation completed. Ran refrigerant lines, installed ductwork, commissioned system.',
    'Equipment replacement project. Removed old unit, installed new energy-efficient system with warranty.',
    'Expansion project installation. Added new zone with dedicated equipment, integrated with existing controls.',
    'Emergency replacement install. Customer\'s old unit failed completely, installed temporary then permanent solution.',
    'Upgrade installation completed. Replaced aging equipment with modern high-efficiency units.',
    'New construction HVAC install. Complete system design and installation per architectural plans.'
  ];
  
  const notesPool = jobType === 'service' ? serviceNotes : 
                   jobType === 'pm' ? pmNotes : installNotes;
  
  return rng.choice(notesPool);
}

function generateSourceDocs(jobType: string): string[] {
  const docs: string[] = [];
  
  if (jobType === 'install') {
    docs.push('quote_' + generateId() + '.pdf');
    docs.push('proposal_' + generateId() + '.pdf');
    if (rng.next() < 0.3) docs.push('permit_' + generateId() + '.pdf');
  }
  
  if (rng.next() < 0.7) {
    docs.push('field_notes_' + generateId() + '.pdf');
  }
  
  if (rng.next() < 0.4) {
    docs.push('diagnostic_report_' + generateId() + '.pdf');
  }
  
  return docs;
}

function generateInvoices(jobs: Job[]): Invoice[] {
  const invoices: Invoice[] = [];
  
  const paidJobs = jobs.filter(job => job.status === 'invoiced' || job.status === 'paid');
  
  paidJobs.forEach(job => {
    if (!job.labor_hours_actual || !job.completed_at) return;
    
    const laborRate = 125; // Average blended rate
    const laborSubtotal = job.labor_hours_actual * laborRate;
    const partsSubtotal = job.parts_cost * 1.4; // 40% markup
    const subtotal = laborSubtotal + partsSubtotal + job.subcontractor_cost;
    const tax = subtotal * 0.0825; // Nevada sales tax
    const total = subtotal + tax;
    
    const issuedAt = new Date(new Date(job.completed_at).getTime() + rng.nextInt(1, 7) * 24 * 60 * 60 * 1000);
    const isPaid = job.status === 'paid';
    
    let paidAt: Date | null = null;
    let daysToPay: number | null = null;
    let paymentMethod: string | null = null;
    
    if (isPaid) {
      daysToPay = rng.nextInt(5, 45);
      paidAt = new Date(issuedAt.getTime() + daysToPay * 24 * 60 * 60 * 1000);
      paymentMethod = rng.weighted([
        { item: 'check', weight: 50 },
        { item: 'ach', weight: 30 },
        { item: 'credit_card', weight: 15 },
        { item: 'cash', weight: 5 }
      ]);
    }
    
    invoices.push({
      id: generateId(),
      job_id: job.id,
      subtotal_labor: laborSubtotal,
      subtotal_parts: partsSubtotal,
      tax,
      total,
      issued_at: formatDate(issuedAt),
      paid_at: paidAt ? formatDate(paidAt) : null,
      days_to_pay: daysToPay,
      payment_method: paymentMethod as any
    });
  });
  
  return invoices;
}

function generateContracts(clients: Client[]): Contract[] {
  const contracts: Contract[] = [];
  
  // About 40% of clients have maintenance contracts
  const contractClients = clients.filter(() => rng.next() < 0.4);
  
  contractClients.forEach(client => {
    const startDate = new Date(2024, rng.nextInt(0, 11), 1);
    const endDate = new Date(startDate);
    endDate.setFullYear(endDate.getFullYear() + 1);
    
    const visitsPerYear = rng.weighted([
      { item: 2, weight: 30 }, // Semi-annual
      { item: 4, weight: 50 }, // Quarterly  
      { item: 12, weight: 20 } // Monthly
    ]);
    
    const baseValue = visitsPerYear * rng.nextInt(150, 300);
    const annualValue = baseValue + rng.nextInt(0, 1000);
    
    const renewalDate = new Date(endDate);
    renewalDate.setDate(renewalDate.getDate() - 60); // 60 days before expiry
    
    const status = endDate < new Date() ? 'expired' : 
                  renewalDate < new Date() ? 'pending_renewal' : 'active';
    
    contracts.push({
      id: generateId(),
      client_id: client.id,
      start_date: formatDate(startDate),
      end_date: formatDate(endDate),
      annual_value: annualValue,
      visits_per_year: visitsPerYear,
      equipment_list: [
        `${rng.choice(HVAC_MAKES)} ${rng.choice(SYSTEM_TYPES)} - ${rng.nextInt(2, 20)} tons`,
        `${rng.choice(HVAC_MAKES)} ${rng.choice(SYSTEM_TYPES)} - ${rng.nextInt(2, 15)} tons`
      ],
      renewal_date: formatDate(renewalDate),
      status: status as any
    });
  });
  
  return contracts;
}

function generateEquipment(clients: Client[]): Equipment[] {
  const equipment: Equipment[] = [];
  
  clients.forEach(client => {
    const numUnits = rng.nextInt(1, 4);
    
    for (let i = 0; i < numUnits; i++) {
      const installYear = 2024 - rng.nextInt(0, 20);
      const age = 2025 - installYear;
      
      // Older equipment has higher failure risk
      const baseRisk = age * 3;
      const failureRisk = Math.min(Math.max(baseRisk + rng.nextInt(-10, 20), 0), 100);
      
      const lastServiceDate = rng.next() < 0.8 ? 
        new Date(2024, rng.nextInt(6, 11), rng.nextInt(1, 28)) : null;
      
      equipment.push({
        id: generateId(),
        client_id: client.id,
        make: rng.choice(HVAC_MAKES),
        model: `Model-${rng.nextInt(1000, 9999)}`,
        install_year: installYear,
        tonnage: rng.nextInt(2, 20),
        refrigerant_type: rng.choice(REFRIGERANTS),
        last_service_date: lastServiceDate ? formatDate(lastServiceDate) : null,
        failure_risk_score: failureRisk
      });
    }
  });
  
  return equipment;
}

function generateCallbacks(jobs: Job[]): Callback[] {
  const callbacks: Callback[] = [];
  const completedJobs = jobs.filter(job => job.status === 'done' || job.status === 'invoiced' || job.status === 'paid');
  
  // About 8% callback rate
  const callbackJobs = completedJobs.filter(() => rng.next() < 0.08);
  
  callbackJobs.forEach(rootJob => {
    // Find a potential callback job within 30 days
    const rootDate = new Date(rootJob.completed_at!);
    const callbackCandidates = jobs.filter(job => 
      job.client_id === rootJob.client_id &&
      job.id !== rootJob.id &&
      job.scheduled_at &&
      new Date(job.scheduled_at) > rootDate &&
      new Date(job.scheduled_at) <= addDays(rootDate, 30)
    );
    
    if (callbackCandidates.length > 0) {
      const callbackJob = callbackCandidates[0];
      
      const reasonCategory = rng.weighted([
        { item: 'workmanship' as const, weight: 30 },
        { item: 'part_failure' as const, weight: 25 },
        { item: 'misdiagnosis' as const, weight: 25 },
        { item: 'documentation' as const, weight: 15 },
        { item: 'other' as const, weight: 5 }
      ]);
      
      const outcome = rng.weighted([
        { item: 'resolved' as const, weight: 85 },
        { item: 'repeat' as const, weight: 15 }
      ]);
      
      const actions = {
        workmanship: 'Retrained technician on proper installation procedures. Implemented QC checklist.',
        part_failure: 'Identified defective batch from supplier. Switched to alternate vendor for this part.',
        misdiagnosis: 'Additional diagnostic training scheduled. Implemented peer review process.',
        documentation: 'Updated service procedures. Mandatory photo documentation implemented.',
        other: 'Investigated root cause. Updated preventive maintenance procedures.'
      };
      
      callbacks.push({
        id: generateId(),
        root_job_id: rootJob.id,
        callback_job_id: callbackJob.id,
        reason_category: reasonCategory,
        outcome,
        corrective_action: actions[reasonCategory]
      });
      
      // Mark the original job as having a callback
      rootJob.came_back = true;
      rootJob.comeback_id = callbackJob.id;
    }
  });
  
  return callbacks;
}

function generateAttachments(jobs: Job[]): Attachment[] {
  const attachments: Attachment[] = [];
  
  jobs.forEach(job => {
    job.source_docs.forEach(filename => {
      const type = filename.includes('quote') ? 'quote' :
                  filename.includes('proposal') ? 'quote' :
                  filename.includes('field_notes') ? 'field_note' :
                  filename.includes('diagnostic') ? 'diagnostic' :
                  filename.includes('invoice') ? 'invoice' : 'photo';
      
      const summaries = {
        quote: 'Price quote for HVAC system replacement including labor, materials, and warranty terms.',
        field_note: 'Technician field notes documenting system condition, measurements, and repair procedures.',
        diagnostic: 'Diagnostic report showing system pressures, temperatures, and performance analysis.',
        invoice: 'Final invoice showing completed work, parts used, and total charges.',
        photo: 'Photo documentation of equipment condition and work performed.'
      };
      
      attachments.push({
        id: generateId(),
        job_id: job.id,
        type: type as any,
        filename,
        extracted_summary: summaries[type as keyof typeof summaries]
      });
    });
  });
  
  return attachments;
}

function generatePricebook(): PricebookItem[] {
  const parts = [
    { part: 'CONT-40A', desc: 'Contactor 40 Amp 24V', category: 'Electrical', cost: 15, supplier: 'HVAC Supply Co' },
    { part: 'CAP-45-5', desc: 'Run Capacitor 45/5 MFD', category: 'Electrical', cost: 12, supplier: 'HVAC Supply Co' },
    { part: 'CAP-START-161', desc: 'Start Capacitor 161-193 MFD', category: 'Electrical', cost: 18, supplier: 'Parts Plus' },
    { part: 'RELAY-FAN', desc: 'Fan Relay SPDT 24V', category: 'Electrical', cost: 8, supplier: 'HVAC Supply Co' },
    { part: 'TXVR-410A-3', desc: 'TXV R-410A 3 Ton', category: 'Refrigeration', cost: 85, supplier: 'RefriParts' },
    { part: 'FILTER-20X25X1', desc: 'Filter 20x25x1 MERV 11', category: 'Filters', cost: 8, supplier: 'Filter Express' },
    { part: 'FILTER-16X20X1', desc: 'Filter 16x20x1 MERV 8', category: 'Filters', cost: 6, supplier: 'Filter Express' },
    { part: 'BELT-4L360', desc: 'V-Belt 4L360', category: 'Motors', cost: 12, supplier: 'Belt & Bearing' },
    { part: 'MOTOR-1/2HP', desc: 'Condenser Fan Motor 1/2 HP', category: 'Motors', cost: 120, supplier: 'Motor World' },
    { part: 'MOTOR-1/3HP', desc: 'Blower Motor 1/3 HP Variable Speed', category: 'Motors', cost: 185, supplier: 'Motor World' },
    { part: 'COIL-EVAP-3T', desc: 'Evaporator Coil 3 Ton R-410A', category: 'Coils', cost: 280, supplier: 'Coil Co' },
    { part: 'COIL-COND-3T', desc: 'Condenser Coil 3 Ton R-410A', category: 'Coils', cost: 320, supplier: 'Coil Co' },
    { part: 'COMP-3T-410A', desc: 'Compressor 3 Ton R-410A Scroll', category: 'Compressors', cost: 850, supplier: 'Comp Supply' },
    { part: 'COMP-2T-410A', desc: 'Compressor 2 Ton R-410A Scroll', category: 'Compressors', cost: 720, supplier: 'Comp Supply' },
    { part: 'THERM-PROG', desc: 'Programmable Thermostat 7-Day', category: 'Controls', cost: 45, supplier: 'Control Tech' },
    { part: 'THERM-WIFI', desc: 'WiFi Thermostat Smart', category: 'Controls', cost: 125, supplier: 'Control Tech' }
  ];
  
  return parts.map((part, i) => ({
    id: generateId(),
    part_number: part.part,
    description: part.desc,
    category: part.category,
    cost: part.cost,
    list_price: part.cost * rng.nextInt(2, 4), // 2-4x markup
    markup_percentage: rng.nextInt(100, 300),
    supplier: part.supplier
  }));
}

// Generate all data
const clients = generateClients();
const technicians = generateTechnicians();
const jobs = generateJobs(clients, technicians);
const invoices = generateInvoices(jobs);
const contracts = generateContracts(clients);
const equipment = generateEquipment(clients);
const callbacks = generateCallbacks(jobs);
const attachments = generateAttachments(jobs);
const pricebook = generatePricebook();

// Ensure data directory exists
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Write all data files
fs.writeFileSync(path.join(dataDir, 'clients.json'), JSON.stringify(clients, null, 2));
fs.writeFileSync(path.join(dataDir, 'technicians.json'), JSON.stringify(technicians, null, 2));
fs.writeFileSync(path.join(dataDir, 'jobs.json'), JSON.stringify(jobs, null, 2));
fs.writeFileSync(path.join(dataDir, 'invoices.json'), JSON.stringify(invoices, null, 2));
fs.writeFileSync(path.join(dataDir, 'contracts.json'), JSON.stringify(contracts, null, 2));
fs.writeFileSync(path.join(dataDir, 'equipment.json'), JSON.stringify(equipment, null, 2));
fs.writeFileSync(path.join(dataDir, 'callbacks.json'), JSON.stringify(callbacks, null, 2));
fs.writeFileSync(path.join(dataDir, 'attachments.json'), JSON.stringify(attachments, null, 2));
fs.writeFileSync(path.join(dataDir, 'pricebook.json'), JSON.stringify(pricebook, null, 2));

console.log('Generated synthetic data:');
console.log(`- ${clients.length} clients`);
console.log(`- ${technicians.length} technicians`);
console.log(`- ${jobs.length} jobs`);
console.log(`- ${invoices.length} invoices`);
console.log(`- ${contracts.length} contracts`);
console.log(`- ${equipment.length} equipment records`);
console.log(`- ${callbacks.length} callbacks`);
console.log(`- ${attachments.length} attachments`);
console.log(`- ${pricebook.length} pricebook items`);