import { DataTable, ColumnDef } from '@/components/DataTable';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { clients, equipment, contracts } from '@/lib/data';
import { calculateClientMetrics } from '@/lib/metrics';
import { Client } from '@/types';
import { 
  formatCurrency, 
  formatPercentage, 
  formatPhoneNumber,
  formatStatus
} from '@/lib/format';
import { Star, TrendingUp, AlertCircle, Users } from 'lucide-react';

export default function ClientsPage() {
  // Calculate metrics for all clients
  const clientMetrics = clients.map(client => {
    const metrics = calculateClientMetrics(client.id);
    const clientEquipment = equipment.filter(eq => eq.client_id === client.id);
    const clientContracts = contracts.filter(c => c.client_id === client.id && c.status === 'active');
    
    // Identify upsell opportunities
    const oldEquipment = clientEquipment.filter(eq => (2025 - eq.install_year) > 10).length;
    const highRiskEquipment = clientEquipment.filter(eq => eq.failure_risk_score > 70).length;
    const hasContract = clientContracts.length > 0;
    
    const upsellScore = (oldEquipment * 2) + (highRiskEquipment * 3) + (hasContract ? 0 : 5);
    
    return {
      ...client,
      ...metrics,
      equipment_count: clientEquipment.length,
      old_equipment: oldEquipment,
      high_risk_equipment: highRiskEquipment,
      has_contract: hasContract,
      upsell_score: upsellScore,
    };
  });

  // Sort by value score
  const sortedClients = [...clientMetrics].sort((a, b) => b.value_score - a.value_score);

  const columns: ColumnDef<typeof clientMetrics[0]>[] = [
    {
      key: 'name',
      header: 'Client Name',
      sortable: true,
      filterable: true,
    },
    {
      key: 'industry',
      header: 'Industry',
      sortable: true,
      filterable: true,
      filterType: 'select',
      filterOptions: ['Restaurant', 'Retail Store', 'Office Building', 'Warehouse', 'Medical Facility', 'Auto Shop', 'Hotel', 'Grocery Store', 'Manufacturing', 'Gym/Fitness', 'School/Daycare', 'Church'],
    },
    {
      key: 'service_level',
      header: 'Service Level',
      render: (value) => (
        <Badge className={
          value === 'premium' ? 'bg-purple-100 text-purple-800' :
          value === 'priority' ? 'bg-blue-100 text-blue-800' :
          'bg-gray-100 text-gray-800'
        }>
          {formatStatus(value)}
        </Badge>
      ),
      sortable: true,
      filterable: true,
      filterType: 'select',
      filterOptions: ['standard', 'priority', 'premium'],
    },
    {
      key: 'value_score',
      header: 'Value Score',
      render: (value) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{value.toFixed(0)}</span>
          {value > 80 && <Star className="h-4 w-4 text-yellow-500" />}
        </div>
      ),
      sortable: true,
    },
    {
      key: 'trailing_6mo_revenue',
      header: '6-Month Revenue',
      render: (value) => formatCurrency(value),
      sortable: true,
    },
    {
      key: 'margin_percentage',
      header: 'Margin %',
      render: (value) => (
        <span className={value > 25 ? 'text-green-600' : value < 10 ? 'text-red-600' : 'text-yellow-600'}>
          {formatPercentage(value)}
        </span>
      ),
      sortable: true,
    },
    {
      key: 'avg_days_to_pay',
      header: 'Avg Days to Pay',
      render: (value) => (
        <span className={value <= 30 ? 'text-green-600' : value > 45 ? 'text-red-600' : 'text-yellow-600'}>
          {value.toFixed(0)} days
        </span>
      ),
      sortable: true,
    },
    {
      key: 'callback_load',
      header: 'Callback Rate',
      render: (value) => (
        <span className={value < 5 ? 'text-green-600' : value > 15 ? 'text-red-600' : 'text-yellow-600'}>
          {formatPercentage(value)}
        </span>
      ),
      sortable: true,
    },
    {
      key: 'has_contract',
      header: 'Contract',
      render: (value) => (
        <Badge className={value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
          {value ? 'Yes' : 'No'}
        </Badge>
      ),
      sortable: true,
    },
    {
      key: 'upsell_score',
      header: 'Upsell Priority',
      render: (value) => (
        <Badge className={
          value > 8 ? 'bg-red-100 text-red-800' :
          value > 5 ? 'bg-yellow-100 text-yellow-800' :
          value > 2 ? 'bg-blue-100 text-blue-800' :
          'bg-green-100 text-green-800'
        }>
          {value > 8 ? 'High' : value > 5 ? 'Medium' : value > 2 ? 'Low' : 'None'}
        </Badge>
      ),
      sortable: true,
    },
    {
      key: 'contact_phone',
      header: 'Contact',
      render: (value, row) => (
        <div>
          <p className="text-sm font-medium">{row.contact_name}</p>
          <p className="text-xs text-muted-foreground">{formatPhoneNumber(value)}</p>
        </div>
      ),
    },
  ];

  // Calculate summary stats
  const topClients = sortedClients.slice(0, 10);
  const highValueClients = clientMetrics.filter(c => c.value_score > 80).length;
  const contractClients = clientMetrics.filter(c => c.has_contract).length;
  const upsellOpportunities = clientMetrics.filter(c => c.upsell_score > 5).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Client Management</h1>
        <p className="text-gray-600 mt-2">
          Analyze client value, identify upsell opportunities, and track relationships
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Clients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clients.length}</div>
            <p className="text-xs text-muted-foreground">Active clients</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              High Value Clients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highValueClients}</div>
            <p className="text-xs text-muted-foreground">Value score &gt; 80</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Contract Clients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contractClients}</div>
            <p className="text-xs text-muted-foreground">With active contracts</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Upsell Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upsellOpportunities}</div>
            <p className="text-xs text-muted-foreground">High priority clients</p>
          </CardContent>
        </Card>
      </div>

      {/* Top Clients & Upsell Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Top Value Clients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topClients.slice(0, 5).map((client, index) => (
                <div key={client.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{client.name}</p>
                    <p className="text-sm text-muted-foreground">{client.industry}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{client.value_score.toFixed(0)}</p>
                    <p className="text-xs text-muted-foreground">{formatCurrency(client.trailing_6mo_revenue)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              Upsell Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {clientMetrics
                .filter(c => c.upsell_score > 5)
                .sort((a, b) => b.upsell_score - a.upsell_score)
                .slice(0, 5)
                .map((client) => {
                  const reasons = [];
                  if (client.old_equipment > 0) reasons.push(`${client.old_equipment} old units`);
                  if (client.high_risk_equipment > 0) reasons.push(`${client.high_risk_equipment} high-risk units`);
                  if (!client.has_contract) reasons.push('No maintenance contract');
                  
                  return (
                    <div key={client.id} className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium">{client.name}</p>
                        <Badge variant="outline" className="text-blue-700">
                          Score: {client.upsell_score}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        {reasons.map((reason, i) => (
                          <p key={i} className="text-xs text-blue-700">• {reason}</p>
                        ))}
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Client Table */}
      <DataTable
        data={clientMetrics}
        columns={columns}
        title="Client Performance Analysis"
        searchable={true}
        exportable={true}
        pageSize={15}
      />
    </div>
  );
}