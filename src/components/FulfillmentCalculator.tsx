
import { useState } from "react";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Mail, Download, Calculator, TrendingUp, Box, PackageCheck, Truck } from "lucide-react";
import CostBreakdownChart from "./CostBreakdownChart";
import ComparisonChart from "./ComparisonChart";
import ResultCard from "./ResultCard";
import { formatCurrency } from "@/lib/utils";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const FulfillmentCalculator = () => {
  const { toast } = useToast();
  
  // Input values
  const [storageVolume, setStorageVolume] = useState<number>(100);
  const [monthlyOrders, setMonthlyOrders] = useState<number>(500);
  const [avgOrderValue, setAvgOrderValue] = useState<number>(1000);
  const [avgProductsPerOrder, setAvgProductsPerOrder] = useState<number>(2);
  const [avgProductWeight, setAvgProductWeight] = useState<number>(0.5);
  const [returnRate, setReturnRate] = useState<number>(5);
  
  // Calculated values
  const [results, setResults] = useState<null | {
    fulfillmentCostPerOrder: number;
    monthlyCost: number;
    annualCost: number;
    costBreakdown: {
      receiving: number;
      storage: number;
      picking: number;
      packing: number;
      shipping: number;
      returns: number;
    }
  }>(null);
  
  const [activeTab, setActiveTab] = useState<string>("calculator");
  
  const calculateCosts = () => {
    // Base costs in INR
    const receivingCost = 5; // per item
    const storageCostPerCubicMeter = 500; // per cubic meter per month
    const pickingCostPerItem = 10;
    const packingCostPerOrder = 15;
    const baseShippingCost = 70; // base cost
    const shippingCostPerKg = 20; // per kg
    const returnProcessingPerItem = 25;
    
    // Calculate individual cost components
    const receiving = receivingCost * avgProductsPerOrder * monthlyOrders;
    const storage = storageCostPerCubicMeter * storageVolume;
    const picking = pickingCostPerItem * avgProductsPerOrder * monthlyOrders;
    const packing = packingCostPerOrder * monthlyOrders;
    const shipping = (baseShippingCost + (shippingCostPerKg * avgProductWeight * avgProductsPerOrder)) * monthlyOrders;
    const returns = returnProcessingPerItem * avgProductsPerOrder * monthlyOrders * (returnRate / 100);
    
    // Calculate total costs
    const totalMonthlyCost = receiving + storage + picking + packing + shipping + returns;
    const costPerOrder = totalMonthlyCost / monthlyOrders;
    
    setResults({
      fulfillmentCostPerOrder: costPerOrder,
      monthlyCost: totalMonthlyCost,
      annualCost: totalMonthlyCost * 12,
      costBreakdown: {
        receiving,
        storage,
        picking,
        packing,
        shipping,
        returns
      }
    });
    
    toast({
      title: "Calculation Complete",
      description: "Your fulfillment costs have been calculated successfully.",
      duration: 3000,
    });
    
    // Switch to results tab
    setActiveTab("results");
  };
  
  const sendResultsByEmail = () => {
    // In a real implementation, this would send an API request to a backend
    // service that would generate the PDF and send it via email
    toast({
      title: "Email Feature",
      description: "This feature would send the results to your email. This is a demo implementation.",
      duration: 5000,
    });
  };
  
  const downloadPDF = async () => {
    if (!results) return;
    
    toast({
      title: "Preparing Download",
      description: "Generating your PDF report...",
      duration: 5000,
    });
    
    const resultsElement = document.getElementById("results-container");
    if (!resultsElement) return;
    
    try {
      const canvas = await html2canvas(resultsElement, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Add header
      pdf.setFillColor(36, 94, 79); // Primary color
      pdf.rect(0, 0, 210, 30, "F");
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.text("Fulfillment Cost Analysis", 105, 20, { align: "center" });
      
      // Add date
      pdf.setFontSize(10);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 28, { align: "center" });
      
      // Add the results image
      pdf.addImage(imgData, "PNG", 0, 40, imgWidth, imgHeight);
      
      // Add footer
      pdf.setFillColor(36, 94, 79); // Primary color
      pdf.rect(0, 287 - 20, 210, 20, "F");
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(10);
      pdf.text("Fulfillment Insights Calculator Pro", 105, 287 - 10, { align: "center" });
      pdf.text("© 2023 All Rights Reserved", 105, 287 - 5, { align: "center" });
      
      pdf.save("fulfillment-cost-analysis.pdf");
      
      toast({
        title: "Download Complete",
        description: "Your PDF report has been downloaded successfully.",
        duration: 3000,
      });
    } catch (error) {
      console.error("PDF generation error:", error);
      toast({
        title: "Download Error",
        description: "There was a problem generating your PDF. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="calculator" className="text-lg py-3">
            <Calculator className="mr-2 h-5 w-5" />
            Calculator
          </TabsTrigger>
          <TabsTrigger value="results" disabled={!results} className="text-lg py-3">
            <TrendingUp className="mr-2 h-5 w-5" />
            Results
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="calculator">
          <Card className="border-none shadow-lg">
            <CardHeader className="bg-primary text-white rounded-t-lg">
              <Badge variant="outline" className="w-fit mb-2 bg-white/20 text-white border-white/40">
                E-commerce Logistics
              </Badge>
              <CardTitle className="text-3xl">Fulfillment Cost per Order Calculator</CardTitle>
              <CardDescription className="text-white/90 text-lg">
                Optimize your e-commerce fulfillment costs with our advanced calculator
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="storage-volume" className="calculator-label">
                      Storage Volume (cubic meters)
                    </Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        id="storage-volume"
                        min={1}
                        max={1000}
                        step={1}
                        value={[storageVolume]}
                        onValueChange={(value) => setStorageVolume(value[0])}
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        value={storageVolume}
                        onChange={(e) => setStorageVolume(Number(e.target.value))}
                        className="w-24 calculator-input"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="monthly-orders" className="calculator-label">
                      Monthly Orders
                    </Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        id="monthly-orders"
                        min={10}
                        max={10000}
                        step={10}
                        value={[monthlyOrders]}
                        onValueChange={(value) => setMonthlyOrders(value[0])}
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        value={monthlyOrders}
                        onChange={(e) => setMonthlyOrders(Number(e.target.value))}
                        className="w-24 calculator-input"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="avg-order-value" className="calculator-label">
                      Average Order Value (₹)
                    </Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        id="avg-order-value"
                        min={100}
                        max={10000}
                        step={100}
                        value={[avgOrderValue]}
                        onValueChange={(value) => setAvgOrderValue(value[0])}
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        value={avgOrderValue}
                        onChange={(e) => setAvgOrderValue(Number(e.target.value))}
                        className="w-24 calculator-input"
                        prefix="₹"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="avg-products-per-order" className="calculator-label">
                      Average Products per Order
                    </Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        id="avg-products-per-order"
                        min={1}
                        max={20}
                        step={1}
                        value={[avgProductsPerOrder]}
                        onValueChange={(value) => setAvgProductsPerOrder(value[0])}
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        value={avgProductsPerOrder}
                        onChange={(e) => setAvgProductsPerOrder(Number(e.target.value))}
                        className="w-24 calculator-input"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="avg-product-weight" className="calculator-label">
                      Average Product Weight (kg)
                    </Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        id="avg-product-weight"
                        min={0.1}
                        max={10}
                        step={0.1}
                        value={[avgProductWeight]}
                        onValueChange={(value) => setAvgProductWeight(value[0])}
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        value={avgProductWeight}
                        onChange={(e) => setAvgProductWeight(Number(e.target.value))}
                        className="w-24 calculator-input"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="return-rate" className="calculator-label">
                      Return Rate (%)
                    </Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        id="return-rate"
                        min={0}
                        max={30}
                        step={0.5}
                        value={[returnRate]}
                        onValueChange={(value) => setReturnRate(value[0])}
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        value={returnRate}
                        onChange={(e) => setReturnRate(Number(e.target.value))}
                        className="w-24 calculator-input"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <Button 
                  onClick={calculateCosts} 
                  className="w-full bg-accent hover:bg-accent/90 text-lg py-6"
                  size="lg"
                >
                  Calculate Fulfillment Cost
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="results" id="results-container">
          {results && (
            <div className="space-y-8 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ResultCard 
                  title="Cost per Order" 
                  value={formatCurrency(results.fulfillmentCostPerOrder)} 
                  description="Average fulfillment cost per customer order"
                  icon={<Box className="h-6 w-6 text-primary" />}
                />
                <ResultCard 
                  title="Monthly Cost" 
                  value={formatCurrency(results.monthlyCost)} 
                  description="Total monthly fulfillment expenses"
                  icon={<PackageCheck className="h-6 w-6 text-primary" />}
                />
                <ResultCard 
                  title="Annual Cost" 
                  value={formatCurrency(results.annualCost)} 
                  description="Projected yearly fulfillment costs"
                  icon={<Truck className="h-6 w-6 text-primary" />}
                />
              </div>
              
              <Card className="border-none shadow-md">
                <CardHeader className="bg-primary/10">
                  <CardTitle className="text-2xl">Cost Breakdown Analysis</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <CostBreakdownChart data={results.costBreakdown} />
                    <ComparisonChart 
                      totalCost={results.monthlyCost} 
                      orderValue={avgOrderValue * monthlyOrders}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-md">
                <CardHeader className="bg-primary/10">
                  <CardTitle className="text-2xl">Cost Breakdown Details</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 bg-white rounded-md border border-gray-100">
                      <div className="text-sm text-gray-500">Receiving</div>
                      <div className="text-xl font-semibold">{formatCurrency(results.costBreakdown.receiving)}</div>
                    </div>
                    <div className="p-4 bg-white rounded-md border border-gray-100">
                      <div className="text-sm text-gray-500">Storage</div>
                      <div className="text-xl font-semibold">{formatCurrency(results.costBreakdown.storage)}</div>
                    </div>
                    <div className="p-4 bg-white rounded-md border border-gray-100">
                      <div className="text-sm text-gray-500">Picking</div>
                      <div className="text-xl font-semibold">{formatCurrency(results.costBreakdown.picking)}</div>
                    </div>
                    <div className="p-4 bg-white rounded-md border border-gray-100">
                      <div className="text-sm text-gray-500">Packing</div>
                      <div className="text-xl font-semibold">{formatCurrency(results.costBreakdown.packing)}</div>
                    </div>
                    <div className="p-4 bg-white rounded-md border border-gray-100">
                      <div className="text-sm text-gray-500">Shipping</div>
                      <div className="text-xl font-semibold">{formatCurrency(results.costBreakdown.shipping)}</div>
                    </div>
                    <div className="p-4 bg-white rounded-md border border-gray-100">
                      <div className="text-sm text-gray-500">Returns Processing</div>
                      <div className="text-xl font-semibold">{formatCurrency(results.costBreakdown.returns)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Button 
                  onClick={sendResultsByEmail} 
                  variant="outline" 
                  className="bg-white border-primary text-primary hover:bg-primary/10"
                  size="lg"
                >
                  <Mail className="mr-2 h-5 w-5" />
                  Email Results
                </Button>
                <Button 
                  onClick={downloadPDF} 
                  className="bg-accent hover:bg-accent/90"
                  size="lg"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download PDF Report
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <Separator className="my-12" />
      
      <section className="prose max-w-none">
        <h2 className="section-header">Understanding Your E-commerce Fulfillment Costs</h2>
        
        <p className="text-lg mb-6">
          The Fulfillment Cost per Order Calculator is a powerful tool designed specifically for Indian e-commerce businesses 
          looking to optimize their logistics operations and maximize profitability in a highly competitive market.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="benefit-card">
            <h3 className="font-bold text-lg text-primary mb-2">Cost Visibility</h3>
            <p>Gain complete transparency into all aspects of your fulfillment process, from receiving to returns processing.</p>
          </div>
          <div className="benefit-card">
            <h3 className="font-bold text-lg text-primary mb-2">Strategic Planning</h3>
            <p>Make informed decisions about inventory management, warehouse operations, and logistics partnerships.</p>
          </div>
          <div className="benefit-card">
            <h3 className="font-bold text-lg text-primary mb-2">Profit Optimization</h3>
            <p>Identify opportunities to reduce costs while maintaining high service levels for your customers.</p>
          </div>
        </div>
        
        <h3 className="text-xl font-semibold text-primary mb-4">What Are Fulfillment Costs?</h3>
        
        <p className="mb-6">
          E-commerce fulfillment costs encompass all expenses associated with storing inventory, processing orders, 
          and delivering products to customers. In the Indian market, where consumer expectations for fast delivery 
          are rapidly evolving, understanding and optimizing these costs is crucial for sustainable business growth.
        </p>
        
        <h3 className="text-xl font-semibold text-primary mb-4">Key Components of Fulfillment Costs</h3>
        
        <ul className="list-disc pl-6 mb-6 space-y-3">
          <li>
            <strong>Receiving:</strong> The cost of accepting, unloading, inspecting, and processing incoming inventory 
            from manufacturers or suppliers into your warehouse.
          </li>
          <li>
            <strong>Storage:</strong> Expenses related to storing your products, including warehouse rent, utilities, 
            security, and insurance. These costs typically scale with the volume of inventory you maintain.
          </li>
          <li>
            <strong>Picking:</strong> Labor costs associated with locating and retrieving products from storage 
            locations when orders come in.
          </li>
          <li>
            <strong>Packing:</strong> Costs of packaging materials and labor required to prepare orders for shipping, 
            including boxes, protective materials, and custom packaging.
          </li>
          <li>
            <strong>Shipping:</strong> Transportation costs to deliver products to customers, which vary based on 
            distance, weight, dimensions, and delivery speed.
          </li>
          <li>
            <strong>Returns Processing:</strong> Expenses incurred when handling returned products, including inspection, 
            restocking, and customer refunds or exchanges.
          </li>
        </ul>
        
        <h3 className="text-xl font-semibold text-primary mb-4">Why This Calculator Matters for Indian E-commerce Businesses</h3>
        
        <p className="mb-6">
          India's e-commerce market is experiencing explosive growth, with unique challenges such as diverse geography, 
          varied infrastructure quality, and rapidly evolving consumer expectations. Our calculator is specifically 
          calibrated to the Indian market, incorporating local cost factors and operational considerations.
        </p>
        
        <p className="mb-6">
          Understanding your fulfillment costs per order is critical because:
        </p>
        
        <ul className="list-disc pl-6 mb-6 space-y-3">
          <li>It helps determine appropriate pricing strategies for your products</li>
          <li>It identifies inefficiencies in your fulfillment process that can be optimized</li>
          <li>It enables accurate comparisons between in-house fulfillment and 3PL (third-party logistics) options</li>
          <li>It provides benchmarks for evaluating the success of cost-reduction initiatives</li>
          <li>It informs decisions about inventory levels, warehouse locations, and shipping options</li>
        </ul>
        
        <h3 className="text-xl font-semibold text-primary mb-4">How to Use the Results Effectively</h3>
        
        <p className="mb-10">
          After calculating your fulfillment costs, consider these strategies to optimize your operations:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h4 className="font-semibold text-primary mb-3">For High Storage Costs:</h4>
            <ul className="list-disc pl-5 space-y-2">
              <li>Implement just-in-time inventory management</li>
              <li>Negotiate better warehouse rates or consider alternative locations</li>
              <li>Optimize product packaging to reduce storage space requirements</li>
              <li>Consider dropshipping for low-turnover products</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h4 className="font-semibold text-primary mb-3">For High Shipping Costs:</h4>
            <ul className="list-disc pl-5 space-y-2">
              <li>Negotiate volume discounts with multiple carriers</li>
              <li>Optimize packaging to reduce dimensional weight</li>
              <li>Consider distributed warehousing to reduce shipping distances</li>
              <li>Implement zone skipping for bulk shipments</li>
            </ul>
          </div>
        </div>
        
        <div className="bg-primary/5 rounded-lg p-6 border border-primary/20 mb-10">
          <h3 className="text-xl font-semibold text-primary mb-4">Expert Insight</h3>
          <p className="italic">
            "In the rapidly evolving Indian e-commerce landscape, businesses that gain granular visibility into their 
            fulfillment costs and continuously optimize their operations will build sustainable competitive advantages. 
            With rising customer expectations for fast, free delivery, understanding the cost implications of different 
            fulfillment strategies is no longer optional—it's essential for survival and growth."
          </p>
          <p className="mt-4 font-medium">— E-commerce Logistics Expert</p>
        </div>
        
        <h3 className="text-xl font-semibold text-primary mb-4">Stay Ahead with Regular Cost Analysis</h3>
        
        <p className="mb-6">
          The e-commerce fulfillment landscape is constantly changing, with new technologies, service providers, and 
          customer expectations emerging regularly. We recommend recalculating your fulfillment costs quarterly to 
          identify trends, evaluate the impact of operational changes, and stay ahead of market developments.
        </p>
        
        <p className="mb-10">
          Our calculator provides you with the insights needed to make data-driven decisions about your fulfillment 
          strategy, helping you balance cost efficiency with customer satisfaction in the dynamic Indian e-commerce market.
        </p>
      </section>
    </div>
  );
};

export default FulfillmentCalculator;
