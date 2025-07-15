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
      title: "The Complete Guide to Minecraft Server Hosting in 2025",
      excerpt: "Everything you need to know about setting up and managing a Minecraft server, from choosing the right hosting to optimizing performance.",
      author: "Kiro",
      date: "2025-01-15",
      readTime: "8 min read",
      category: "Server Hosting",
      categoryColor: "bg-blue-500",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=250&fit=crop"
    },
    {
      id: 2,
      title: "10 Essential Plugins Every Minecraft Server Needs",
      excerpt: "Discover the must-have plugins that will transform your server from basic to professional, all available for under $30.",
      author: "Kiro",
      date: "2025-01-12",
      readTime: "6 min read",
      category: "Development",
      categoryColor: "bg-green-500",
      image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=250&fit=crop"
    },
    {
      id: 3,
      title: "Creating Stunning Server Logos on a Budget",
      excerpt: "Professional design tips and tricks for creating eye-catching logos that won't break the bank. Learn how to get premium results for less.",
      author: "Kiro",
      date: "2025-01-10",
      readTime: "5 min read",
      category: "Design",
      categoryColor: "bg-purple-500",
      image: "https://images.unsplash.com/photo-1559163499-413811fb2344?w=400&h=250&fit=crop"
    },
    {
      id: 4,
      title: "Server Security: Protecting Your Community",
      excerpt: "Essential security measures every server owner should implement to protect their players and maintain a safe gaming environment.",
      author: "Kiro",
      date: "2025-01-08",
      readTime: "7 min read",
      category: "Security",
      categoryColor: "bg-red-500",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=250&fit=crop"
    },
    {
      id: 5,
      title: "Building Your First Custom Minecraft World",
      excerpt: "Step-by-step guide to creating immersive custom worlds that will keep your players engaged for hours.",
      author: "Kiro",
      date: "2025-01-05",
      readTime: "9 min read",
      category: "World Building",
      categoryColor: "bg-yellow-500",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=250&fit=crop"
    },
    {
      id: 6,
      title: "Discord Integration: Connecting Your Communities",
      excerpt: "How to seamlessly integrate your Discord server with your Minecraft server to create a unified community experience.",
      author: "Kiro",
      date: "2025-01-03",
      readTime: "6 min read",
      category: "Integration",
      categoryColor: "bg-indigo-500",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=250&fit=crop"
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
                  
                  <Button variant="ghost" className="w-full group-hover:bg-green-500/20 group-hover:text-green-400 transition-colors">
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