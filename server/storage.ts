import {
  users,
  services,
  serviceCategories,
  orders,
  orderItems,
  supportTickets,
  supportTicketMessages,
  type User,
  type UpsertUser,
  type Service,
  type ServiceCategory,
  type Order,
  type OrderItem,
  type SupportTicket,
  type SupportTicketMessage,
  type InsertService,
  type InsertOrder,
  type InsertOrderItem,
  type InsertSupportTicket,
  type InsertSupportTicketMessage,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, like, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserStripeInfo(userId: string, customerId: string, subscriptionId?: string): Promise<User>;
  
  // Service operations
  getServiceCategories(): Promise<ServiceCategory[]>;
  getServices(): Promise<(Service & { category: ServiceCategory | null })[]>;
  getServiceById(id: number): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, service: Partial<InsertService>): Promise<Service>;
  deleteService(id: number): Promise<void>;
  
  // Order operations
  createOrder(order: InsertOrder): Promise<Order>;
  addOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  getOrderById(id: number): Promise<(Order & { items: (OrderItem & { service: Service })[] }) | undefined>;
  getOrderByNumber(orderNumber: string): Promise<(Order & { items: (OrderItem & { service: Service })[] }) | undefined>;
  getUserOrders(userId: string): Promise<(Order & { items: (OrderItem & { service: Service })[] })[]>;
  updateOrderStatus(id: number, status: string, paymentStatus?: string): Promise<Order>;
  updateOrderPaymentIntent(id: number, paymentIntentId: string): Promise<Order>;
  getAllOrders(limit?: number, offset?: number): Promise<(Order & { user: User, items: (OrderItem & { service: Service })[] })[]>;
  
  // Support operations
  createSupportTicket(ticket: InsertSupportTicket): Promise<SupportTicket>;
  addSupportTicketMessage(message: InsertSupportTicketMessage): Promise<SupportTicketMessage>;
  getUserSupportTickets(userId: string): Promise<SupportTicket[]>;
  getAllSupportTickets(limit?: number, offset?: number): Promise<(SupportTicket & { user: User })[]>;
  updateSupportTicketStatus(id: number, status: string): Promise<SupportTicket>;
  
  // Analytics
  getDashboardStats(userId?: string): Promise<{
    totalOrders: number;
    totalRevenue: number;
    activeServices: number;
    openTickets: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserStripeInfo(userId: string, customerId: string, subscriptionId?: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Service operations
  async getServiceCategories(): Promise<ServiceCategory[]> {
    return await db.select().from(serviceCategories).orderBy(serviceCategories.name);
  }

  async getServices(): Promise<(Service & { category: ServiceCategory | null })[]> {
    return await db
      .select()
      .from(services)
      .leftJoin(serviceCategories, eq(services.categoryId, serviceCategories.id))
      .where(eq(services.isActive, true))
      .orderBy(serviceCategories.name, services.name)
      .then(rows => rows.map(row => ({
        ...row.services,
        category: row.service_categories
      })));
  }

  async getServiceById(id: number): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service;
  }

  async createService(service: InsertService): Promise<Service> {
    const [newService] = await db.insert(services).values(service).returning();
    return newService;
  }

  async updateService(id: number, service: Partial<InsertService>): Promise<Service> {
    const [updatedService] = await db
      .update(services)
      .set({ ...service, updatedAt: new Date() })
      .where(eq(services.id, id))
      .returning();
    return updatedService;
  }

  async deleteService(id: number): Promise<void> {
    await db.delete(services).where(eq(services.id, id));
  }

  // Order operations
  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db.insert(orders).values(order).returning();
    return newOrder;
  }

  async addOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    const [newOrderItem] = await db.insert(orderItems).values(orderItem).returning();
    return newOrderItem;
  }

  async getOrderById(id: number): Promise<(Order & { items: (OrderItem & { service: Service })[] }) | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    if (!order) return undefined;

    const items = await db
      .select()
      .from(orderItems)
      .leftJoin(services, eq(orderItems.serviceId, services.id))
      .where(eq(orderItems.orderId, id))
      .then(rows => rows.map(row => ({
        ...row.order_items,
        service: row.services!
      })));

    return { ...order, items };
  }

  async getOrderByNumber(orderNumber: string): Promise<(Order & { items: (OrderItem & { service: Service })[] }) | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber));
    if (!order) return undefined;

    const items = await db
      .select()
      .from(orderItems)
      .leftJoin(services, eq(orderItems.serviceId, services.id))
      .where(eq(orderItems.orderId, order.id))
      .then(rows => rows.map(row => ({
        ...row.order_items,
        service: row.services!
      })));

    return { ...order, items };
  }

  async getUserOrders(userId: string): Promise<(Order & { items: (OrderItem & { service: Service })[] })[]> {
    const userOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));

    const ordersWithItems = await Promise.all(
      userOrders.map(async (order) => {
        const items = await db
          .select()
          .from(orderItems)
          .leftJoin(services, eq(orderItems.serviceId, services.id))
          .where(eq(orderItems.orderId, order.id))
          .then(rows => rows.map(row => ({
            ...row.order_items,
            service: row.services!
          })));

        return { ...order, items };
      })
    );

    return ordersWithItems;
  }

  async updateOrderStatus(id: number, status: string, paymentStatus?: string): Promise<Order> {
    const updateData: any = { status, updatedAt: new Date() };
    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus;
    }

    const [updatedOrder] = await db
      .update(orders)
      .set(updateData)
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder;
  }

  async updateOrderPaymentIntent(id: number, paymentIntentId: string): Promise<Order> {
    const [updatedOrder] = await db
      .update(orders)
      .set({ paymentIntentId, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder;
  }

  async getAllOrders(limit = 50, offset = 0): Promise<(Order & { user: User, items: (OrderItem & { service: Service })[] })[]> {
    const allOrders = await db
      .select()
      .from(orders)
      .leftJoin(users, eq(orders.userId, users.id))
      .orderBy(desc(orders.createdAt))
      .limit(limit)
      .offset(offset)
      .then(rows => rows.map(row => ({
        ...row.orders,
        user: row.users!
      })));

    const ordersWithItems = await Promise.all(
      allOrders.map(async (order) => {
        const items = await db
          .select()
          .from(orderItems)
          .leftJoin(services, eq(orderItems.serviceId, services.id))
          .where(eq(orderItems.orderId, order.id))
          .then(rows => rows.map(row => ({
            ...row.order_items,
            service: row.services!
          })));

        return { ...order, items };
      })
    );

    return ordersWithItems;
  }

  // Support operations
  async createSupportTicket(ticket: InsertSupportTicket): Promise<SupportTicket> {
    const [newTicket] = await db.insert(supportTickets).values(ticket).returning();
    return newTicket;
  }

  async addSupportTicketMessage(message: InsertSupportTicketMessage): Promise<SupportTicketMessage> {
    const [newMessage] = await db.insert(supportTicketMessages).values(message).returning();
    return newMessage;
  }

  async getUserSupportTickets(userId: string): Promise<SupportTicket[]> {
    return await db
      .select()
      .from(supportTickets)
      .where(eq(supportTickets.userId, userId))
      .orderBy(desc(supportTickets.createdAt));
  }

  async getAllSupportTickets(limit = 50, offset = 0): Promise<(SupportTicket & { user: User })[]> {
    return await db
      .select()
      .from(supportTickets)
      .leftJoin(users, eq(supportTickets.userId, users.id))
      .orderBy(desc(supportTickets.createdAt))
      .limit(limit)
      .offset(offset)
      .then(rows => rows.map(row => ({
        ...row.support_tickets,
        user: row.users!
      })));
  }

  async updateSupportTicketStatus(id: number, status: string): Promise<SupportTicket> {
    const [updatedTicket] = await db
      .update(supportTickets)
      .set({ status, updatedAt: new Date() })
      .where(eq(supportTickets.id, id))
      .returning();
    return updatedTicket;
  }

  // Analytics
  async getDashboardStats(userId?: string): Promise<{
    totalOrders: number;
    totalRevenue: number;
    activeServices: number;
    openTickets: number;
  }> {
    const where = userId ? eq(orders.userId, userId) : undefined;
    
    const [orderStats] = await db
      .select({
        totalOrders: sql<number>`count(*)`.mapWith(Number),
        totalRevenue: sql<number>`coalesce(sum(${orders.totalAmount}), 0)`.mapWith(Number),
      })
      .from(orders)
      .where(where);

    const [serviceStats] = await db
      .select({
        activeServices: sql<number>`count(*)`.mapWith(Number),
      })
      .from(services)
      .where(eq(services.isActive, true));

    const ticketWhere = userId ? eq(supportTickets.userId, userId) : eq(supportTickets.status, 'open');
    const [ticketStats] = await db
      .select({
        openTickets: sql<number>`count(*)`.mapWith(Number),
      })
      .from(supportTickets)
      .where(ticketWhere);

    return {
      totalOrders: orderStats.totalOrders,
      totalRevenue: orderStats.totalRevenue,
      activeServices: serviceStats.activeServices,
      openTickets: ticketStats.openTickets,
    };
  }
}

export const storage = new DatabaseStorage();
