'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatPercentage, formatNumber } from '@/lib/format';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

interface KPICardProps {
  title: string;
  value: number;
  format: 'currency' | 'percentage' | 'number';
  change?: number;
  changeFormat?: 'currency' | 'percentage' | 'number';
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

export function KPICard({
  title,
  value,
  format,
  change,
  changeFormat = 'percentage',
  subtitle,
  trend,
  className = '',
}: KPICardProps) {
  const formatValue = (val: number, fmt: string) => {
    switch (fmt) {
      case 'currency':
        return formatCurrency(val);
      case 'percentage':
        return formatPercentage(val);
      case 'number':
        return formatNumber(val);
      default:
        return val.toString();
    }
  };

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-gray-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`hover:shadow-lg transition-shadow ${className}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          {change !== undefined && getTrendIcon()}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatValue(value, format)}
          </div>
          {(change !== undefined || subtitle) && (
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              {change !== undefined && (
                <span className={getTrendColor()}>
                  {changeFormat === 'percentage' && change > 0 ? '+' : ''}
                  {formatValue(Math.abs(change), changeFormat)}
                  {changeFormat === 'percentage' && ' from last period'}
                </span>
              )}
              {subtitle && !change && (
                <span>{subtitle}</span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}