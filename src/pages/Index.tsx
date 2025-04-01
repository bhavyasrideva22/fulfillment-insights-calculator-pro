
import FulfillmentCalculator from "@/components/FulfillmentCalculator";

const Index = () => {
  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <header className="bg-primary text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold">
            Fulfillment Insights Calculator Pro
          </h1>
          <p className="mt-2 text-white/80 max-w-2xl">
            Advanced cost analysis tools for e-commerce businesses in India
          </p>
        </div>
      </header>
      
      <main>
        <FulfillmentCalculator />
      </main>
      
      <footer className="bg-[#333] text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p>© 2023 Fulfillment Insights Calculator Pro. All rights reserved.</p>
            <p className="text-white/60 text-sm mt-2">
              Helping Indian e-commerce businesses optimize their fulfillment operations
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
