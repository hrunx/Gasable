// Demo data for the supplier portal
// This data will be used when a user is in demo mode

import { format, subDays, addDays } from 'date-fns';

// Helper to generate dates relative to today
const today = new Date();
const formatDate = (date: Date) => format(date, 'yyyy-MM-dd');
const formatDateTime = (date: Date) => format(date, 'yyyy-MM-dd HH:mm:ss');

// Demo company data
export const demoCompany = {
  id: 'demo-company-id',
  name: 'Demo Energy Solutions',
  cr_number: 'CR123456789',
  vat_number: 'VAT987654321',
  phone: '+966-123-456-7890',
  email: 'info@demo-energy.com',
  website: 'www.demo-energy.com',
  address: '123 Demo Street, Business District',
  city: 'Riyadh',
  country: 'Saudi Arabia',
  logo_url: null,
  subscription_tier: 'advanced',
  subscription_status: 'active',
  subscription_start_date: formatDate(subDays(today, 60)),
  subscription_end_date: formatDate(addDays(today, 305)),
  created_at: formatDateTime(subDays(today, 60)),
  updated_at: formatDateTime(subDays(today, 5))
};

// Demo user data
export const demoUser = {
  id: 'demo-user-id',
  email: 'demo@gasable.com',
  full_name: 'Demo User',
  avatar_url: null,
  role: 'supplier',
  status: 'active',
  company_id: demoCompany.id,
  created_at: formatDateTime(subDays(today, 60)),
  updated_at: formatDateTime(subDays(today, 60))
};

// Demo stores/branches
export const demoStores = [
  {
    id: 'demo-store-1',
    company_id: demoCompany.id,
    name: 'Riyadh Central Hub',
    type: 'warehouse',
    store_category: 'physical' as const,
    address: '123 King Fahd Road',
    city: 'Riyadh',
    country: 'Saudi Arabia',
    location: null, // Would be a geography point in real data
    status: 'active',
    services: { pickup: true, delivery: true },
    working_hours: {
      weekdays: { open: '08:00', close: '20:00' },
      weekends: { open: '10:00', close: '18:00' },
      is24Hours: false
    },
    created_at: formatDateTime(subDays(today, 58)),
    updated_at: formatDateTime(subDays(today, 10))
  },
  {
    id: 'demo-store-2',
    company_id: demoCompany.id,
    name: 'Jeddah Distribution Center',
    type: 'distribution',
    store_category: 'physical' as const,
    address: '456 Port Road',
    city: 'Jeddah',
    country: 'Saudi Arabia',
    location: null,
    status: 'active',
    services: { pickup: true, delivery: true },
    working_hours: {
      weekdays: { open: '08:00', close: '20:00' },
      weekends: { open: '10:00', close: '18:00' },
      is24Hours: false
    },
    created_at: formatDateTime(subDays(today, 45)),
    updated_at: formatDateTime(subDays(today, 8))
  },
  {
    id: 'demo-store-3',
    company_id: demoCompany.id,
    name: 'Dammam Retail Store',
    type: 'retail',
    store_category: 'cloud' as const,
    address: '789 Coastal Road',
    city: 'Dammam',
    country: 'Saudi Arabia',
    location: null,
    status: 'pending',
    services: { pickup: true, delivery: false },
    working_hours: {
      weekdays: { open: '09:00', close: '21:00' },
      weekends: { open: '10:00', close: '22:00' },
      is24Hours: false
    },
    created_at: formatDateTime(subDays(today, 5)),
    updated_at: formatDateTime(subDays(today, 5))
  }
];

