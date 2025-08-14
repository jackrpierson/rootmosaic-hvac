import { DataTable, ColumnDef } from '@/components/DataTable';

export const dynamic = 'force-dynamic';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { technicians } from '@/lib/data';
import { calculateTechnicianMetrics } from '@/lib/metrics';
import { Technician } from '@/types';
import { 
  formatCurrency, 
  formatPercentage, 
  formatDate,
  formatStatus
} from '@/lib/format';
import { Trophy, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

export default function TechniciansPage() {
  // Calculate metrics for all technicians
  const techMetrics = technicians.map(tech => {
    const metrics = calculateTechnicianMetrics(tech.id);
    return {
      ...tech,
      ...metrics,
    };
  });

  // Sort by efficiency index for leaderboard
  const sortedTechs = [...techMetrics].sort((a, b) => b.efficiency_index - a.efficiency_index);

  const columns: ColumnDef<typeof techMetrics[0]>[] = [
    {
      key: 'name',
      header: 'Technician',
      sortable: true,
      filterable: true,
    },
    {
      key: 'role',
      header: 'Role',
      render: (value) => (
        <Badge className={
          value === 'lead' ? 'bg-purple-100 text-purple-800' :
          value === 'specialist' ? 'bg-blue-100 text-blue-800' :
          value === 'senior' ? 'bg-green-100 text-green-800' :
          'bg-gray-100 text-gray-800'
        }>
          {formatStatus(value)}
        </Badge>
      ),
      sortable: true,
      filterable: true,
      filterType: 'select',
      filterOptions: ['junior', 'senior', 'lead', 'specialist'],
    },
    {
      key: 'hire_date',
      header: 'Hire Date',
      render: (value) => formatDate(value),
      sortable: true,
    },
    {
      key: 'efficiency_index',
      header: 'Efficiency Score',
      render: (value) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{value.toFixed(1)}</span>
          {value > 90 && <Trophy className="h-4 w-4 text-yellow-500" />}
        </div>
      ),
      sortable: true,
    },
    {
      key: 'first_time_fix_rate',
      header: 'First Time Fix',
      render: (value) => formatPercentage(value),
      sortable: true,
    },
    {
      key: 'callback_rate',
      header: 'Callback Rate',
      render: (value) => (
        <span className={value < 5 ? 'text-green-600' : value > 15 ? 'text-red-600' : 'text-yellow-600'}>
          {formatPercentage(value)}
        </span>
      ),
      sortable: true,
    },
    {
      key: 'avg_margin_contribution',
      header: 'Avg Margin',
      render: (value) => formatCurrency(value),
      sortable: true,
    },
    {
      key: 'labor_variance_percentage',
      header: 'Labor Variance',
      render: (value) => (
        <span className={Math.abs(value) < 10 ? 'text-green-600' : Math.abs(value) > 20 ? 'text-red-600' : 'text-yellow-600'}>
          {value > 0 ? '+' : ''}{value.toFixed(1)}%
        </span>
      ),
      sortable: true,
    },
    {
      key: 'total_jobs',
      header: 'Jobs (90d)',
      sortable: true,
    },
    {
      key: 'hourly_cost',
      header: 'Hourly Cost',
      render: (value) => formatCurrency(value),
      sortable: true,
    },
  ];

  // Calculate summary stats
  const avgEfficiency = techMetrics.reduce((sum, tech) => sum + tech.efficiency_index, 0) / techMetrics.length;
  const avgFTF = techMetrics.reduce((sum, tech) => sum + tech.first_time_fix_rate, 0) / techMetrics.length;
  const avgCallback = techMetrics.reduce((sum, tech) => sum + tech.callback_rate, 0) / techMetrics.length;
  
  // Identify coaching opportunities
  const needsCoaching = techMetrics.filter(tech => 
    tech.first_time_fix_rate < 80 || tech.callback_rate > 15 || Math.abs(tech.labor_variance_percentage) > 25
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Technician Performance</h1>
        <p className="text-gray-600 mt-2">
          Track individual performance metrics and identify coaching opportunities
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Efficiency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgEfficiency.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Team average</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg First Time Fix
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgFTF.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Team average</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Callback Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgCallback.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Team average</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Need Coaching
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{needsCoaching.length}</div>
            <p className="text-xs text-muted-foreground">Technicians</p>
          </CardContent>
        </Card>
      </div>

      {/* Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Performance Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sortedTechs.slice(0, 5).map((tech, index) => (
                <div key={tech.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? 'bg-yellow-400 text-yellow-900' :
                      index === 1 ? 'bg-gray-300 text-gray-700' :
                      index === 2 ? 'bg-orange-400 text-orange-900' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{tech.name}</p>
                      <p className="text-sm text-muted-foreground">{formatStatus(tech.role)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{tech.efficiency_index.toFixed(1)}</p>
                    <p className="text-xs text-muted-foreground">Efficiency</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Coaching Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {needsCoaching.length === 0 ? (
                <div className="flex items-center justify-center py-8 text-muted-foreground">
                  <CheckCircle className="h-8 w-8 mr-2 text-green-500" />
                  All technicians performing well!
                </div>
              ) : (
                needsCoaching.map((tech) => {
                  const issues = [];
                  if (tech.first_time_fix_rate < 80) issues.push('Low FTF rate');
                  if (tech.callback_rate > 15) issues.push('High callbacks');
                  if (Math.abs(tech.labor_variance_percentage) > 25) issues.push('Time estimation');
                  
                  return (
                    <div key={tech.id} className="p-3 bg-amber-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium">{tech.name}</p>
                        <Badge variant="outline" className="text-amber-700">
                          {formatStatus(tech.role)}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        {issues.map((issue, i) => (
                          <p key={i} className="text-xs text-amber-700">• {issue}</p>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Performance Table */}
      <DataTable
        data={techMetrics}
        columns={columns}
        title="Detailed Performance Metrics"
        searchable={true}
        exportable={true}
        pageSize={15}
      />
    </div>
  );
}