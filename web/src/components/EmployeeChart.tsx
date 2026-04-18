'use client';

import { useSalesAnalytics } from '@/hooks/useAnalytics';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function EmployeeChart() {
  const { data: analytics } = useSalesAnalytics();

  if (!analytics) return null;

  const chartData = analytics.map(a => ({
    name: a.employeeEmail.split('@')[0],
    Units: a.totalUnits,
    Orders: a.totalOrders,
  }));

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-4">Employee Performance (Units Sold)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="Units" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
