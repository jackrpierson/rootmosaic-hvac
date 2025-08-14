'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/format';
import { Client } from '@/types';
import { motion } from 'framer-motion';
import { Building2, TrendingUp } from 'lucide-react';

interface TopClientsChartProps {
  data: Array<{
    client: Client;
    revenue: number;
    margin: number;
  }>;
}

export function TopClientsChart({ data }: TopClientsChartProps) {
  const maxRevenue = Math.max(...data.map(item => item.revenue));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Top Clients by Revenue (6 Months)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.map((item, index) => {
              const widthPercentage = (item.revenue / maxRevenue) * 100;
              const marginPercentage = item.revenue > 0 ? (item.margin / item.revenue) * 100 : 0;
              
              return (
                <motion.div
                  key={item.client.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-sm">
                        {item.client.name}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {item.client.industry}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">
                        {formatCurrency(item.revenue)}
                      </span>
                      <span className="text-muted-foreground">
                        ({marginPercentage.toFixed(1)}% margin)
                      </span>
                    </div>
                  </div>
                  
                  <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${widthPercentage}%` }}
                      transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
          
          {data.length === 0 && (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              No client revenue data available
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}