// Demo products
export const demoProducts = [
  {
    id: 'demo-product-1',
    company_id: demoCompany.id,
    name: 'Industrial Gas Tank',
    sku: 'IGT-001',
    description: 'High-capacity industrial gas tank for commercial use',
    type: 'gas',
    category: 'industrial',
    brand: 'GasTech',
    model: 'GT-500',
    status: 'active',
    created_at: formatDateTime(subDays(today, 50)),
    updated_at: formatDateTime(subDays(today, 15))
  },
  {
    id: 'demo-product-2',
    company_id: demoCompany.id,
    name: 'Premium Gas Cylinder',
    sku: 'PGC-002',
    description: 'Premium residential gas cylinder with enhanced safety features',
    type: 'gas',
    category: 'residential',
    brand: 'GasTech',
    model: 'GT-50',
    status: 'active',
    created_at: formatDateTime(subDays(today, 48)),
    updated_at: formatDateTime(subDays(today, 12))
  },
  {
    id: 'demo-product-3',
    company_id: demoCompany.id,
    name: 'Commercial Gas Setup',
    sku: 'CGS-003',
    description: 'Complete commercial gas installation setup',
    type: 'equipment',
    category: 'commercial',
    brand: 'GasTech',
    model: 'CS-100',
    status: 'active',
    created_at: formatDateTime(subDays(today, 40)),
    updated_at: formatDateTime(subDays(today, 10))
  },
  {
    id: 'demo-product-4',
    company_id: demoCompany.id,
    name: 'Safety Valve',
    sku: 'SFV-004',
    description: 'High-quality safety valve for gas systems',
    type: 'accessory',
    category: 'safety',
    brand: 'SafeGas',
    model: 'SV-200',
    status: 'active',
    created_at: formatDateTime(subDays(today, 35)),
    updated_at: formatDateTime(subDays(today, 8))
  },
  {
    id: 'demo-product-5',
    company_id: demoCompany.id,
    name: 'Pressure Gauge',
    sku: 'PRG-005',
    description: 'Precision pressure gauge for gas systems',
    type: 'accessory',
    category: 'measurement',
    brand: 'SafeGas',
    model: 'PG-100',
    status: 'draft',
    created_at: formatDateTime(subDays(today, 3)),
    updated_at: formatDateTime(subDays(today, 3))
  }
];

// Demo product attributes
export const demoProductAttributes = [
  // For Industrial Gas Tank
  {
    id: 'demo-attr-1',
    product_id: 'demo-product-1',
    attribute_type: 'mechanical',
    name: 'Capacity',
    value: '500',
    unit: 'L',
    created_at: formatDateTime(subDays(today, 50))
  },
  {
    id: 'demo-attr-2',
    product_id: 'demo-product-1',
    attribute_type: 'mechanical',
    name: 'Pressure Rating',
    value: '200',
    unit: 'bar',
    created_at: formatDateTime(subDays(today, 50))
  },
  {
    id: 'demo-attr-3',
    product_id: 'demo-product-1',
    attribute_type: 'physical',
    name: 'Material',
    value: 'Stainless Steel',
    unit: '',
    created_at: formatDateTime(subDays(today, 50))
  },
  // For Premium Gas Cylinder
  {
    id: 'demo-attr-4',
    product_id: 'demo-product-2',
    attribute_type: 'mechanical',
    name: 'Capacity',
    value: '50',
    unit: 'L',
    created_at: formatDateTime(subDays(today, 48))
  },
  {
    id: 'demo-attr-5',
    product_id: 'demo-product-2',
    attribute_type: 'mechanical',
    name: 'Pressure Rating',
    value: '150',
    unit: 'bar',
    created_at: formatDateTime(subDays(today, 48))
  },
  {
    id: 'demo-attr-6',
    product_id: 'demo-product-2',
    attribute_type: 'physical',
    name: 'Material',
    value: 'Aluminum',
    unit: '',
    created_at: formatDateTime(subDays(today, 48))
  }
];

// Demo product images
export const demoProductImages = [
  {
    id: 'demo-img-1',
    product_id: 'demo-product-1',
    url: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=800',
    is_primary: true,
    created_at: formatDateTime(subDays(today, 50))
  },
  {
    id: 'demo-img-2',
    product_id: 'demo-product-1',
    url: 'https://images.unsplash.com/photo-1597773150796-e5c14ebecbf5?w=800',
    is_primary: false,
    created_at: formatDateTime(subDays(today, 50))
  },
  {
    id: 'demo-img-3',
    product_id: 'demo-product-2',
    url: 'https://images.unsplash.com/photo-1597773150796-e5c14ebecbf5?w=800',
    is_primary: true,
    created_at: formatDateTime(subDays(today, 48))
  }
];

