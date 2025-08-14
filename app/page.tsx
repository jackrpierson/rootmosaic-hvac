import { calculateKPIMetrics, getRevenueByMonth, getTopClientsByRevenue, getCallbackTrends } from '@/lib/metrics';
import { KPICard } from '@/components/KPICard';
import { RevenueChart } from '@/components/RevenueChart';
import { CallbackChart } from '@/components/CallbackChart';
import { TopClientsChart } from '@/components/TopClientsChart';
import { AlertsSection } from '@/components/AlertsSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default function Dashboard() {
  const kpis = calculateKPIMetrics();
  const revenueData = getRevenueByMonth();
  const topClients = getTopClientsByRevenue(5);
  const callbackTrends = getCallbackTrends();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">HVAC Control Center</h1>
        <p className="text-gray-600 mt-2">
          Comprehensive business intelligence for your HVAC contracting business
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Revenue MTD"
          value={kpis.revenue_mtd}
          format="currency"
          trend="up"
        />
        <KPICard
          title="Gross Margin"
          value={kpis.gross_margin_percentage}
          format="percentage"
          trend={kpis.gross_margin_percentage > 25 ? 'up' : 'down'}
        />
        <KPICard
          title="First Time Fix"
          value={kpis.first_time_fix_rate}
          format="percentage"
          trend={kpis.first_time_fix_rate > 85 ? 'up' : 'down'}
        />
        <KPICard
          title="Callback Rate"
          value={kpis.callback_rate}
          format="percentage"
          trend={kpis.callback_rate < 10 ? 'up' : 'down'}
        />
      </div>

      {/* Additional KPIs Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Revenue YTD"
          value={kpis.revenue_ytd}
          format="currency"
        />
        <KPICard
          title="Jobs Over Budget"
          value={kpis.jobs_over_budget}
          format="number"
          trend={kpis.jobs_over_budget < 5 ? 'up' : 'down'}
        />
        <KPICard
          title="AR 90+ Days"
          value={kpis.ar_aging.days_90_plus}
          format="currency"
          trend={kpis.ar_aging.days_90_plus < 10000 ? 'up' : 'down'}
        />
        <KPICard
          title="Contracts Due"
          value={kpis.contracts_due_renewal}
          format="number"
          subtitle="Next 90 days"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={revenueData} />
        <CallbackChart data={callbackTrends} />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopClientsChart data={topClients} />
        <AlertsSection />
      </div>
    </div>
  );
}