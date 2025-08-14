import { DataTable, ColumnDef } from '@/components/DataTable';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { callbacks, jobs, clients, technicians } from '@/lib/data';
import { Callback } from '@/types';
import { 
  formatDate, 
  formatStatus,
  formatJobType,
  formatSystemType
} from '@/lib/format';
import { getCallbackTrends } from '@/lib/metrics';
import { CallbackChart } from '@/components/CallbackChart';

export default function CallbacksPage() {
  const callbackTrends = getCallbackTrends();
  
  // Enrich callback data with job and client information
  const enrichedCallbacks = callbacks.map(callback => {
    const rootJob = jobs.find(j => j.id === callback.root_job_id);
    const callbackJob = jobs.find(j => j.id === callback.callback_job_id);
    const client = rootJob ? clients.find(c => c.id === rootJob.client_id) : null;
    const techNames = rootJob ? rootJob.technician_ids.map(id => 
      technicians.find(t => t.id === id)?.name || 'Unknown'
    ).join(', ') : 'Unknown';
    
    return {
      ...callback,
      client_name: client?.name || 'Unknown',
      system_type: rootJob?.system_type || 'Unknown',
      job_type: rootJob?.job_type || 'Unknown',
      root_job_date: rootJob?.completed_at || '',
      callback_job_date: callbackJob?.scheduled_at || '',
      technician_names: techNames,
    };
  });

  const columns: ColumnDef<typeof enrichedCallbacks[0]>[] = [
    {
      key: 'client_name',
      header: 'Client',
      sortable: true,
      filterable: true,
    },
    {
      key: 'system_type',
      header: 'System Type',
      render: (value) => formatSystemType(value),
      sortable: true,
      filterable: true,
      filterType: 'select',
      filterOptions: ['RTU', 'split', 'mini-split', 'chiller', 'boiler', 'refrigeration'],
    },
    {
      key: 'job_type',
      header: 'Job Type',
      render: (value) => formatJobType(value),
      sortable: true,
      filterable: true,
      filterType: 'select',
      filterOptions: ['service', 'install', 'pm'],
    },
    {
      key: 'root_job_date',
      header: 'Original Job',
      render: (value) => value ? formatDate(value) : '-',
      sortable: true,
    },
    {
      key: 'callback_job_date',
      header: 'Callback Date',
      render: (value) => value ? formatDate(value) : '-',
      sortable: true,
    },
    {
      key: 'reason_category',
      header: 'Root Cause',
      render: (value) => {
        const getColor = () => {
          switch (value) {
            case 'workmanship': return 'bg-red-100 text-red-800';
            case 'part_failure': return 'bg-orange-100 text-orange-800';
            case 'misdiagnosis': return 'bg-yellow-100 text-yellow-800';
            case 'documentation': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
          }
        };
        
        return (
          <Badge className={getColor()}>
            {formatStatus(value)}
          </Badge>
        );
      },
      sortable: true,
      filterable: true,
      filterType: 'select',
      filterOptions: ['workmanship', 'part_failure', 'misdiagnosis', 'documentation', 'other'],
    },
    {
      key: 'outcome',
      header: 'Outcome',
      render: (value) => (
        <Badge className={value === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
          {formatStatus(value)}
        </Badge>
      ),
      sortable: true,
      filterable: true,
      filterType: 'select',
      filterOptions: ['resolved', 'repeat'],
    },
    {
      key: 'technician_names',
      header: 'Original Technicians',
      filterable: true,
    },
    {
      key: 'corrective_action',
      header: 'Corrective Action',
      render: (value) => (
        <div className="max-w-xs">
          <p className="text-sm text-muted-foreground truncate" title={value}>
            {value}
          </p>
        </div>
      ),
    },
  ];

  // Calculate summary statistics
  const totalCallbacks = callbacks.length;
  const resolvedCallbacks = callbacks.filter(c => c.outcome === 'resolved').length;
  const resolutionRate = totalCallbacks > 0 ? (resolvedCallbacks / totalCallbacks) * 100 : 0;
  
  const categoryStats = callbackTrends.map(trend => ({
    category: trend.category,
    count: trend.count,
    percentage: trend.percentage,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Callback Analysis</h1>
        <p className="text-gray-600 mt-2">
          Track and analyze callback patterns to improve service quality
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Callbacks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCallbacks}</div>
            <p className="text-xs text-muted-foreground">Last 90 days</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Resolution Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resolutionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Successfully resolved</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Most Common Cause
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {categoryStats.length > 0 ? categoryStats[0].category : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              {categoryStats.length > 0 ? `${categoryStats[0].percentage.toFixed(1)}% of callbacks` : 'No data'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CallbackChart data={callbackTrends} />
        
        <Card>
          <CardHeader>
            <CardTitle>Prevention Strategies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-red-50 rounded-lg">
                <h4 className="font-medium text-red-900 mb-2">Workmanship Issues</h4>
                <p className="text-sm text-red-700">
                  Implement QC checklists, peer reviews, and additional training on installation procedures.
                </p>
              </div>
              
              <div className="p-4 bg-orange-50 rounded-lg">
                <h4 className="font-medium text-orange-900 mb-2">Part Failures</h4>
                <p className="text-sm text-orange-700">
                  Review supplier quality, carry backup parts, and consider warranty extensions.
                </p>
              </div>
              
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-2">Misdiagnosis</h4>
                <p className="text-sm text-yellow-700">
                  Enhanced diagnostic training, better tools, and senior tech reviews for complex issues.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Callback Table */}
      <DataTable
        data={enrichedCallbacks}
        columns={columns}
        title="Callback Details"
        searchable={true}
        exportable={true}
        pageSize={15}
      />
    </div>
  );
}