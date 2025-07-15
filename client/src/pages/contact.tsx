import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useNotifications } from "@/components/notifications/notification-provider";
import { 
  Mail, 
  MessageCircle, 
  Phone, 
  MapPin,
  Clock,
  Send,
  Globe,
  Shield,
  Headphones
} from "lucide-react";

const contactMethods = [
  {
    icon: Mail,
    title: "Email Support",
    description: "Get help via email within 2 hours",
    contact: "support@seragon.com",
    action: "mailto:support@seragon.com"
  },
  {
    icon: MessageCircle,
    title: "Discord Community",
    description: "Join our Discord for instant support",
    contact: "discord.gg/b4f8WZy4R8",
    action: "https://discord.gg/b4f8WZy4R8"
  }
];

// Removed office locations as requested

const supportFeatures = [
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Round-the-clock assistance for all our hosting customers"
  },
  {
    icon: Globe,
    title: "Global Coverage",
    description: "Support teams across multiple time zones worldwide"
  },
  {
    icon: Shield,
    title: "Expert Team",
    description: "Certified Minecraft professionals with years of experience"
  },
  {
    icon: Headphones,
    title: "Multiple Channels",
    description: "Email, Discord, phone, and live chat support options"
  }
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    priority: "medium"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addNotification } = useNotifications();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      addNotification("Message sent successfully! We'll get back to you within 24 hours.", "success");
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        priority: "medium"
      });
    } catch (error) {
      addNotification("Failed to send message. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen py-20 px-6 bg-black">
      <div className="max-w-screen-xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Get In <span className="gradient-text">Touch</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Ready to start your project? Contact us today and let's build something amazing together.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Contact Form */}
          <Card className="order-card">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Send us a Message</CardTitle>
              <p className="text-gray-400">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-input mt-2"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-input mt-2"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="form-input mt-2"
                    placeholder="What can we help you with?"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="form-input mt-2 w-full"
                  >
                    <option value="low">Low - General inquiry</option>
                    <option value="medium">Medium - Support request</option>
                    <option value="high">High - Urgent issue</option>
                    <option value="critical">Critical - Server down</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="form-input mt-2 min-h-[120px]"
                    placeholder="Tell us more about your project or issue..."
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary"
                >
                  {isSubmitting ? (
                    <>
                      <div className="loading-spinner mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Contact Methods</h2>
              <div className="space-y-4">
                {contactMethods.map((method) => {
                  const IconComponent = method.icon;
                  
                  return (
                    <Card key={method.title} className="order-card">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                            <IconComponent className="h-6 w-6 text-black" />
                          </div>
                          <div>
                            <h3 className="font-semibold mb-1">{method.title}</h3>
                            <p className="text-gray-400 text-sm mb-2">{method.description}</p>
                            <a
                              href={method.action}
                              className="text-green-400 hover:text-green-300 transition-colors"
                            >
                              {method.contact}
                            </a>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Support Features */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Support Features</h2>
              <div className="space-y-4">
                {supportFeatures.map((feature) => {
                  const IconComponent = feature.icon;
                  
                  return (
                    <Card key={feature.title} className="order-card">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                            <IconComponent className="h-6 w-6 text-black" />
                          </div>
                          <div>
                            <h3 className="font-semibold mb-1">{feature.title}</h3>
                            <p className="text-gray-400 text-sm">{feature.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Support Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Our <span className="gradient-text">Support Promise</span>
          </h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            {supportFeatures.map((feature) => {
              const IconComponent = feature.icon;
              
              return (
                <Card key={feature.title} className="service-card text-center">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-8 w-8 text-black" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-400 text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="text-center bg-gray-900 rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-8">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
            <div>
              <h3 className="text-lg font-semibold mb-2">How quickly do you respond to support requests?</h3>
              <p className="text-gray-400">
                We respond to all support requests within 2 hours during business hours and within 6 hours outside business hours.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Do you offer phone support?</h3>
              <p className="text-gray-400">
                Yes, we offer phone support for critical issues and enterprise customers. Discord and email are our primary support channels.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Can I schedule a consultation?</h3>
              <p className="text-gray-400">
                Absolutely! Contact us to schedule a free consultation to discuss your Minecraft server needs and requirements.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">What languages do you support?</h3>
              <p className="text-gray-400">
                Our support team is available in English, Spanish, French, German, and Portuguese. Additional languages available upon request.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
