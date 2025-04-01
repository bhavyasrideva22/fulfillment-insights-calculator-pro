
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { formatCurrency } from "@/lib/utils";

interface CostBreakdownChartProps {
  data: {
    receiving: number;
    storage: number;
    picking: number;
    packing: number;
    shipping: number;
    returns: number;
  };
}

const CostBreakdownChart = ({ data }: CostBreakdownChartProps) => {
  const chartData = [
    { name: "Receiving", value: data.receiving },
    { name: "Storage", value: data.storage },
    { name: "Picking", value: data.picking },
    { name: "Packing", value: data.packing },
    { name: "Shipping", value: data.shipping },
    { name: "Returns", value: data.returns },
  ];
  
  const COLORS = ["#245e4f", "#7ac9a7", "#e9c46a", "#4a8fe7", "#f77f00", "#d62828"];
  
  // Custom tooltip content
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-md border border-gray-100 rounded-md">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-lg">{formatCurrency(payload[0].value)}</p>
          <p className="text-sm text-gray-500">
            {Math.round((payload[0].value / getTotalCost()) * 100)}% of total
          </p>
        </div>
      );
    }
    return null;
  };
  
  const getTotalCost = () => {
    return Object.values(data).reduce((sum, value) => sum + value, 0);
  };
  
  return (
    <div className="h-80 w-full">
      <h3 className="text-lg font-semibold text-center mb-4">
        Fulfillment Cost Breakdown
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={90}
            innerRadius={40}
            fill="#8884d8"
            dataKey="value"
            paddingAngle={3}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            layout="vertical"
            verticalAlign="middle"
            align="right"
            iconType="circle"
            formatter={(value) => <span className="text-sm">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CostBreakdownChart;