// Demo delivery zones
export const demoDeliveryZones = [
  {
    id: 'demo-zone-1',
    company_id: demoCompany.id,
    name: 'Riyadh Region',
    base_fee: 15,
    min_order_value: 100,
    estimated_time: '1-2 days',
    created_at: formatDateTime(subDays(today, 55)),
    updated_at: formatDateTime(subDays(today, 55))
  },
  {
    id: 'demo-zone-2',
    company_id: demoCompany.id,
    name: 'Jeddah Region',
    base_fee: 20,
    min_order_value: 150,
    estimated_time: '2-3 days',
    created_at: formatDateTime(subDays(today, 55)),
    updated_at: formatDateTime(subDays(today, 55))
  },
  {
    id: 'demo-zone-3',
    company_id: demoCompany.id,
    name: 'Eastern Province',
    base_fee: 25,
    min_order_value: 200,
    estimated_time: '2-4 days',
    created_at: formatDateTime(subDays(today, 55)),
    updated_at: formatDateTime(subDays(today, 55))
  }
];

// Demo product pricing
export const demoProductPricing = [
  // Industrial Gas Tank - Riyadh
  {
    id: 'demo-price-1',
    product_id: 'demo-product-1',
    zone_id: 'demo-zone-1',
    base_price: 450,
    b2b_price: 399.99,
    b2c_price: 499.99,
    currency: 'SAR',
    min_order_quantity: 1,
    vat_included: true,
    created_at: formatDateTime(subDays(today, 50)),
    updated_at: formatDateTime(subDays(today, 15))
  },
  // Industrial Gas Tank - Jeddah
  {
    id: 'demo-price-2',
    product_id: 'demo-product-1',
    zone_id: 'demo-zone-2',
    base_price: 460,
    b2b_price: 409.99,
    b2c_price: 509.99,
    currency: 'SAR',
    min_order_quantity: 1,
    vat_included: true,
    created_at: formatDateTime(subDays(today, 50)),
    updated_at: formatDateTime(subDays(today, 15))
  },
  // Premium Gas Cylinder - Riyadh
  {
    id: 'demo-price-3',
    product_id: 'demo-product-2',
    zone_id: 'demo-zone-1',
    base_price: 85,
    b2b_price: 79.99,
    b2c_price: 99.99,
    currency: 'SAR',
    min_order_quantity: 1,
    vat_included: true,
    created_at: formatDateTime(subDays(today, 48)),
    updated_at: formatDateTime(subDays(today, 12))
  }
];

// Demo customers
export const demoCustomers = [
  {
    id: 'demo-customer-1',
    name: 'Acme Industries',
    type: 'B2B',
    email: 'orders@acme.com',
    phone: '+966-123-456-7890',
    company: 'Acme Industries Ltd.',
    address: '123 Industrial Park, Business District',
    city: 'Riyadh',
    country: 'Saudi Arabia',
    created_at: formatDateTime(subDays(today, 40)),
    updated_at: formatDateTime(subDays(today, 40))
  },
  {
    id: 'demo-customer-2',
    name: 'John Smith',
    type: 'B2C',
    email: 'john.smith@example.com',
    phone: '+966-123-456-7891',
    company: null,
    address: '456 Residential St, Housing District',
    city: 'Riyadh',
    country: 'Saudi Arabia',
    created_at: formatDateTime(subDays(today, 35)),
    updated_at: formatDateTime(subDays(today, 35))
  },
  {
    id: 'demo-customer-3',
    name: 'Green Energy Corp',
    type: 'B2B',
    email: 'orders@greenenergy.com',
    phone: '+966-123-456-7892',
    company: 'Green Energy Corporation',
    address: '789 Green Street, Eco District',
    city: 'Jeddah',
    country: 'Saudi Arabia',
    created_at: formatDateTime(subDays(today, 30)),
    updated_at: formatDateTime(subDays(today, 30))
  }
];

