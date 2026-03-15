import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const SystemUsageChart = ({ data }) => {
  return (
    <Card className="col-span-1 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">System Usage Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        {data && data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend />
              <Line type="monotone" dataKey="aiQueries" stroke="#3b82f6" strokeWidth={2} name="AI Queries" dot={false} />
              <Line type="monotone" dataKey="uploads" stroke="#10b981" strokeWidth={2} name="Notes Uploads" dot={false} />
              <Line type="monotone" dataKey="activeSessions" stroke="#f59e0b" strokeWidth={2} name="Active Sessions" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            No data available
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SystemUsageChart;
