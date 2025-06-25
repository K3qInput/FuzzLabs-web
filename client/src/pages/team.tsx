import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { teamData } from "@/data/teamData";



export default function Team() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Meet the <span className="gradient-text">Fuzz Labs Team</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            The passionate experts dedicated to bringing your Minecraft vision to life.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamData.map((member) => (
            <Card 
              key={member.id} 
              className="team-card text-center p-8 bg-[#1f1f1f] border border-gray-800 hover:border-[#00ff88] transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <CardContent className="p-0">
                <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-[#00ff88] shadow-lg">
                  <AvatarImage 
                    src={member.imageUrl} 
                    alt={member.name}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = `https://placehold.co/150x150/0a0a0a/ffffff?text=${member.name[0]}`;
                    }}
                  />
                  <AvatarFallback className="bg-[#0a0a0a] text-white text-2xl">
                    {member.name[0]}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-2xl font-bold text-white mb-2">{member.name}</h3>
                <p className="text-[#00ff88] font-semibold mb-4">{member.role}</p>
                <p className="text-gray-400">{member.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
