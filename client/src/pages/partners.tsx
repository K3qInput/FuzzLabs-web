import { Card, CardContent } from "@/components/ui/card";
import { partnerData } from "@/data/partnerData";



export default function Partners() {
  return (
    <div className="min-h-screen bg-[#1f1f1f] text-white">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Our <span className="gradient-text">Partners</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            We're proud to collaborate with industry-leading companies to provide the best services.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {partnerData.map((partner) => (
            <Card 
              key={partner.id} 
              className="partner-card p-6 flex justify-center items-center h-40 bg-[#1f1f1f] border border-gray-800 hover:border-[#00ff88] transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <CardContent className="p-0 flex justify-center items-center">
                <img
                  src={partner.logo}
                  alt={`${partner.name} Logo`}
                  className="max-h-16 w-auto object-contain filter brightness-75 hover:brightness-100 transition-all duration-300"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
