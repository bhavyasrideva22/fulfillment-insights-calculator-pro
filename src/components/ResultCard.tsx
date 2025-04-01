
import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";

interface ResultCardProps {
  title: string;
  value: string;
  description: string;
  icon: ReactNode;
}

const ResultCard = ({ title, value, description, icon }: ResultCardProps) => {
  return (
    <Card className="overflow-hidden border-none shadow-md">
      <div className="h-1 bg-primary" />
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="bg-primary/10 p-3 rounded-full">{icon}</div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            <div className="text-2xl font-bold mt-1">{value}</div>
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultCard;
