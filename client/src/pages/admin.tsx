import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useNotifications } from "@/components/notifications/notification-provider";
import { isUnauthorizedError } from "@/lib/authUtils";
import { User, Order, SupportTicket } from "@/lib/types";
import { useLocation } from "wouter";
import {
  Users,
  Package,
  CreditCard,
  Headphones,
  Settings,
  Search,
  Download,
  Eye,
  Edit,
  Trash,
  BarChart3,
  DollarSign,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Mail,
  Filter
} from "lucide-react";

export default function Admin() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Check admin access
  useEffect(() => {
    if (user && user.role !== "admin") {
      addNotification("Access denied. Admin privileges required.", "error");
      setLocation("/dashboard");
    }
  }, [user, setLocation, addNotification]);

  // Admin stats query
  const { data: adminStats, isLoading: adminStatsLoading } = useQuery({
    queryKey: ["/api/admin/stats"],
    enabled: user?.role === "admin",
  });

  // Admin orders query
  const { data: adminOrders, isLoading: adminOrdersLoading } = useQuery({
    queryKey: ["/api/admin/orders"],
    enabled: user?.role === "admin",
  });

  // Admin support tickets query
  const { data: adminTickets, isLoading: adminTicketsLoading } = useQuery({
    queryKey: ["/api/admin/support-tickets"],
    enabled: user?.role === "admin",
  });

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case "processing":
      case "in_progress":
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
      case "resolved":
        return "text-green-400 bg-green-400/10";
      case "processing":
      case "in_progress":
        return "text-yellow-400 bg-yellow-400/10";
      case "cancelled":
        return "text-red-400 bg-red-400/10";
      default:
        return "text-gray-400 bg-gray-400/10";
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

  // Filter and search functions
  const filteredOrders = adminOrders?.filter((order: Order & { user: User }) => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  const filteredTickets = adminTickets?.filter((ticket: SupportTicket & { user: User }) => {
    const matchesSearch = ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-6 bg-black">
      <div className="max-w-screen-xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Admin <span className="gradient-text">Panel</span>
          </h1>
          <p className="text-lg text-gray-400">
            Manage orders, users, and system settings.
          </p>
        </div>

        {/* Admin Stats */}
        {adminStatsLoading ? (
          <div className="flex justify-center mb-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="grid md:grid-cols-5 gap-6 mb-12">
            <Card className="dashboard-stat">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl gradient-text mb-2">{adminStats?.totalOrders || 0}</div>
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
                    <div className="text-3xl gradient-text mb-2">{adminStats?.activeServices || 0}</div>
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
                    <div className="text-3xl gradient-text mb-2">${adminStats?.totalRevenue || 0}</div>
                    <div className="text-gray-400">Total Revenue</div>
                  </div>
                  <DollarSign className="h-8 w-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="dashboard-stat">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl gradient-text mb-2">{adminStats?.openTickets || 0}</div>
                    <div className="text-gray-400">Open Tickets</div>
                  </div>
                  <Headphones className="h-8 w-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="dashboard-stat">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl gradient-text mb-2">99.8%</div>
                    <div className="text-gray-400">System Uptime</div>
                  </div>
                  <BarChart3 className="h-8 w-8 text-orange-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Admin Tabs */}
        <Tabs defaultValue="orders" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800">
            <TabsTrigger value="orders" className="flex items-center space-x-2">
              <Package className="h-4 w-4" />
              <span>Orders</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Users</span>
            </TabsTrigger>
            <TabsTrigger value="support" className="flex items-center space-x-2">
              <Headphones className="h-4 w-4" />
              <span>Support</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Orders Management */}
          <TabsContent value="orders" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Order Management</h2>
              <div className="flex space-x-2">
                <Button className="btn-secondary">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex space-x-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search orders by ID, customer email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input pl-10"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="form-input"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {adminOrdersLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner size="lg" />
              </div>
            ) : filteredOrders.length > 0 ? (
              <div className="space-y-4">
                {filteredOrders.map((order: Order & { user: User }) => (
                  <Card key={order.id} className="admin-card">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">#{order.orderNumber}</h3>
                          <p className="text-gray-400">
                            Customer: {order.user?.email || "Unknown"}
                          </p>
                          <p className="text-gray-400">
                            Placed: {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(order.status)}
                          <Badge className={`capitalize ${getStatusColor(order.status)}`}>
                            {order.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <h4 className="font-medium mb-2">Services:</h4>
                          <ul className="text-gray-400 space-y-1">
                            {order.items?.map((item) => (
                              <li key={item.id}>
                                • {item.service.name} (${parseFloat(item.unitPrice).toFixed(2)})
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Payment:</h4>
                          <div className="text-gray-400">
                            <div>Method: {order.paymentMethod || "Not specified"}</div>
                            <div>Status: {order.paymentStatus || "Pending"}</div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Total:</h4>
                          <div className="text-2xl font-bold gradient-text">
                            ${parseFloat(order.totalAmount).toFixed(2)}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                        <span className="text-sm text-gray-400">
                          Updated: {new Date(order.updatedAt).toLocaleDateString()}
                        </span>
                        <div className="space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Button>
                          <Button size="sm" className="btn-secondary">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="admin-card">
                <CardContent className="p-12 text-center">
                  <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Orders Found</h3>
                  <p className="text-gray-400">
                    {searchTerm || statusFilter !== "all" 
                      ? "No orders match your search criteria."
                      : "No orders have been placed yet."
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Users Management */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">User Management</h2>
              <Button className="btn-primary">
                <Users className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </div>

            <Card className="admin-card">
              <CardContent className="p-12 text-center">
                <Users className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">User Management</h3>
                <p className="text-gray-400">
                  User management features are coming soon. Currently showing basic user data from orders.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Support Management */}
          <TabsContent value="support" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Support Management</h2>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="form-input"
              >
                <option value="all">All Tickets</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {adminTicketsLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner size="lg" />
              </div>
            ) : filteredTickets.length > 0 ? (
              <div className="space-y-4">
                {filteredTickets.map((ticket: SupportTicket & { user: User }) => (
                  <Card key={ticket.id} className="admin-card">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">#{ticket.ticketNumber}</h3>
                          <p className="text-xl font-medium mb-1">{ticket.subject}</p>
                          <p className="text-gray-400">
                            Customer: {ticket.user?.email || "Unknown"}
                          </p>
                          <p className="text-gray-400">
                            Created: {new Date(ticket.createdAt).toLocaleDateString()}
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

                      <p className="text-gray-300 mb-4 line-clamp-2">{ticket.description}</p>

                      <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                        <span className="text-sm text-gray-400">
                          Assigned to: {ticket.assignedTo || "Unassigned"}
                        </span>
                        <div className="space-x-2">
                          <Button variant="outline" size="sm">
                            Assign
                          </Button>
                          <Button size="sm" className="btn-primary">
                            <Mail className="mr-2 h-4 w-4" />
                            Reply
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="admin-card">
                <CardContent className="p-12 text-center">
                  <Headphones className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Tickets Found</h3>
                  <p className="text-gray-400">
                    {statusFilter !== "all" 
                      ? "No tickets match the selected status."
                      : "No support tickets have been created yet."
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-semibold">System Settings</h2>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="admin-card">
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Site Name</label>
                      <Input value="Fuzz Labs" className="form-input" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Contact Email</label>
                      <Input value="support@fuzzlabs.com" className="form-input" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Default Currency</label>
                      <select className="form-input w-full">
                        <option>USD</option>
                        <option>EUR</option>
                        <option>GBP</option>
                        <option>INR</option>
                      </select>
                    </div>
                    <Button className="btn-primary">Save Changes</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="admin-card">
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gray-800 rounded border border-gray-700">
                      <div>
                        <div className="font-medium">Two-Factor Authentication</div>
                        <div className="text-sm text-gray-400">Require 2FA for admin accounts</div>
                      </div>
                      <input type="checkbox" className="w-4 h-4 text-green-400" defaultChecked />
                    </div>

                    <div className="flex justify-between items-center p-4 bg-gray-800 rounded border border-gray-700">
                      <div>
                        <div className="font-medium">Session Timeout</div>
                        <div className="text-sm text-gray-400">Auto-logout after inactivity</div>
                      </div>
                      <select className="form-input">
                        <option>30 minutes</option>
                        <option>1 hour</option>
                        <option>2 hours</option>
                        <option>Never</option>
                      </select>
                    </div>

                    <div className="flex justify-between items-center p-4 bg-gray-800 rounded border border-gray-700">
                      <div>
                        <div className="font-medium">API Rate Limiting</div>
                        <div className="text-sm text-gray-400">Requests per minute limit</div>
                      </div>
                      <Input defaultValue="100" className="form-input w-20" />
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
