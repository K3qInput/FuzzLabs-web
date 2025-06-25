export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  isRecurring?: boolean;
  recurringPeriod?: string;
}

export interface User {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  role?: string;
}

export interface Service {
  id: number;
  categoryId?: number;
  name: string;
  description?: string;
  price: string;
  isRecurring: boolean;
  recurringPeriod?: string;
  isActive: boolean;
  metadata?: any;
  category?: {
    id: number;
    name: string;
    description?: string;
    icon?: string;
  };
}

export interface Order {
  id: number;
  userId: string;
  orderNumber: string;
  status: string;
  totalAmount: string;
  currency: string;
  paymentStatus: string;
  paymentMethod?: string;
  paymentIntentId?: string;
  billingInfo?: any;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  orderId: number;
  serviceId: number;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  metadata?: any;
  service: Service;
}

export interface SupportTicket {
  id: number;
  userId: string;
  ticketNumber: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationType {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}