// Demo orders
export const demoOrders = [
  {
    id: 'demo-order-1',
    order_number: 'ORD-2024-001',
    company_id: demoCompany.id,
    customer_id: 'demo-customer-1',
    status: 'completed',
    total_amount: 2499.95,
    payment_status: 'paid',
    payment_method: 'Bank Transfer',
    payment_transaction_id: 'TXN-123456',
    delivery_method: 'delivery',
    delivery_status: 'delivered',
    delivery_address: '123 Industrial Park, Business District',
    delivery_city: 'Riyadh',
    delivery_country: 'Saudi Arabia',
    delivery_notes: 'Delivery to loading dock only',
    delivery_tracking: 'TRK-123456',
    delivery_carrier: 'Own Fleet',
    priority: 'high',
    notes: 'Customer requested expedited shipping',
    tags: ['bulk order', 'corporate'],
    created_at: formatDateTime(subDays(today, 25)),
    updated_at: formatDateTime(subDays(today, 22))
  },
  {
    id: 'demo-order-2',
    order_number: 'ORD-2024-002',
    company_id: demoCompany.id,
    customer_id: 'demo-customer-2',
    status: 'completed',
    total_amount: 199.98,
    payment_status: 'paid',
    payment_method: 'Credit Card',
    payment_transaction_id: 'TXN-123457',
    delivery_method: 'pickup',
    delivery_status: 'completed',
    delivery_address: null,
    delivery_city: null,
    delivery_country: null,
    delivery_notes: null,
    delivery_tracking: null,
    delivery_carrier: null,
    priority: 'medium',
    notes: null,
    tags: ['residential'],
    created_at: formatDateTime(subDays(today, 20)),
    updated_at: formatDateTime(subDays(today, 18))
  },
  {
    id: 'demo-order-3',
    order_number: 'ORD-2024-003',
    company_id: demoCompany.id,
    customer_id: 'demo-customer-3',
    status: 'processing',
    total_amount: 7999.90,
    payment_status: 'pending',
    payment_method: 'Bank Transfer',
    payment_transaction_id: null,
    delivery_method: 'delivery',
    delivery_status: 'processing',
    delivery_address: '789 Green Street, Eco District',
    delivery_city: 'Jeddah',
    delivery_country: 'Saudi Arabia',
    delivery_notes: 'Installation team required',
    delivery_tracking: 'TRK-123458',
    delivery_carrier: 'Third-party Logistics',
    priority: 'medium',
    notes: null,
    tags: ['installation', 'corporate'],
    created_at: formatDateTime(subDays(today, 2)),
    updated_at: formatDateTime(subDays(today, 1))
  },
  {
    id: 'demo-order-4',
    order_number: 'ORD-2024-004',
    company_id: demoCompany.id,
    customer_id: 'demo-customer-1',
    status: 'pending',
    total_amount: 1999.96,
    payment_status: 'pending',
    payment_method: null,
    payment_transaction_id: null,
    delivery_method: 'delivery',
    delivery_status: 'pending',
    delivery_address: '123 Industrial Park, Business District',
    delivery_city: 'Riyadh',
    delivery_country: 'Saudi Arabia',
    delivery_notes: null,
    delivery_tracking: null,
    delivery_carrier: 'Own Fleet',
    priority: 'medium',
    notes: null,
    tags: ['corporate'],
    created_at: formatDateTime(subDays(today, 1)),
    updated_at: formatDateTime(subDays(today, 1))
  }
];

