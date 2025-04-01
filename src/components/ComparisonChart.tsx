
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { formatCurrency } from "@/lib/utils";

interface ComparisonChartProps {
  totalCost: number;
  orderValue: number;
}

const ComparisonChart = ({ totalCost, orderValue }: ComparisonChartProps) => {
  const netValue = orderValue - totalCost;
  const costPercentage = (totalCost / orderValue) * 100;
  
  const data = [
    {
      name: "Monthly Revenue",
      value: orderValue,
      fill: "#7ac9a7",
    },
    {
      name: "Fulfillment Cost",
      value: totalCost,
      fill: "#e9c46a",
    },
    {
      name: "Net Value",
      value: netValue,
      fill: "#245e4f",
    },
  ];
  
  // Custom tooltip content
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-md border border-gray-100 rounded-md">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-lg">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="h-80 w-full">
      <h3 className="text-lg font-semibold text-center mb-4">
        Revenue vs. Fulfillment Cost
      </h3>
      <div className="mb-4 text-center">
        <span className="text-sm bg-primary/10 px-3 py-1 rounded-full">
          Fulfillment costs represent <strong>{costPercentage.toFixed(1)}%</strong> of revenue
        </span>
      </div>
      <ResponsiveContainer width="100%" height="75%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" tickFormatter={(value) => formatCurrency(value, false)} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={100} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" barSize={30} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ComparisonChart;
