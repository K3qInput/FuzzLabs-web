import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Clock, 
  User, 
  ArrowRight,
  Server,
  Code,
  Palette,
  Settings
} from "lucide-react";

export default function Blog() {
  const posts = [
    {
      id: 1,
      title: "Ultimate Guide to Minecraft Server Optimization",
      excerpt: "Learn how to optimize your Minecraft server for maximum performance and reduced lag with these proven techniques from GitHub experts.",
      author: "Kiro",
      date: "2025-01-15",
      readTime: "8 min read",
      category: "Performance",
      categoryColor: "bg-blue-500",
      image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=250&fit=crop",
      link: "https://github.com/YouHaveTrouble/minecraft-optimization"
    },
    {
      id: 2,
      title: "Aikar Flags Optimization Guide",
      excerpt: "Complete guide to optimizing Minecraft server JVM flags for better performance and reduced garbage collection.",
      author: "Kiro",
      date: "2025-01-12",
      readTime: "6 min read",
      category: "Performance",
      categoryColor: "bg-green-500",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=250&fit=crop",
      link: "https://github.com/JewishLewish/minecraft-aikar-flags-optimization"
    },
    {
      id: 3,
      title: "Paper Chan's Server Optimization Guide",
      excerpt: "The most comprehensive and up-to-date server optimization guide by the PaperMC community with walkthrough explanations.",
      author: "Kiro",
      date: "2025-01-10",
      readTime: "12 min read",
      category: "Tutorial",
      categoryColor: "bg-purple-500",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=250&fit=crop",
      link: "https://paper-chan.moe/paper-optimization/"
    },
    {
      id: 4,
      title: "Official PaperMC Documentation",
      excerpt: "Complete official documentation for PaperMC server setup, configuration, and optimization from the source.",
      author: "Kiro",
      date: "2025-01-08",
      readTime: "10 min read",
      category: "Documentation",
      categoryColor: "bg-red-500",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=250&fit=crop",
      link: "https://docs.papermc.io/"
    },
    {
      id: 5,
      title: "Minecraft Plugin Development Guide",
      excerpt: "Learn to create custom plugins with official PaperMC development documentation and beginner-friendly tutorials.",
      author: "Kiro",
      date: "2025-01-05",
      readTime: "15 min read",
      category: "Development",
      categoryColor: "bg-yellow-500",
      image: "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=400&h=250&fit=crop",
      link: "https://docs.papermc.io/paper/dev/"
    },
    {
      id: 6,
      title: "Server Security Best Practices",
      excerpt: "Comprehensive security guide covering DDoS protection, authentication, and anti-cheat measures for Minecraft servers.",
      author: "Kiro",
      date: "2025-01-03",
      readTime: "8 min read",
      category: "Security",
      categoryColor: "bg-indigo-500",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop",
      link: "https://pinehosting.com/blog/minecraft-server-security-7-tips-for-keeping-your-minecraft-server-secure/"
    }
  ];

  const categories = [
    { name: "Server Hosting", count: 12, icon: Server },
    { name: "Development", count: 8, icon: Code },
    { name: "Design", count: 6, icon: Palette },
    { name: "Security", count: 4, icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <Badge className="mb-6 bg-green-500/20 text-green-400 border-green-500/30">
            Knowledge Base
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">
            Server Mastery Blog
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Expert guides, tutorials, and insights to help you build and manage 
            the perfect Minecraft server - all while keeping costs under $30.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 px-6 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Card key={index} className="bg-gray-800/50 border-gray-700 hover:border-green-500/50 transition-colors cursor-pointer">
                <CardContent className="p-6 text-center">
                  <category.icon className="h-8 w-8 text-green-400 mx-auto mb-3" />
                  <h3 className="font-semibold text-white mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-400">{category.count} articles</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Card key={post.id} className="bg-gray-800/50 border-gray-700 hover:border-green-500/50 transition-all duration-300 overflow-hidden group">
                <div className="relative overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className={`absolute top-4 left-4 ${post.categoryColor} text-white border-0`}>
                    {post.category}
                  </Badge>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-white hover:text-green-400 transition-colors">
                    {post.title}
                  </CardTitle>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {post.excerpt}
                  </p>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    className="w-full group-hover:bg-green-500/20 group-hover:text-green-400 transition-colors"
                    onClick={() => window.open(post.link, '_blank')}
                  >
                    Read More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 px-6 bg-gray-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Stay Updated</h2>
          <p className="text-xl text-gray-300 mb-8">
            Get the latest tips, tutorials, and affordable service updates delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <Button className="btn-primary whitespace-nowrap">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}