// Demo order items
export const demoOrderItems = [
  // Order 1 items
  {
    id: 'demo-item-1',
    order_id: 'demo-order-1',
    product_id: 'demo-product-1',
    quantity: 5,
    unit_price: 499.99,
    total_price: 2499.95,
    created_at: formatDateTime(subDays(today, 25))
  },
  // Order 2 items
  {
    id: 'demo-item-2',
    order_id: 'demo-order-2',
    product_id: 'demo-product-2',
    quantity: 2,
    unit_price: 99.99,
    total_price: 199.98,
    created_at: formatDateTime(subDays(today, 20))
  },
  // Order 3 items
  {
    id: 'demo-item-3',
    order_id: 'demo-order-3',
    product_id: 'demo-product-1',
    quantity: 10,
    unit_price: 499.99,
    total_price: 4999.90,
    created_at: formatDateTime(subDays(today, 2))
  },
  {
    id: 'demo-item-4',
    order_id: 'demo-order-3',
    product_id: 'demo-product-3',
    quantity: 3,
    unit_price: 1000,
    total_price: 3000,
    created_at: formatDateTime(subDays(today, 2))
  },
  // Order 4 items
  {
    id: 'demo-item-5',
    order_id: 'demo-order-4',
    product_id: 'demo-product-1',
    quantity: 4,
    unit_price: 499.99,
    total_price: 1999.96,
    created_at: formatDateTime(subDays(today, 1))
  }
];

// Demo delivery vehicles
export const demoDeliveryVehicles = [
  {
    id: 'demo-vehicle-1',
    company_id: demoCompany.id,
    number: 'TRK-001',
    type: 'truck',
    capacity: 2000,
    fuel_type: 'Diesel',
    status: 'active',
    created_at: formatDateTime(subDays(today, 55)),
    updated_at: formatDateTime(subDays(today, 55))
  },
  {
    id: 'demo-vehicle-2',
    company_id: demoCompany.id,
    number: 'VAN-002',
    type: 'van',
    capacity: 1000,
    fuel_type: 'Gasoline',
    status: 'active',
    created_at: formatDateTime(subDays(today, 50)),
    updated_at: formatDateTime(subDays(today, 50))
  },
  {
    id: 'demo-vehicle-3',
    company_id: demoCompany.id,
    number: 'TRK-003',
    type: 'truck',
    capacity: 2500,
    fuel_type: 'Diesel',
    status: 'maintenance',
    created_at: formatDateTime(subDays(today, 45)),
    updated_at: formatDateTime(subDays(today, 10))
  }
];

// Demo delivery drivers
export const demoDeliveryDrivers = [
  {
    id: 'demo-driver-1',
    company_id: demoCompany.id,
    name: 'Mohammed Ali',
    license_number: 'DL-12345',
    phone: '+966-123-456-7893',
    status: 'available',
    vehicle_id: 'demo-vehicle-1',
    created_at: formatDateTime(subDays(today, 54)),
    updated_at: formatDateTime(subDays(today, 54))
  },
  {
    id: 'demo-driver-2',
    company_id: demoCompany.id,
    name: 'Ahmed Hassan',
    license_number: 'DL-67890',
    phone: '+966-123-456-7894',
    status: 'on_duty',
    vehicle_id: 'demo-vehicle-2',
    created_at: formatDateTime(subDays(today, 49)),
    updated_at: formatDateTime(subDays(today, 1))
  }
];

// Demo support tickets
export const demoSupportTickets = [
  {
    id: 'demo-ticket-1',
    ticket_number: 'TKT-001',
    company_id: demoCompany.id,
    customer_id: 'demo-customer-1',
    title: 'Issue with order delivery',
    description: 'Order #ORD-2024-001 was delivered with one item missing.',
    status: 'resolved',
    priority: 'high',
    category: 'Delivery',
    assignee_id: null,
    response_time: 45,
    resolution_time: 1440, // 24 hours in minutes
    created_at: formatDateTime(subDays(today, 23)),
    updated_at: formatDateTime(subDays(today, 22)),
    resolved_at: formatDateTime(subDays(today, 22))
  },
  {
    id: 'demo-ticket-2',
    ticket_number: 'TKT-002',
    company_id: demoCompany.id,
    customer_id: null,
    title: 'Need help with product pricing',
    description: 'I cannot update the price for my products in the Jeddah region.',
    status: 'open',
    priority: 'medium',
    category: 'Technical Issue',
    assignee_id: null,
    response_time: null,
    resolution_time: null,
    created_at: formatDateTime(subDays(today, 1)),
    updated_at: formatDateTime(subDays(today, 1)),
    resolved_at: null
  }
];

