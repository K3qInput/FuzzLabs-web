import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/components/notifications/notification-provider";
import { apiRequest } from "@/lib/queryClient";
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  TrendingUp, 
  DollarSign,
  X,
  Minimize2,
  Maximize2
} from "lucide-react";

interface ChatMessage {
  id: string;
  type: 'user' | 'bot' | 'comparison';
  content: string;
  timestamp: Date;
  comparisonData?: any;
}

interface AIChatbotProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function AIChatbot({ isOpen, onToggle }: AIChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hi! I'm Seragon's AI assistant. I can help you understand our services and compare pricing with competitors like BuiltByBit and Polymart. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addNotification } = useNotifications();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Check if user is asking for price comparison
      const isPriceComparison = inputMessage.toLowerCase().includes('compare') || 
                                inputMessage.toLowerCase().includes('price') || 
                                inputMessage.toLowerCase().includes('cost');

      if (isPriceComparison) {
        const response = await apiRequest('/api/ai/price-comparison', {
          method: 'POST',
          body: { message: inputMessage }
        });

        if (response.comparisonData) {
          const comparisonMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            type: 'comparison',
            content: response.message,
            timestamp: new Date(),
            comparisonData: response.comparisonData
          };
          setMessages(prev => [...prev, comparisonMessage]);
        } else {
          const botMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            type: 'bot',
            content: response.message,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, botMessage]);
        }
      } else {
        const response = await apiRequest('/api/ai/chat', {
          method: 'POST',
          body: { message: inputMessage }
        });

        const botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: response.message,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      addNotification("Failed to send message. Please try again.", "error");
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: "I'm having trouble responding right now. Please try again later or contact us directly through Discord.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const PriceComparisonCard = ({ data }: { data: any }) => (
    <Card className="mt-4 bg-gray-800 border-gray-700">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-400" />
          <CardTitle className="text-lg text-white">Price Comparison: {data.service}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-900/30 p-3 rounded">
            <div className="text-sm text-gray-400">Seragon Price</div>
            <div className="text-2xl font-bold text-green-400">${data.seragronPrice}</div>
          </div>
          <div className="bg-gray-900/50 p-3 rounded">
            <div className="text-sm text-gray-400">Market Average</div>
            <div className="text-2xl font-bold text-gray-300">
              ${data.competitors?.reduce((sum: number, comp: any) => sum + comp.price, 0) / (data.competitors?.length || 1) || 0}
            </div>
          </div>
        </div>
        
        {data.competitors && data.competitors.length > 0 && (
          <div>
            <h4 className="font-semibold text-white mb-2">Competitors:</h4>
            <div className="space-y-2">
              {data.competitors.map((comp: any, index: number) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-900/30 rounded">
                  <div>
                    <Badge variant="outline" className="text-xs mb-1">{comp.platform}</Badge>
                    <div className="text-sm text-gray-300">{comp.serviceType}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-white">${comp.price}</div>
                    <div className="text-xs text-gray-400">{comp.quality}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="bg-blue-900/20 p-3 rounded">
          <h4 className="font-semibold text-blue-300 mb-2">Analysis:</h4>
          <p className="text-sm text-gray-300">{data.analysis}</p>
        </div>
        
        <div className="bg-green-900/20 p-3 rounded">
          <h4 className="font-semibold text-green-300 mb-2">Recommendation:</h4>
          <p className="text-sm text-gray-300">{data.recommendation}</p>
        </div>
      </CardContent>
    </Card>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className={`bg-gray-900 border-gray-700 shadow-2xl transition-all duration-300 ${
        isMinimized ? 'w-80 h-16' : 'w-96 h-[500px]'
      }`}>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-green-400" />
            <CardTitle className="text-lg text-white">Seragon AI Assistant</CardTitle>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-8 w-8 text-gray-400 hover:text-white"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="h-8 w-8 text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        {!isMinimized && (
          <CardContent className="flex flex-col h-[400px] p-4">
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                      <div className={`flex items-center gap-2 mb-1 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {message.type === 'user' ? (
                          <User className="h-4 w-4 text-blue-400" />
                        ) : (
                          <Bot className="h-4 w-4 text-green-400" />
                        )}
                        <span className="text-xs text-gray-400">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <div className={`p-3 rounded-lg ${
                        message.type === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-800 text-gray-200'
                      }`}>
                        {message.content}
                      </div>
                      {message.comparisonData && (
                        <PriceComparisonCard data={message.comparisonData} />
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-800 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>
            
            <div className="flex items-center gap-2 mt-4">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about pricing, services, or comparisons..."
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="bg-green-600 hover:bg-green-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}

export function AIChatToggle() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-40 bg-green-600 hover:bg-green-700 text-white rounded-full p-4 shadow-lg"
        size="lg"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
      
      <AIChatbot isOpen={isOpen} onToggle={() => setIsOpen(false)} />
    </>
  );
}