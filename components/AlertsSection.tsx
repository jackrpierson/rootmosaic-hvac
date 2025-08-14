'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  TrendingUp, 
  Calendar, 
  DollarSign,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { equipment, contracts, jobs, clients } from '@/lib/data';
import { formatCurrency, formatDate } from '@/lib/format';
import Link from 'next/link';

export function AlertsSection() {
  // Equipment needing upgrades (failure risk > 70 or age > 10 years)
  const equipmentUpgrades = equipment.filter(eq => 
    eq.failure_risk_score > 70 || (2025 - eq.install_year) > 10
  ).slice(0, 3);

  // Contracts due for renewal in next 90 days
  const contractsRenewal = contracts.filter(contract => {
    const renewalDate = new Date(contract.renewal_date);
    const ninetyDaysFromNow = new Date();
    ninetyDaysFromNow.setDate(ninetyDaysFromNow.getDate() + 90);
    return contract.status === 'active' && renewalDate <= ninetyDaysFromNow;
  }).slice(0, 3);

  // High value clients without contracts (revenue > $20k, no active contract)
  const clientsWithoutContracts = clients.filter(client => {
    const clientJobs = jobs.filter(job => job.client_id === client.id);
    const clientRevenue = clientJobs.reduce((sum, job) => {
      // Simplified revenue calculation
      return sum + (job.labor_hours_actual || job.labor_hours_estimated) * 125 + job.parts_cost;
    }, 0);
    
    const hasActiveContract = contracts.some(contract => 
      contract.client_id === client.id && contract.status === 'active'
    );
    
    return clientRevenue > 20000 && !hasActiveContract;
  }).slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Business Opportunities & Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Equipment Upgrades */}
            {equipmentUpgrades.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-orange-500" />
                  Equipment Upgrade Opportunities
                </h4>
                <div className="space-y-2">
                  {equipmentUpgrades.map((eq, index) => {
                    const client = clients.find(c => c.id === eq.client_id);
                    const age = 2025 - eq.install_year;
                    
                    return (
                      <motion.div
                        key={eq.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 bg-orange-50 rounded-lg"
                      >
                        <div>
                          <p className="text-sm font-medium">{client?.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {eq.make} {eq.model} - {age} years old, Risk: {eq.failure_risk_score}%
                          </p>
                        </div>
                        <Badge variant="outline" className="text-orange-700">
                          {age > 10 ? 'Age' : 'High Risk'}
                        </Badge>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Contract Renewals */}
            {contractsRenewal.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  Contract Renewals Due
                </h4>
                <div className="space-y-2">
                  {contractsRenewal.map((contract, index) => {
                    const client = clients.find(c => c.id === contract.client_id);
                    
                    return (
                      <motion.div
                        key={contract.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
                      >
                        <div>
                          <p className="text-sm font-medium">{client?.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Renewal: {formatDate(contract.renewal_date)} - {formatCurrency(contract.annual_value)}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-blue-700">
                          Due Soon
                        </Badge>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Contract Upsells */}
            {clientsWithoutContracts.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-500" />
                  Contract Upsell Opportunities
                </h4>
                <div className="space-y-2">
                  {clientsWithoutContracts.map((client, index) => {
                    const clientJobs = jobs.filter(job => job.client_id === client.id);
                    const emergencyJobs = clientJobs.filter(job => 
                      job.notes.toLowerCase().includes('emergency') || 
                      job.notes.toLowerCase().includes('urgent')
                    ).length;
                    
                    return (
                      <motion.div
                        key={client.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
                      >
                        <div>
                          <p className="text-sm font-medium">{client.name}</p>
                          <p className="text-xs text-muted-foreground">
                            High value client - {emergencyJobs} emergency calls this year
                          </p>
                        </div>
                        <Badge variant="outline" className="text-green-700">
                          High Value
                        </Badge>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Action Button */}
            <div className="pt-4 border-t">
              <Link href="/reports">
                <Button variant="outline" className="w-full">
                  View Detailed Reports
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}