// Demo ticket messages
export const demoTicketMessages = [
  {
    id: 'demo-message-1',
    ticket_id: 'demo-ticket-1',
    sender_id: 'demo-customer-1',
    sender_type: 'customer',
    message: 'Order #ORD-2024-001 was delivered with one item missing. We received 4 tanks instead of 5.',
    attachments: null,
    created_at: formatDateTime(subDays(today, 23))
  },
  {
    id: 'demo-message-2',
    ticket_id: 'demo-ticket-1',
    sender_id: 'demo-user-id',
    sender_type: 'support',
    message: 'Thank you for reporting this issue. We will investigate and get back to you shortly.',
    attachments: null,
    created_at: formatDateTime(subDays(today, 23, 1)) // 1 hour later
  },
  {
    id: 'demo-message-3',
    ticket_id: 'demo-ticket-1',
    sender_id: 'demo-user-id',
    sender_type: 'support',
    message: 'We have confirmed the missing item and will deliver it tomorrow. We apologize for the inconvenience.',
    attachments: null,
    created_at: formatDateTime(subDays(today, 22, 5)) // 5 hours later
  },
  {
    id: 'demo-message-4',
    ticket_id: 'demo-ticket-1',
    sender_id: 'demo-customer-1',
    sender_type: 'customer',
    message: 'Thank you for the quick resolution.',
    attachments: null,
    created_at: formatDateTime(subDays(today, 22, 6)) // 6 hours later
  },
  {
    id: 'demo-message-5',
    ticket_id: 'demo-ticket-2',
    sender_id: 'demo-user-id',
    sender_type: 'customer',
    message: 'I cannot update the price for my products in the Jeddah region. The save button is not working.',
    attachments: null,
    created_at: formatDateTime(subDays(today, 1))
  }
];

// Demo invoices
export const demoInvoices = [
  {
    id: 'demo-invoice-1',
    invoice_number: 'INV-2024-001',
    company_id: demoCompany.id,
    customer_id: 'demo-customer-1',
    order_id: 'demo-order-1',
    amount: 2499.95,
    status: 'paid',
    due_date: formatDate(subDays(today, 15)),
    issued_date: formatDate(subDays(today, 25)),
    paid_date: formatDate(subDays(today, 20)),
    created_at: formatDateTime(subDays(today, 25)),
    updated_at: formatDateTime(subDays(today, 20))
  },
  {
    id: 'demo-invoice-2',
    invoice_number: 'INV-2024-002',
    company_id: demoCompany.id,
    customer_id: 'demo-customer-2',
    order_id: 'demo-order-2',
    amount: 199.98,
    status: 'paid',
    due_date: formatDate(subDays(today, 10)),
    issued_date: formatDate(subDays(today, 20)),
    paid_date: formatDate(subDays(today, 18)),
    created_at: formatDateTime(subDays(today, 20)),
    updated_at: formatDateTime(subDays(today, 18))
  },
  {
    id: 'demo-invoice-3',
    invoice_number: 'INV-2024-003',
    company_id: demoCompany.id,
    customer_id: 'demo-customer-3',
    order_id: 'demo-order-3',
    amount: 7999.90,
    status: 'pending',
    due_date: formatDate(addDays(today, 7)),
    issued_date: formatDate(subDays(today, 2)),
    paid_date: null,
    created_at: formatDateTime(subDays(today, 2)),
    updated_at: formatDateTime(subDays(today, 2))
  }
];

