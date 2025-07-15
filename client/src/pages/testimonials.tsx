import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Quote, Star } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Alex Johnson",
      role: "Server Owner",
      server: "CraftRealms",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "Seragon transformed our server from a basic setup to a professional gaming experience. The affordable pricing made it possible for us to access premium features without breaking the bank."
    },
    {
      name: "Sarah Chen",
      role: "Community Manager",
      server: "MineVerse",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b302?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "The support team at Seragon is incredible. They helped us set up our entire server infrastructure for just $24.99. Our player base has grown 300% since launch!"
    },
    {
      name: "Mike Rodriguez",
      role: "Developer",
      server: "PixelCraft",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "I've worked with many hosting providers, but Seragon's custom development services are unmatched. They delivered a complex plugin for under $30 - amazing value!"
    },
    {
      name: "Emma Thompson",
      role: "Content Creator",
      server: "BuildersHub",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "The design services exceeded our expectations. Professional logos, banners, and website template - all for less than $30. Our server looks incredibly professional now."
    },
    {
      name: "David Kim",
      role: "Admin",
      server: "SkyBlock Empire",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "Seragon's hosting solution is perfect for small communities. $5.99/month for reliable hosting with 24/7 support - you can't find better value anywhere else."
    },
    {
      name: "Lisa Park",
      role: "Server Owner",
      server: "AdventureZone",
      avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "The world building service is phenomenal. They created a stunning spawn area for just $16.99. Our players are constantly complimenting the beautiful builds."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <Badge className="mb-6 bg-green-500/20 text-green-400 border-green-500/30">
            Customer Stories
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">
            What Our Customers Say
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what real server owners say about 
            their experience with Seragon's affordable services.
          </p>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-gray-800/50 border-gray-700 hover:border-green-500/50 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-white">{testimonial.name}</div>
                      <div className="text-sm text-gray-400">{testimonial.role}</div>
                      <div className="text-sm text-green-400">{testimonial.server}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <Quote className="h-8 w-8 text-green-400/30 mb-2" />
                    <p className="text-gray-300 italic leading-relaxed">
                      "{testimonial.text}"
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Trusted by Thousands</h2>
            <p className="text-xl text-gray-400">
              Join the growing community of satisfied customers
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">2,500+</div>
              <div className="text-gray-400">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">4.9/5</div>
              <div className="text-gray-400">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">99.8%</div>
              <div className="text-gray-400">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">24/7</div>
              <div className="text-gray-400">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Join Them?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Start your Minecraft server journey with Seragon today. 
            Affordable pricing, professional quality, exceptional support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/services" className="btn-primary font-bold py-4 px-8 rounded-full text-lg">
              View Services
            </a>
            <a href="/contact" className="btn-secondary font-bold py-4 px-8 rounded-full text-lg">
              Get Started
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}