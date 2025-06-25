import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useNotifications } from "@/components/notifications/notification-provider";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { Order, SupportTicket } from "@/lib/types";
import { Link, useLocation } from "wouter";
import {
  Package,
  CreditCard,
  Headphones,
  Settings,
  Download,
  Eye,
  Plus,
  Calendar,
  DollarSign,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const queryClient = useQueryClient();

  // Dashboard stats query
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard-stats"],
  });

  // Orders query
  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ["/api/orders"],
  });

  // Support tickets query
  const { data: supportTickets, isLoading: ticketsLoading } = useQuery({
    queryKey: ["/api/support-tickets"],
  });

  // New support ticket mutation
  const createTicketMutation = useMutation({
    mutationFn: async (ticketData: { subject: string; description: string; priority: string }) => {
      const response = await apiRequest("POST", "/api/support-tickets", ticketData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/support-tickets"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard-stats"] });
      addNotification("Support ticket created successfully!", "success");
      setTicketForm({ subject: "", description: "", priority: "medium" });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        addNotification("You are logged out. Logging in again...", "error");
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      addNotification("Failed to create support ticket", "error");
    },
  });

  const [ticketForm, setTicketForm] = useState({
    subject: "",
    description: "",
    priority: "medium"
  });

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    createTicketMutation.mutate(ticketForm);
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case "processing":
        return <Clock className="h-4 w-4 text-yellow-400" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-400" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "text-green-400";
      case "processing":
        return "text-yellow-400";
      case "cancelled":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  if (statsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-6 bg-gray-900">
      <div className="max-w-screen-xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome Back, <span className="gradient-text">{user?.firstName || "User"}</span>
          </h1>
          <p className="text-lg text-gray-400">
            Manage your services, orders, and account settings.
          </p>
        </div>

        {/* Dashboard Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="dashboard-stat">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl gradient-text mb-2">{stats?.totalOrders || 0}</div>
                  <div className="text-gray-400">Total Orders</div>
                </div>
                <Package className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="dashboard-stat">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl gradient-text mb-2">{stats?.activeServices || 0}</div>
                  <div className="text-gray-400">Active Services</div>
                </div>
                <Activity className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="dashboard-stat">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl gradient-text mb-2">${stats?.totalRevenue || 0}</div>
                  <div className="text-gray-400">Total Spent</div>
                </div>
                <DollarSign className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="dashboard-stat">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl gradient-text mb-2">{stats?.openTickets || 0}</div>
                  <div className="text-gray-400">Support Tickets</div>
                </div>
                <Headphones className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Tabs */}
        <Tabs defaultValue="orders" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800">
            <TabsTrigger value="orders" className="flex items-center space-x-2">
              <Package className="h-4 w-4" />
              <span>Orders</span>
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4" />
              <span>Billing</span>
            </TabsTrigger>
            <TabsTrigger value="support" className="flex items-center space-x-2">
              <Headphones className="h-4 w-4" />
              <span>Support</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Profile</span>
            </TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Order History</h2>
              <Link href="/services">
                <Button className="btn-primary">
                  <Plus className="mr-2 h-4 w-4" />
                  New Order
                </Button>
              </Link>
            </div>

            {ordersLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner size="lg" />
              </div>
            ) : orders && orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order: Order) => (
                  <Card key={order.id} className="order-card">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">#{order.orderNumber}</h3>
                          <p className="text-gray-400">
                            Placed on {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(order.status)}
                          <span className={`font-semibold capitalize ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="font-medium mb-2">Services Ordered:</h4>
                          <ul className="text-gray-400 space-y-1">
                            {order.items?.map((item) => (
                              <li key={item.id}>
                                • {item.service.name} - ${parseFloat(item.unitPrice).toFixed(2)}
                                {item.quantity > 1 && ` (x${item.quantity})`}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Payment Info:</h4>
                          <div className="text-gray-400 space-y-1">
                            <div>Method: {order.paymentMethod || "Not specified"}</div>
                            <div className={`${getStatusColor(order.paymentStatus || "pending")}`}>
                              Payment: {order.paymentStatus || "Pending"}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                        <span className="text-lg font-semibold">
                          Total: ${parseFloat(order.totalAmount).toFixed(2)}
                        </span>
                        <div className="space-x-2">
                          <Button variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Invoice
                          </Button>
                          <Button size="sm" className="btn-secondary">
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="order-card">
                <CardContent className="p-12 text-center">
                  <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Orders Yet</h3>
                  <p className="text-gray-400 mb-6">
                    You haven't placed any orders yet. Explore our services to get started.
                  </p>
                  <Link href="/services">
                    <Button className="btn-primary">
                      Browse Services
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-6">
            <h2 className="text-2xl font-semibold">Billing & Payments</h2>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="order-card">
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <CreditCard className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <p className="text-gray-400 mb-4">No payment methods saved</p>
                    <Button className="btn-secondary">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Payment Method
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="order-card">
                <CardHeader>
                  <CardTitle>Billing History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Calendar className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <p className="text-gray-400">No billing history available</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Support Tab */}
          <TabsContent value="support" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Support Tickets</h2>
            </div>

            {/* Create New Ticket */}
            <Card className="order-card">
              <CardHeader>
                <CardTitle>Create New Ticket</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateTicket} className="space-y-4">
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={ticketForm.subject}
                      onChange={(e) => setTicketForm(prev => ({ ...prev, subject: e.target.value }))}
                      className="form-input mt-2"
                      placeholder="Brief description of your issue"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <select
                      id="priority"
                      value={ticketForm.priority}
                      onChange={(e) => setTicketForm(prev => ({ ...prev, priority: e.target.value }))}
                      className="form-input mt-2 w-full"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={ticketForm.description}
                      onChange={(e) => setTicketForm(prev => ({ ...prev, description: e.target.value }))}
                      className="form-input mt-2 min-h-[100px]"
                      placeholder="Please provide detailed information about your issue..."
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={createTicketMutation.isPending}
                    className="btn-primary"
                  >
                    {createTicketMutation.isPending ? (
                      <>
                        <LoadingSpinner className="mr-2" size="sm" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Ticket
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Existing Tickets */}
            {ticketsLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner size="lg" />
              </div>
            ) : supportTickets && supportTickets.length > 0 ? (
              <div className="space-y-4">
                {supportTickets.map((ticket: SupportTicket) => (
                  <Card key={ticket.id} className="order-card">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">#{ticket.ticketNumber}</h3>
                          <p className="text-xl font-medium mb-1">{ticket.subject}</p>
                          <p className="text-gray-400">
                            Created {new Date(ticket.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={`${getPriorityColor(ticket.priority)} text-white`}>
                            {ticket.priority}
                          </Badge>
                          <Badge variant="outline" className="capitalize">
                            {ticket.status}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-gray-300 mb-4">{ticket.description}</p>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">
                          Last updated {new Date(ticket.updatedAt).toLocaleDateString()}
                        </span>
                        <Button size="sm" className="btn-secondary">
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="order-card">
                <CardContent className="p-12 text-center">
                  <Headphones className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Support Tickets</h3>
                  <p className="text-gray-400">
                    You haven't created any support tickets yet. If you need help, create a ticket above.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <h2 className="text-2xl font-semibold">Profile Settings</h2>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="order-card">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label>Full Name</Label>
                      <Input
                        value={`${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Not provided"}
                        className="form-input mt-2"
                        disabled
                      />
                    </div>
                    <div>
                      <Label>Email Address</Label>
                      <Input
                        value={user?.email || "Not provided"}
                        className="form-input mt-2"
                        disabled
                      />
                    </div>
                    <div>
                      <Label>Account Role</Label>
                      <Input
                        value={user?.role || "Customer"}
                        className="form-input mt-2"
                        disabled
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="order-card">
                <CardHeader>
                  <CardTitle>Account Security</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gray-800 rounded border border-gray-700">
                      <div>
                        <div className="font-medium">Two-Factor Authentication</div>
                        <div className="text-sm text-gray-400">Add an extra layer of security</div>
                      </div>
                      <Button size="sm" className="btn-secondary">
                        Enable
                      </Button>
                    </div>

                    <div className="flex justify-between items-center p-4 bg-gray-800 rounded border border-gray-700">
                      <div>
                        <div className="font-medium">Login Sessions</div>
                        <div className="text-sm text-gray-400">Manage active sessions</div>
                      </div>
                      <Button size="sm" className="btn-secondary">
                        View
                      </Button>
                    </div>

                    <div className="flex justify-between items-center p-4 bg-gray-800 rounded border border-gray-700">
                      <div>
                        <div className="font-medium">Account Deletion</div>
                        <div className="text-sm text-gray-400">Permanently delete your account</div>
                      </div>
                      <Button size="sm" variant="destructive">
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