// Demo campaigns
export const demoCampaigns = [
  {
    id: 'demo-campaign-1',
    company_id: demoCompany.id,
    name: 'Summer Flash Sale',
    type: 'flash_sale',
    status: 'active',
    start_date: formatDate(subDays(today, 5)),
    end_date: formatDate(addDays(today, 5)),
    discount_type: 'percentage',
    discount_value: 15,
    target_type: 'product_category',
    target_value: 'residential',
    description: 'Limited time offer on all residential gas products',
    terms: 'Cannot be combined with other offers. Valid for online orders only.',
    created_at: formatDateTime(subDays(today, 10)),
    updated_at: formatDateTime(subDays(today, 5))
  },
  {
    id: 'demo-campaign-2',
    company_id: demoCompany.id,
    name: 'Bulk Purchase Discount',
    type: 'volume_discount',
    status: 'scheduled',
    start_date: formatDate(addDays(today, 10)),
    end_date: formatDate(addDays(today, 25)),
    discount_type: 'percentage',
    discount_value: 10,
    target_type: 'customer_type',
    target_value: 'B2B',
    description: 'Special discount for bulk purchases by business customers',
    terms: 'Minimum order of 10 units required. Valid for B2B customers only.',
    created_at: formatDateTime(subDays(today, 8)),
    updated_at: formatDateTime(subDays(today, 8))
  }
];

// Demo subscription plans
export const demoSubscriptionPlans = [
  {
    id: 'demo-plan-1',
    name: 'Free',
    description: 'For small suppliers just getting started',
    monthly_price: 0,
    yearly_price: 0,
    is_active: true,
    created_at: formatDateTime(subDays(today, 365)),
    updated_at: formatDateTime(subDays(today, 365))
  },
  {
    id: 'demo-plan-2',
    name: 'Basic',
    description: 'For growing suppliers with established operations',
    monthly_price: 750,
    yearly_price: 8100,
    is_active: true,
    created_at: formatDateTime(subDays(today, 365)),
    updated_at: formatDateTime(subDays(today, 365))
  },
  {
    id: 'demo-plan-3',
    name: 'Advanced',
    description: 'For established suppliers looking to scale',
    monthly_price: 1500,
    yearly_price: 15840,
    is_active: true,
    created_at: formatDateTime(subDays(today, 365)),
    updated_at: formatDateTime(subDays(today, 365))
  },
  {
    id: 'demo-plan-4',
    name: 'Premium',
    description: 'For enterprise suppliers with complex needs',
    monthly_price: 0, // Custom pricing
    yearly_price: 0, // Custom pricing
    is_active: true,
    created_at: formatDateTime(subDays(today, 365)),
    updated_at: formatDateTime(subDays(today, 365))
  }
];

// Demo subscription tiers
export const demoSubscriptionTiers = [
  {
    id: 'demo-tier-1',
    plan_id: 'demo-plan-1',
    product_limit: 3,
    order_limit: 10,
    gmv_limit: 500,
    branch_limit: 1,
    user_limit: 3,
    customer_types: ['B2C'],
    countries_access: 'Domestic only',
    commission_rate: 20,
    support_level: 'Email support (48h response)',
    api_access: 'None',
    features: ['Basic inventory management', 'Standard support'],
    created_at: formatDateTime(subDays(today, 365)),
    updated_at: formatDateTime(subDays(today, 365))
  },
  {
    id: 'demo-tier-2',
    plan_id: 'demo-plan-2',
    product_limit: 5,
    order_limit: 100,
    gmv_limit: 5000,
    branch_limit: 3,
    user_limit: 10,
    customer_types: ['B2C'],
    countries_access: 'Domestic only',
    commission_rate: 15,
    support_level: 'Priority email support (24h response)',
    api_access: 'Basic read-only API',
    features: ['Basic inventory management', 'Priority support', 'Directory listing', 'API access', 'Basic analytics'],
    created_at: formatDateTime(subDays(today, 365)),
    updated_at: formatDateTime(subDays(today, 365))
  },
  {
    id: 'demo-tier-3',
    plan_id: 'demo-plan-3',
    product_limit: 35,
    order_limit: 500,
    gmv_limit: 25000,
    branch_limit: 7,
    user_limit: 50,
    customer_types: ['B2B', 'B2C'],
    countries_access: 'Domestic + 1 international',
    commission_rate: 12,
    support_level: 'Dedicated account manager',
    api_access: 'Full API access',
    features: ['Advanced inventory management', 'Dedicated account manager', 'Promotions & campaigns', 'Advanced analytics', 'Enhanced training'],
    created_at: formatDateTime(subDays(today, 365)),
    updated_at: formatDateTime(subDays(today, 365))
  },
  {
    id: 'demo-tier-4',
    plan_id: 'demo-plan-4',
    product_limit: 2147483647, // Unlimited
    order_limit: 2147483647, // Unlimited
    gmv_limit: 2147483647, // Unlimited
    branch_limit: 100,
    user_limit: 2147483647, // Unlimited
    customer_types: ['B2B', 'B2C', 'B2G'],
    countries_access: 'Global coverage',
    commission_rate: 8,
    support_level: 'Premium support with SLAs',
    api_access: 'Custom API integration',
    features: ['Advanced inventory management', 'Dedicated account manager', 'Custom campaigns', 'Full performance reports', 'Complete training suite'],
    created_at: formatDateTime(subDays(today, 365)),
    updated_at: formatDateTime(subDays(today, 365))
  }
];

