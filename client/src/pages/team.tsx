import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Github, 
  Twitter, 
  Linkedin, 
  Mail,
  Code,
  Palette,
  Shield,
  Headphones
} from "lucide-react";

const teamMembers = [
  {
    name: "Alex Johnson",
    role: "Lead Developer",
    description: "Full-stack developer with 8+ years of experience in Minecraft server development and infrastructure.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&w=400&h=400&fit=crop&crop=face",
    specialties: ["Backend Development", "Server Architecture", "Plugin Development"],
    icon: Code,
    social: {
      github: "#",
      twitter: "#",
      linkedin: "#",
      email: "alex@fuzzlabs.com"
    }
  },
  {
    name: "Sarah Chen",
    role: "Creative Director",
    description: "Award-winning designer specializing in gaming graphics and brand identity for Minecraft communities.",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b04c?ixlib=rb-4.0.3&w=400&h=400&fit=crop&crop=face",
    specialties: ["UI/UX Design", "Branding", "Graphic Design"],
    icon: Palette,
    social: {
      github: "#",
      twitter: "#",
      linkedin: "#",
      email: "sarah@fuzzlabs.com"
    }
  },
  {
    name: "Michael Rodriguez",
    role: "DevOps Engineer",
    description: "Infrastructure specialist ensuring 99.9% uptime and security for all our hosting services.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&w=400&h=400&fit=crop&crop=face",
    specialties: ["Cloud Infrastructure", "Security", "Performance Optimization"],
    icon: Shield,
    social: {
      github: "#",
      twitter: "#",
      linkedin: "#",
      email: "michael@fuzzlabs.com"
    }
  },
  {
    name: "Emma Thompson",
    role: "Customer Success Manager",
    description: "Dedicated to providing exceptional support and ensuring every client achieves their server goals.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&w=400&h=400&fit=crop&crop=face",
    specialties: ["Customer Support", "Project Management", "Community Building"],
    icon: Headphones,
    social: {
      github: "#",
      twitter: "#",
      linkedin: "#",
      email: "emma@fuzzlabs.com"
    }
  }
];

export default function Team() {
  return (
    <div className="min-h-screen py-20 px-6 bg-black">
      <div className="max-w-screen-xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Meet Our <span className="gradient-text">Team</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Experienced professionals dedicated to your success. Our team combines years of Minecraft expertise with cutting-edge technology skills.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
          {teamMembers.map((member) => {
            const IconComponent = member.icon;
            
            return (
              <Card key={member.name} className="team-card overflow-hidden">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                    <div className="relative">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-32 h-32 rounded-full object-cover border-4 border-green-400"
                      />
                      <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                        <IconComponent className="h-6 w-6 text-black" />
                      </div>
                    </div>
                    
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-2xl font-bold mb-2">{member.name}</h3>
                      <p className="text-green-400 font-semibold mb-3">{member.role}</p>
                      <p className="text-gray-400 mb-4 leading-relaxed">
                        {member.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-4 justify-center md:justify-start">
                        {member.specialties.map((specialty) => (
                          <Badge key={specialty} variant="outline" className="border-green-400 text-green-400">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex space-x-3 justify-center md:justify-start">
                        <a href={member.social.github} className="text-gray-400 hover:text-green-400 transition-colors">
                          <Github className="h-5 w-5" />
                        </a>
                        <a href={member.social.twitter} className="text-gray-400 hover:text-green-400 transition-colors">
                          <Twitter className="h-5 w-5" />
                        </a>
                        <a href={member.social.linkedin} className="text-gray-400 hover:text-green-400 transition-colors">
                          <Linkedin className="h-5 w-5" />
                        </a>
                        <a href={`mailto:${member.social.email}`} className="text-gray-400 hover:text-green-400 transition-colors">
                          <Mail className="h-5 w-5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Company Stats */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-8">
            Our <span className="gradient-text">Impact</span>
          </h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text mb-2">500+</div>
              <div className="text-gray-400">Servers Hosted</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text mb-2">10K+</div>
              <div className="text-gray-400">Happy Players</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text mb-2">99.9%</div>
              <div className="text-gray-400">Uptime Achieved</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text mb-2">24/7</div>
              <div className="text-gray-400">Support Available</div>
            </div>
          </div>
        </div>

        {/* Join Our Team */}
        <div className="text-center bg-gray-900 rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">
            Join Our <span className="gradient-text">Team</span>
          </h2>
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
            We're always looking for talented individuals who share our passion for Minecraft and technology. 
            Explore career opportunities with Fuzz Labs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:careers@fuzzlabs.com" 
              className="btn-primary font-bold py-3 px-8 rounded-full inline-flex items-center justify-center"
            >
              <Mail className="mr-2 h-5 w-5" />
              View Open Positions
            </a>
            <a 
              href="mailto:hello@fuzzlabs.com" 
              className="btn-secondary font-bold py-3 px-8 rounded-full inline-flex items-center justify-center"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
