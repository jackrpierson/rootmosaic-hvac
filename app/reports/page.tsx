import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, BarChart3, FileText, Users, Building2 } from 'lucide-react';

export default function ReportsPage() {
  const generateReport = (reportType: string) => {
    // This would generate and download CSV reports
    console.log(`Generating ${reportType} report...`);
    alert(`${reportType} report generation would be implemented here`);
  };

  const reports = [
    {
      title: 'Job Profitability Analysis',
      description: 'Detailed breakdown of job costs, margins, and profitability by month, technician, and job type',
      icon: BarChart3,
      type: 'job-profitability',
    },
    {
      title: 'Callback Root Cause Report',
      description: 'Analysis of callback patterns, causes, and corrective actions taken',
      icon: FileText,
      type: 'callback-analysis',
    },
    {
      title: 'Technician Performance KPIs',
      description: 'Individual technician metrics including efficiency, FTF rates, and coaching recommendations',
      icon: Users,
      type: 'technician-kpis',
    },
    {
      title: 'Client Accounts Receivable',
      description: 'AR aging report with payment patterns and collection priorities',
      icon: Building2,
      type: 'ar-summary',
    },
    {
      title: 'Contract Pipeline Report',
      description: 'Contract renewals, revenue projections, and upsell opportunities',
      icon: FileText,
      type: 'contract-pipeline',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-600 mt-2">
          Generate detailed reports for business analysis and compliance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report) => (
          <Card key={report.type} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <report.icon className="h-6 w-6 text-blue-600" />
                {report.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {report.description}
              </p>
              <Button 
                onClick={() => generateReport(report.title)}
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                Download CSV
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <p className="text-muted-foreground">
              All reports are generated with current data and include the last 6 months of activity. 
              CSV files can be opened in Excel or Google Sheets for further analysis.
            </p>
            <ul className="text-sm text-muted-foreground mt-4 space-y-1">
              <li>• Reports include all relevant metrics and calculated fields</li>
              <li>• Data is filtered to show only active clients and completed jobs</li>
              <li>• All financial figures are calculated using current cost and pricing data</li>
              <li>• Technician performance metrics are based on rolling 90-day periods</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}