// Demo supplier subscription
export const demoSupplierSubscription = {
  id: 'demo-subscription-1',
  company_id: demoCompany.id,
  plan_id: 'demo-plan-3', // Advanced plan
  status: 'active',
  billing_cycle: 'yearly',
  start_date: formatDateTime(subDays(today, 60)),
  end_date: formatDateTime(addDays(today, 305)),
  auto_renew: true,
  payment_method: 'Credit Card',
  payment_details: { last4: '4242', brand: 'Visa' },
  created_at: formatDateTime(subDays(today, 60)),
  updated_at: formatDateTime(subDays(today, 60))
};

// Demo subscription usage
export const demoSubscriptionUsage = {
  id: 'demo-usage-1',
  company_id: demoCompany.id,
  products_used: 5,
  orders_used: 4,
  gmv_used: 10699.83,
  branches_used: 3,
  users_used: 5,
  month: formatDate(new Date(today.getFullYear(), today.getMonth(), 1)), // First day of current month
  created_at: formatDateTime(new Date(today.getFullYear(), today.getMonth(), 1)),
  updated_at: formatDateTime(today)
};

// Demo active products view
export const demoActiveProducts = demoProducts
  .filter(product => product.status === 'active')
  .map(product => {
    const images = demoProductImages.filter(img => img.product_id === product.id);
    const attributes = demoProductAttributes.filter(attr => attr.product_id === product.id);
    
    return {
      ...product,
      company_name: demoCompany.name,
      images: images.length > 0 ? images : null,
      attributes: attributes.length > 0 ? attributes : null
    };
  });

// Demo order summary view
export const demoOrderSummary = demoOrders.map(order => {
  const customer = demoCustomers.find(c => c.id === order.customer_id);
  const items = demoOrderItems
    .filter(item => item.order_id === order.id)
    .map(item => {
      const product = demoProducts.find(p => p.id === item.product_id);
      return {
        product_id: item.product_id,
        product_name: product?.name || 'Unknown Product',
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price
      };
    });
  
  return {
    ...order,
    customer_name: customer?.name || 'Unknown Customer',
    customer_type: customer?.type || 'Unknown',
    customer_email: customer?.email || null,
    customer_phone: customer?.phone || null,
    items: items
  };
});

// Demo ticket summary view
export const demoTicketSummary = demoSupportTickets.map(ticket => {
  const messages = demoTicketMessages.filter(msg => msg.ticket_id === ticket.id);
  const lastMessage = messages.length > 0 
    ? messages.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]
    : null;
  
  return {
    ...ticket,
    assignee_name: 'Support Team',
    company_name: demoCompany.name,
    message_count: messages.length,
    last_message_at: lastMessage?.created_at || ticket.created_at
  };
});