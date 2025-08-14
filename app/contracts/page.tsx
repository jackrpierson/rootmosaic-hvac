import { DataTable, ColumnDef } from '@/components/DataTable';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { contracts, clients } from '@/lib/data';
import { Contract } from '@/types';
import { 
  formatCurrency, 
  formatDate,
  formatStatus,
  getStatusColor
} from '@/lib/format';
import { FileText, Calendar, DollarSign, AlertTriangle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function ContractsPage() {
  const enrichedContracts = contracts.map(contract => {
    const client = clients.find(c => c.id === contract.client_id);
    const daysUntilRenewal = Math.ceil(
      (new Date(contract.renewal_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    
    return {
      ...contract,
      client_name: client?.name || 'Unknown',
      client_industry: client?.industry || 'Unknown',
      days_until_renewal: daysUntilRenewal,
    };
  });

  const columns: ColumnDef<typeof enrichedContracts[0]>[] = [
    {
      key: 'client_name',
      header: 'Client',
      sortable: true,
      filterable: true,
    },
    {
      key: 'client_industry',
      header: 'Industry',
      sortable: true,
      filterable: true,
      filterType: 'select',
      filterOptions: ['Restaurant', 'Retail Store', 'Office Building', 'Warehouse', 'Medical Facility', 'Auto Shop'],
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
      filterOptions: ['active', 'expired', 'cancelled', 'pending_renewal'],
    },
    {
      key: 'annual_value',
      header: 'Annual Value',
      render: (value) => formatCurrency(value),
      sortable: true,
    },
    {
      key: 'visits_per_year',
      header: 'Visits/Year',
      sortable: true,
    },
    {
      key: 'start_date',
      header: 'Start Date',
      render: (value) => formatDate(value),
      sortable: true,
    },
    {
      key: 'end_date',
      header: 'End Date',
      render: (value) => formatDate(value),
      sortable: true,
    },
    {
      key: 'renewal_date',
      header: 'Renewal Date',
      render: (value) => formatDate(value),
      sortable: true,
    },
    {
      key: 'days_until_renewal',
      header: 'Days Until Renewal',
      render: (value) => (
        <span className={
          value < 30 ? 'text-red-600 font-semibold' :
          value < 60 ? 'text-yellow-600' : 'text-green-600'
        }>
          {value > 0 ? `${value} days` : 'Overdue'}
        </span>
      ),
      sortable: true,
    },
  ];

  const activeContracts = contracts.filter(c => c.status === 'active').length;
  const totalAnnualValue = contracts
    .filter(c => c.status === 'active')
    .reduce((sum, c) => sum + c.annual_value, 0);
  const dueForRenewal = contracts.filter(c => {
    const daysUntil = Math.ceil((new Date(c.renewal_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return c.status === 'active' && daysUntil <= 90;
  }).length;
  const avgContractValue = activeContracts > 0 ? totalAnnualValue / activeContracts : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Contract Management</h1>
        <p className="text-gray-600 mt-2">
          Track maintenance contracts and manage renewals
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Contracts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeContracts}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Annual Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalAnnualValue)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Due for Renewal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{dueForRenewal}</div>
            <p className="text-xs text-muted-foreground">Next 90 days</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Contract Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(avgContractValue)}</div>
          </CardContent>
        </Card>
      </div>

      <DataTable
        data={enrichedContracts}
        columns={columns}
        title="All Contracts"
        searchable={true}
        exportable={true}
        pageSize={15}
      />
    </div>
  );
}