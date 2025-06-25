import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertOrderSchema, insertOrderItemSchema } from "@shared/schema";
import { z } from "zod";

// UPI Payment Configuration
const UPI_ID = "arhaanjain@fam";

const checkoutSchema = z.object({
  items: z.array(z.object({
    serviceId: z.number(),
    quantity: z.number().min(1),
  })),
  billingInfo: z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    discordUsername: z.string().optional(),
  }),
  paymentMethod: z.enum(['upi']),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Service routes
  app.get('/api/services', async (req, res) => {
    try {
      const services = await storage.getServices();
      res.json(services);
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  app.get('/api/service-categories', async (req, res) => {
    try {
      const categories = await storage.getServiceCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching service categories:", error);
      res.status(500).json({ message: "Failed to fetch service categories" });
    }
  });

  // Order routes
  app.get('/api/orders', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const orders = await storage.getUserOrders(userId);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get('/api/orders/:orderNumber', isAuthenticated, async (req: any, res) => {
    try {
      const { orderNumber } = req.params;
      const order = await storage.getOrderByNumber(orderNumber);

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Check if user owns this order or is admin
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (order.userId !== userId && user?.role !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
      }

      res.json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  // Checkout routes
  app.post('/api/checkout', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { items, billingInfo, paymentMethod } = checkoutSchema.parse(req.body);

      // Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

      // Calculate total
      let totalAmount = 0;
      const orderItems = [];

      for (const item of items) {
        const service = await storage.getServiceById(item.serviceId);
        if (!service) {
          return res.status(400).json({ message: `Service ${item.serviceId} not found` });
        }

        const itemTotal = parseFloat(service.price) * item.quantity;
        totalAmount += itemTotal;

        orderItems.push({
          serviceId: service.id,
          quantity: item.quantity,
          unitPrice: service.price,
          totalPrice: itemTotal.toString(),
        });
      }

      // Create order
      const order = await storage.createOrder({
        userId,
        orderNumber,
        totalAmount: totalAmount.toString(),
        currency: 'INR',
        paymentMethod: 'upi',
        billingInfo: billingInfo as any,
        status: 'pending',
        paymentStatus: 'pending',
      });

      // Add order items
      for (const item of orderItems) {
        await storage.addOrderItem({
          ...item,
          orderId: order.id,
        });
      }

      res.json({
        orderId: order.id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        upiId: UPI_ID
      });
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  // UPI payment routes
  app.post("/api/upi-payment-info", isAuthenticated, async (req: any, res) => {
    try {
      const { orderId } = req.body;
      const order = await storage.getOrderById(orderId);

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      const userId = req.user.claims.sub;
      if (order.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Generate UPI payment URL
      const amount = parseFloat(order.totalAmount);
      const upiUrl = `upi://pay?pa=${UPI_ID}&pn=Fuzz%20Labs&am=${amount}&cu=INR&tn=Payment%20for%20Order%20${order.orderNumber}`;

      res.json({
        upiId: UPI_ID,
        upiUrl: upiUrl,
        amount: amount,
        orderNumber: order.orderNumber,
        qrCodeData: upiUrl
      });
    } catch (error: any) {
      console.error("Error getting UPI payment info:", error);
      res.status(500).json({ message: "Error getting payment info: " + error.message });
    }
  });

  app.post("/api/confirm-upi-payment", isAuthenticated, async (req: any, res) => {
    try {
      const { orderId, transactionId } = req.body;
      const order = await storage.getOrderById(orderId);

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      const userId = req.user.claims.sub;
      if (order.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Update order with transaction ID and mark as processing
      await storage.updateOrderPaymentIntent(order.id, transactionId);
      await storage.updateOrderStatus(order.id, 'processing', 'pending_verification');

      res.json({
        success: true,
        message: "Payment submitted for verification. We'll update your order status once confirmed."
      });
    } catch (error: any) {
      console.error("Error confirming UPI payment:", error);
      res.status(500).json({ message: "Error confirming payment: " + error.message });
    }
  });

  // Support ticket routes
  app.get('/api/support-tickets', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const tickets = await storage.getUserSupportTickets(userId);
      res.json(tickets);
    } catch (error) {
      console.error("Error fetching support tickets:", error);
      res.status(500).json({ message: "Failed to fetch support tickets" });
    }
  });

  app.post('/api/support-tickets', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { subject, description, priority = 'medium' } = req.body;

      const ticketNumber = `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 3).toUpperCase()}`;

      const ticket = await storage.createSupportTicket({
        userId,
        ticketNumber,
        subject,
        description,
        priority,
        status: 'open',
      });

      res.json(ticket);
    } catch (error) {
      console.error("Error creating support ticket:", error);
      res.status(500).json({ message: "Failed to create support ticket" });
    }
  });

  // Dashboard stats
  app.get('/api/dashboard-stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getDashboardStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Admin routes
  app.get('/api/admin/orders', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);

      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { limit = 50, offset = 0 } = req.query;
      const orders = await storage.getAllOrders(Number(limit), Number(offset));
      res.json(orders);
    } catch (error) {
      console.error("Error fetching admin orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get('/api/admin/support-tickets', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);

      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { limit = 50, offset = 0 } = req.query;
      const tickets = await storage.getAllSupportTickets(Number(limit), Number(offset));
      res.json(tickets);
    } catch (error) {
      console.error("Error fetching admin support tickets:", error);
      res.status(500).json({ message: "Failed to fetch support tickets" });
    }
  });

  app.get('/api/admin/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);

      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Failed to fetch admin stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
