'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { formatCurrency } from '@/lib/format';
import { motion } from 'framer-motion';

interface RevenueChartProps {
  data: Array<{
    month: string;
    revenue: number;
    margin: number;
  }>;
}

export function RevenueChart({ data }: RevenueChartProps) {
  const formatTooltip = (value: number, name: string) => {
    return [formatCurrency(value), name === 'revenue' ? 'Revenue' : 'Gross Margin'];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Revenue vs Margin by Month</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => formatCurrency(value)} />
              <Tooltip formatter={formatTooltip} />
              <Legend />
              <Bar 
                dataKey="revenue" 
                fill="#3b82f6" 
                name="Revenue"
                radius={[2, 2, 0, 0]}
              />
              <Bar 
                dataKey="margin" 
                fill="#10b981" 
                name="Gross Margin"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}