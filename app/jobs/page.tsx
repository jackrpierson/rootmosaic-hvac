import { DataTable, ColumnDef } from '@/components/DataTable';
import { Badge } from '@/components/ui/badge';
import { jobs, clients, technicians, invoices } from '@/lib/data';
import { Job } from '@/types';
import { 
  formatCurrency, 
  formatDate, 
  formatJobType, 
  formatSystemType, 
  formatStatus,
  getStatusColor,
  formatHours 
} from '@/lib/format';

export const dynamic = 'force-dynamic';

export default function JobsPage() {
  // Enrich job data with client and technician names
  const enrichedJobs = jobs.map(job => {
    const client = clients.find(c => c.id === job.client_id);
    const techs = job.technician_ids.map(id => 
      technicians.find(t => t.id === id)?.name || 'Unknown'
    );
    const invoice = invoices.find(i => i.job_id === job.id);
    
    // Calculate profitability
    let profitStatus = 'pending';
    if (job.labor_hours_actual && job.labor_hours_estimated) {
      const variance = job.labor_hours_actual - job.labor_hours_estimated;
      if (variance <= job.labor_hours_estimated * 0.1) profitStatus = 'on-track';
      else profitStatus = 'over-budget';
    }
    
    return {
      ...job,
      client_name: client?.name || 'Unknown',
      technician_names: techs.join(', '),
      invoice_total: invoice?.total || 0,
      profit_status: profitStatus,
    };
  });

  const columns: ColumnDef<typeof enrichedJobs[0]>[] = [
    {
      key: 'id',
      header: 'Job ID',
      render: (value) => (
        <span className="font-mono text-sm">{value.slice(0, 8)}</span>
      ),
    },
    {
      key: 'client_name',
      header: 'Client',
      sortable: true,
      filterable: true,
    },
    {
      key: 'job_type',
      header: 'Type',
      render: (value) => formatJobType(value),
      sortable: true,
      filterable: true,
      filterType: 'select',
      filterOptions: ['service', 'install', 'pm'],
    },
    {
      key: 'system_type',
      header: 'System',
      render: (value) => formatSystemType(value),
      sortable: true,
      filterable: true,
      filterType: 'select',
      filterOptions: ['RTU', 'split', 'mini-split', 'chiller', 'boiler', 'refrigeration'],
    },
    {
      key: 'scheduled_at',
      header: 'Scheduled',
      render: (value) => formatDate(value),
      sortable: true,
    },
    {
      key: 'status',
      header: 'Status',
      render: (value) => (
        <Badge className={getStatusColor(value)}>
          {formatStatus(value)}
        </Badge>
      ),
      sortable: true,
      filterable: true,
      filterType: 'select',
      filterOptions: ['scheduled', 'in_progress', 'done', 'invoiced', 'paid', 'canceled'],
    },
    {
      key: 'technician_names',
      header: 'Technicians',
      filterable: true,
    },
    {
      key: 'labor_hours_estimated',
      header: 'Est. Hours',
      render: (value) => formatHours(value),
      sortable: true,
    },
    {
      key: 'labor_hours_actual',
      header: 'Actual Hours',
      render: (value) => value ? formatHours(value) : '-',
      sortable: true,
    },
    {
      key: 'profit_status',
      header: 'Profit Status',
      render: (value, row) => {
        const getColor = () => {
          switch (value) {
            case 'on-track': return 'bg-green-100 text-green-800';
            case 'over-budget': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
          }
        };
        
        const getLabel = () => {
          switch (value) {
            case 'on-track': return 'On Track';
            case 'over-budget': return 'Over Budget';
            default: return 'Pending';
          }
        };
        
        return (
          <Badge className={getColor()}>
            {getLabel()}
          </Badge>
        );
      },
      sortable: true,
      filterable: true,
      filterType: 'select',
      filterOptions: ['pending', 'on-track', 'over-budget'],
    },
    {
      key: 'parts_cost',
      header: 'Parts Cost',
      render: (value) => formatCurrency(value),
      sortable: true,
    },
    {
      key: 'invoice_total',
      header: 'Invoice Total',
      render: (value) => value > 0 ? formatCurrency(value) : '-',
      sortable: true,
    },
    {
      key: 'came_back',
      header: 'Callback',
      render: (value) => (
        <Badge className={value ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
          {value ? 'Yes' : 'No'}
        </Badge>
      ),
      sortable: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Job Management</h1>
        <p className="text-gray-600 mt-2">
          Track job costs, profitability, and performance metrics
        </p>
      </div>

      <DataTable
        data={enrichedJobs}
        columns={columns}
        title="All Jobs"
        searchable={true}
        exportable={true}
        pageSize={15}
      />
    </div>
  );
}