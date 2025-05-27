# Gasable Supplier Portal API Documentation

## Overview

The Gasable Supplier Portal provides a comprehensive RESTful API that allows developers to integrate with the platform programmatically. This document outlines the available endpoints, authentication methods, request/response formats, and best practices.

## Base URL

All API requests should be made to:

```
https://api.gasable.com/v1
```

## Authentication

### API Keys

The API uses API keys for authentication. Each supplier account can generate API keys from the Settings > Integrations section of the portal.

Include your API key in the request header:

```
Authorization: Bearer YOUR_API_KEY
```

### JWT Authentication

For user-specific operations, JWT authentication is also supported:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

JWTs can be obtained by authenticating through the `/auth/login` endpoint.

## Rate Limiting

API requests are rate-limited to protect the system from abuse. The current limits are:

- 100 requests per minute for standard accounts
- 300 requests per minute for premium accounts

Rate limit information is included in the response headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1614556800
```

## Error Handling

The API uses standard HTTP status codes to indicate the success or failure of requests:

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 429: Too Many Requests
- 500: Internal Server Error

Error responses include a JSON body with details:

```json
{
  "error": {
    "code": "invalid_request",
    "message": "The request was invalid",
    "details": "The 'name' field is required"
  }
}
```

## Pagination

List endpoints support pagination using the `limit` and `offset` query parameters:

```
GET /products?limit=20&offset=40
```

Response includes pagination metadata:

```json
{
  "data": [...],
  "pagination": {
    "total": 156,
    "limit": 20,
    "offset": 40,
    "has_more": true
  }
}
```

## Filtering and Sorting

Most list endpoints support filtering and sorting:

```
GET /products?category=gas&sort=price&order=asc
```

## API Endpoints

### Authentication

#### Login

```
POST /auth/login
```

Request body:
```json
{
  "email": "user@example.com",
  "password": "your_password"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "role": "supplier"
  }
}
```

#### Logout

```
POST /auth/logout
```

Response:
```json
{
  "message": "Successfully logged out"
}
```

### Company Management

#### Get Company Profile

```
GET /companies/profile
```

Response:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Acme Gas Supplies",
  "cr_number": "CR123456789",
  "vat_number": "VAT987654321",
  "phone": "+966123456789",
  "email": "info@acmegas.com",
  "address": "123 Industrial Park, Riyadh",
  "city": "Riyadh",
  "country": "Saudi Arabia",
  "logo_url": "https://example.com/logo.png",
  "subscription_tier": "premium",
  "subscription_status": "active",
  "created_at": "2023-01-15T12:00:00Z",
  "updated_at": "2023-06-20T15:30:00Z"
}
```

#### Update Company Profile

```
PUT /companies/profile
```

Request body:
```json
{
  "name": "Acme Gas Supplies Ltd.",
  "phone": "+966123456789",
  "email": "info@acmegas.com",
  "address": "456 Business District, Riyadh",
  "logo_url": "https://example.com/new-logo.png"
}
```

Response:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Acme Gas Supplies Ltd.",
  "cr_number": "CR123456789",
  "vat_number": "VAT987654321",
  "phone": "+966123456789",
  "email": "info@acmegas.com",
  "address": "456 Business District, Riyadh",
  "city": "Riyadh",
  "country": "Saudi Arabia",
  "logo_url": "https://example.com/new-logo.png",
  "subscription_tier": "premium",
  "subscription_status": "active",
  "created_at": "2023-01-15T12:00:00Z",
  "updated_at": "2023-06-20T15:30:00Z"
}
```

### Store Management

#### List Stores

```
GET /stores
```

Response:
```json
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Riyadh Central Hub",
      "type": "warehouse",
      "address": "123 Industrial Park, Riyadh",
      "city": "Riyadh",
      "country": "Saudi Arabia",
      "status": "active",
      "services": {
        "pickup": true,
        "delivery": true
      },
      "created_at": "2023-01-15T12:00:00Z",
      "updated_at": "2023-06-20T15:30:00Z"
    }
  ],
  "pagination": {
    "total": 3,
    "limit": 20,
    "offset": 0,
    "has_more": false
  }
}
```

#### Get Store Details

```
GET /stores/{store_id}
```

Response:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Riyadh Central Hub",
  "type": "warehouse",
  "address": "123 Industrial Park, Riyadh",
  "city": "Riyadh",
  "country": "Saudi Arabia",
  "location": {
    "latitude": 24.7136,
    "longitude": 46.6753
  },
  "status": "active",
  "services": {
    "pickup": true,
    "delivery": true
  },
  "working_hours": {
    "Sunday": {
      "isOpen": true,
      "openTime": "09:00",
      "closeTime": "17:00",
      "is24Hours": false
    },
    "Monday": {
      "isOpen": true,
      "openTime": "09:00",
      "closeTime": "17:00",
      "is24Hours": false
    },
    "Tuesday": {
      "isOpen": true,
      "openTime": "09:00",
      "closeTime": "17:00",
      "is24Hours": false
    },
    "Wednesday": {
      "isOpen": true,
      "openTime": "09:00",
      "closeTime": "17:00",
      "is24Hours": false
    },
    "Thursday": {
      "isOpen": true,
      "openTime": "09:00",
      "closeTime": "17:00",
      "is24Hours": false
    },
    "Friday": {
      "isOpen": false,
      "openTime": "",
      "closeTime": "",
      "is24Hours": false
    },
    "Saturday": {
      "isOpen": false,
      "openTime": "",
      "closeTime": "",
      "is24Hours": false
    }
  },
  "created_at": "2023-01-15T12:00:00Z",
  "updated_at": "2023-06-20T15:30:00Z"
}
```

#### Create Store

```
POST /stores
```

Request body:
```json
{
  "name": "Jeddah Distribution Center",
  "type": "distribution",
  "address": "456 Port Road, Jeddah",
  "city": "Jeddah",
  "country": "Saudi Arabia",
  "location": {
    "latitude": 21.4858,
    "longitude": 39.1925
  },
  "services": {
    "pickup": true,
    "delivery": true
  },
  "working_hours": {
    "Sunday": {
      "isOpen": true,
      "openTime": "08:00",
      "closeTime": "16:00",
      "is24Hours": false
    },
    "Monday": {
      "isOpen": true,
      "openTime": "08:00",
      "closeTime": "16:00",
      "is24Hours": false
    },
    "Tuesday": {
      "isOpen": true,
      "openTime": "08:00",
      "closeTime": "16:00",
      "is24Hours": false
    },
    "Wednesday": {
      "isOpen": true,
      "openTime": "08:00",
      "closeTime": "16:00",
      "is24Hours": false
    },
    "Thursday": {
      "isOpen": true,
      "openTime": "08:00",
      "closeTime": "16:00",
      "is24Hours": false
    },
    "Friday": {
      "isOpen": false,
      "openTime": "",
      "closeTime": "",
      "is24Hours": false
    },
    "Saturday": {
      "isOpen": false,
      "openTime": "",
      "closeTime": "",
      "is24Hours": false
    }
  }
}
```

Response:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174001",
  "name": "Jeddah Distribution Center",
  "type": "distribution",
  "address": "456 Port Road, Jeddah",
  "city": "Jeddah",
  "country": "Saudi Arabia",
  "location": {
    "latitude": 21.4858,
    "longitude": 39.1925
  },
  "status": "pending",
  "services": {
    "pickup": true,
    "delivery": true
  },
  "working_hours": {
    "Sunday": {
      "isOpen": true,
      "openTime": "08:00",
      "closeTime": "16:00",
      "is24Hours": false
    },
    "Monday": {
      "isOpen": true,
      "openTime": "08:00",
      "closeTime": "16:00",
      "is24Hours": false
    },
    "Tuesday": {
      "isOpen": true,
      "openTime": "08:00",
      "closeTime": "16:00",
      "is24Hours": false
    },
    "Wednesday": {
      "isOpen": true,
      "openTime": "08:00",
      "closeTime": "16:00",
      "is24Hours": false
    },
    "Thursday": {
      "isOpen": true,
      "openTime": "08:00",
      "closeTime": "16:00",
      "is24Hours": false
    },
    "Friday": {
      "isOpen": false,
      "openTime": "",
      "closeTime": "",
      "is24Hours": false
    },
    "Saturday": {
      "isOpen": false,
      "openTime": "",
      "closeTime": "",
      "is24Hours": false
    }
  },
  "created_at": "2023-06-25T10:00:00Z",
  "updated_at": "2023-06-25T10:00:00Z"
}
```

#### Update Store

```
PUT /stores/{store_id}
```

Request body:
```json
{
  "name": "Jeddah Main Distribution Center",
  "services": {
    "pickup": true,
    "delivery": true
  },
  "working_hours": {
    "Friday": {
      "isOpen": true,
      "openTime": "13:00",
      "closeTime": "17:00",
      "is24Hours": false
    }
  }
}
```

Response:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174001",
  "name": "Jeddah Main Distribution Center",
  "type": "distribution",
  "address": "456 Port Road, Jeddah",
  "city": "Jeddah",
  "country": "Saudi Arabia",
  "location": {
    "latitude": 21.4858,
    "longitude": 39.1925
  },
  "status": "pending",
  "services": {
    "pickup": true,
    "delivery": true
  },
  "working_hours": {
    "Sunday": {
      "isOpen": true,
      "openTime": "08:00",
      "closeTime": "16:00",
      "is24Hours": false
    },
    "Monday": {
      "isOpen": true,
      "openTime": "08:00",
      "closeTime": "16:00",
      "is24Hours": false
    },
    "Tuesday": {
      "isOpen": true,
      "openTime": "08:00",
      "closeTime": "16:00",
      "is24Hours": false
    },
    "Wednesday": {
      "isOpen": true,
      "openTime": "08:00",
      "closeTime": "16:00",
      "is24Hours": false
    },
    "Thursday": {
      "isOpen": true,
      "openTime": "08:00",
      "closeTime": "16:00",
      "is24Hours": false
    },
    "Friday": {
      "isOpen": true,
      "openTime": "13:00",
      "closeTime": "17:00",
      "is24Hours": false
    },
    "Saturday": {
      "isOpen": false,
      "openTime": "",
      "closeTime": "",
      "is24Hours": false
    }
  },
  "created_at": "2023-06-25T10:00:00Z",
  "updated_at": "2023-06-25T11:30:00Z"
}
```

#### Delete Store

```
DELETE /stores/{store_id}
```

Response:
```json
{
  "message": "Store deleted successfully"
}
```

### Product Management

#### List Products

```
GET /products
```

Response:
```json
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Industrial Gas Tank",
      "sku": "IGT-001",
      "type": "gas",
      "category": "industrial",
      "status": "active",
      "created_at": "2023-01-15T12:00:00Z",
      "updated_at": "2023-06-20T15:30:00Z"
    }
  ],
  "pagination": {
    "total": 12,
    "limit": 20,
    "offset": 0,
    "has_more": false
  }
}
```

#### Get Product Details

```
GET /products/{product_id}
```

Response:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Industrial Gas Tank",
  "sku": "IGT-001",
  "description": "High-capacity industrial gas tank for commercial use",
  "type": "gas",
  "category": "industrial",
  "brand": "GasTech",
  "model": "GT-500",
  "status": "active",
  "attributes": [
    {
      "attribute_type": "mechanical",
      "name": "Capacity",
      "value": "500",
      "unit": "L"
    },
    {
      "attribute_type": "mechanical",
      "name": "Pressure Rating",
      "value": "200",
      "unit": "bar"
    },
    {
      "attribute_type": "physical",
      "name": "Material",
      "value": "Stainless Steel",
      "unit": ""
    }
  ],
  "images": [
    {
      "url": "https://example.com/images/gas-tank-1.jpg",
      "is_primary": true
    },
    {
      "url": "https://example.com/images/gas-tank-2.jpg",
      "is_primary": false
    }
  ],
  "pricing": [
    {
      "zone_id": "123e4567-e89b-12d3-a456-426614174000",
      "zone_name": "Riyadh Region",
      "base_price": 450.00,
      "b2b_price": 399.99,
      "b2c_price": 499.99,
      "currency": "SAR",
      "min_order_quantity": 1
    },
    {
      "zone_id": "123e4567-e89b-12d3-a456-426614174001",
      "zone_name": "Jeddah Region",
      "base_price": 460.00,
      "b2b_price": 409.99,
      "b2c_price": 509.99,
      "currency": "SAR",
      "min_order_quantity": 1
    }
  ],
  "created_at": "2023-01-15T12:00:00Z",
  "updated_at": "2023-06-20T15:30:00Z"
}
```

#### Create Product

```
POST /products
```

Request body:
```json
{
  "name": "Premium Gas Cylinder",
  "sku": "PGC-002",
  "description": "Premium residential gas cylinder with enhanced safety features",
  "type": "gas",
  "category": "residential",
  "brand": "GasTech",
  "model": "GT-50",
  "attributes": [
    {
      "attribute_type": "mechanical",
      "name": "Capacity",
      "value": "50",
      "unit": "L"
    },
    {
      "attribute_type": "mechanical",
      "name": "Pressure Rating",
      "value": "150",
      "unit": "bar"
    },
    {
      "attribute_type": "physical",
      "name": "Material",
      "value": "Aluminum",
      "unit": ""
    }
  ],
  "pricing": [
    {
      "zone_id": "123e4567-e89b-12d3-a456-426614174000",
      "base_price": 85.00,
      "b2b_price": 79.99,
      "b2c_price": 99.99,
      "currency": "SAR",
      "min_order_quantity": 1
    }
  ]
}
```

Response:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174002",
  "name": "Premium Gas Cylinder",
  "sku": "PGC-002",
  "description": "Premium residential gas cylinder with enhanced safety features",
  "type": "gas",
  "category": "residential",
  "brand": "GasTech",
  "model": "GT-50",
  "status": "draft",
  "attributes": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174003",
      "attribute_type": "mechanical",
      "name": "Capacity",
      "value": "50",
      "unit": "L"
    },
    {
      "id": "123e4567-e89b-12d3-a456-426614174004",
      "attribute_type": "mechanical",
      "name": "Pressure Rating",
      "value": "150",
      "unit": "bar"
    },
    {
      "id": "123e4567-e89b-12d3-a456-426614174005",
      "attribute_type": "physical",
      "name": "Material",
      "value": "Aluminum",
      "unit": ""
    }
  ],
  "pricing": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174006",
      "zone_id": "123e4567-e89b-12d3-a456-426614174000",
      "zone_name": "Riyadh Region",
      "base_price": 85.00,
      "b2b_price": 79.99,
      "b2c_price": 99.99,
      "currency": "SAR",
      "min_order_quantity": 1
    }
  ],
  "created_at": "2023-06-25T10:00:00Z",
  "updated_at": "2023-06-25T10:00:00Z"
}
```

#### Update Product

```
PUT /products/{product_id}
```

Request body:
```json
{
  "name": "Premium Gas Cylinder Plus",
  "description": "Enhanced premium residential gas cylinder with advanced safety features",
  "status": "active"
}
```

Response:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174002",
  "name": "Premium Gas Cylinder Plus",
  "sku": "PGC-002",
  "description": "Enhanced premium residential gas cylinder with advanced safety features",
  "type": "gas",
  "category": "residential",
  "brand": "GasTech",
  "model": "GT-50",
  "status": "active",
  "attributes": [...],
  "pricing": [...],
  "created_at": "2023-06-25T10:00:00Z",
  "updated_at": "2023-06-25T11:30:00Z"
}
```

#### Delete Product

```
DELETE /products/{product_id}
```

Response:
```json
{
  "message": "Product deleted successfully"
}
```

### Order Management

#### List Orders

```
GET /orders
```

Response:
```json
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "order_number": "ORD-2024-001",
      "customer": {
        "name": "Acme Industries",
        "type": "B2B"
      },
      "total_amount": 2499.95,
      "status": "pending",
      "payment_status": "paid",
      "delivery_status": "processing",
      "created_at": "2024-03-15T09:30:00Z"
    }
  ],
  "pagination": {
    "total": 156,
    "limit": 20,
    "offset": 0,
    "has_more": true
  }
}
```

#### Get Order Details

```
GET /orders/{order_id}
```

Response:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "order_number": "ORD-2024-001",
  "status": "pending",
  "total_amount": 2499.95,
  "customer": {
    "id": "123e4567-e89b-12d3-a456-426614174001",
    "name": "Acme Industries",
    "type": "B2B",
    "email": "orders@acme.com",
    "phone": "+966123456789",
    "company": "Acme Industries Ltd."
  },
  "items": [
    {
      "product_id": "123e4567-e89b-12d3-a456-426614174002",
      "product_name": "Industrial Gas Tank",
      "sku": "IGT-001",
      "quantity": 5,
      "unit_price": 499.99,
      "total_price": 2499.95
    }
  ],
  "payment": {
    "method": "Bank Transfer",
    "status": "paid",
    "transaction_id": "TXN-123456",
    "amount": 2499.95
  },
  "delivery": {
    "method": "delivery",
    "status": "processing",
    "address": "123 Industrial Park, Business District",
    "city": "Riyadh",
    "country": "Saudi Arabia",
    "tracking": "TRK-123456",
    "carrier": "Aramex",
    "notes": "Delivery to loading dock only"
  },
  "notes": "Customer requested expedited shipping",
  "tags": ["bulk order", "corporate"],
  "created_at": "2024-03-15T09:30:00Z",
  "updated_at": "2024-03-15T14:45:00Z"
}
```

#### Update Order Status

```
PATCH /orders/{order_id}/status
```

Request body:
```json
{
  "status": "processing",
  "delivery_status": "shipped",
  "tracking": "TRK-123457",
  "notes": "Shipped via express delivery"
}
```

Response:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "order_number": "ORD-2024-001",
  "status": "processing",
  "delivery_status": "shipped",
  "tracking": "TRK-123457",
  "notes": "Shipped via express delivery",
  "updated_at": "2024-03-16T10:30:00Z"
}
```

### Support Ticketing

#### List Tickets

```
GET /tickets
```

Response:
```json
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "ticket_number": "TKT-001",
      "title": "Cannot update product price",
      "status": "open",
      "priority": "high",
      "category": "Technical Issue",
      "created_at": "2024-03-19T10:30:00Z",
      "updated_at": "2024-03-19T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 4,
    "limit": 20,
    "offset": 0,
    "has_more": false
  }
}
```

#### Get Ticket Details

```
GET /tickets/{ticket_id}
```

Response:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "ticket_number": "TKT-001",
  "title": "Cannot update product price",
  "description": "When trying to update the price of my product, I get an error message saying \"Operation failed\".",
  "status": "open",
  "priority": "high",
  "category": "Technical Issue",
  "assignee": "Sarah Johnson",
  "created_by": "Ahmed Al-Saud",
  "created_at": "2024-03-19T10:30:00Z",
  "updated_at": "2024-03-19T10:30:00Z",
  "messages": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174001",
      "sender": "Ahmed Al-Saud",
      "sender_type": "customer",
      "message": "When trying to update the price of my product, I get an error message saying \"Operation failed\". This is urgent as we need to update prices for a promotion.",
      "timestamp": "2024-03-19T10:30:00Z"
    }
  ]
}
```

#### Create Ticket

```
POST /tickets
```

Request body:
```json
{
  "title": "Issue with order delivery",
  "description": "Order #ORD-2024-005 was supposed to be delivered yesterday but hasn't arrived yet.",
  "priority": "high",
  "category": "5"
}
```

Response:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174002",
  "ticket_number": "TKT-005",
  "title": "Issue with order delivery",
  "description": "Order #ORD-2024-005 was supposed to be delivered yesterday but hasn't arrived yet.",
  "status": "open",
  "priority": "high",
  "category": "Shipping",
  "created_by": "Ahmed Al-Saud",
  "created_at": "2024-03-20T09:15:00Z",
  "updated_at": "2024-03-20T09:15:00Z",
  "messages": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174003",
      "sender": "Ahmed Al-Saud",
      "sender_type": "customer",
      "message": "Order #ORD-2024-005 was supposed to be delivered yesterday but hasn't arrived yet.",
      "timestamp": "2024-03-20T09:15:00Z"
    }
  ]
}
```

#### Add Message to Ticket

```
POST /tickets/{ticket_id}/messages
```

Request body:
```json
{
  "message": "I've checked the order status and it shows as 'in transit'. The carrier has informed us of a slight delay due to weather conditions. It should be delivered by tomorrow.",
  "attachments": []
}
```

Response:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174004",
  "sender": "Sarah Johnson",
  "sender_type": "support",
  "message": "I've checked the order status and it shows as 'in transit'. The carrier has informed us of a slight delay due to weather conditions. It should be delivered by tomorrow.",
  "attachments": [],
  "timestamp": "2024-03-20T10:30:00Z"
}
```

#### Update Ticket Status

```
PATCH /tickets/{ticket_id}/status
```

Request body:
```json
{
  "status": "in_progress",
  "assignee_id": "123e4567-e89b-12d3-a456-426614174005"
}
```

Response:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174002",
  "ticket_number": "TKT-005",
  "status": "in_progress",
  "assignee": "Mohammed Khalid",
  "assignee_id": "123e4567-e89b-12d3-a456-426614174005",
  "updated_at": "2024-03-20T11:00:00Z"
}
```

### Analytics

#### Sales Overview

```
GET /analytics/sales
```

Query parameters:
- `period`: day, week, month, year (default: month)
- `start_date`: ISO date string
- `end_date`: ISO date string

Response:
```json
{
  "total_revenue": 768432.50,
  "total_orders": 1567,
  "average_order_value": 490.38,
  "period_comparison": {
    "revenue_change": 10.05,
    "orders_change": 8.5
  },
  "timeline": [
    {
      "date": "2024-01",
      "revenue": 698245.75,
      "orders": 1420
    },
    {
      "date": "2024-02",
      "revenue": 725678.90,
      "orders": 1485
    },
    {
      "date": "2024-03",
      "revenue": 768432.50,
      "orders": 1567
    }
  ],
  "customer_segments": [
    {
      "segment": "B2B",
      "revenue": 460000.00,
      "orders": 940,
      "percentage": 60
    },
    {
      "segment": "B2C",
      "revenue": 230000.00,
      "orders": 470,
      "percentage": 30
    },
    {
      "segment": "Distributors",
      "revenue": 78000.00,
      "orders": 157,
      "percentage": 10
    }
  ]
}
```

#### Product Performance

```
GET /analytics/products
```

Query parameters:
- `period`: day, week, month, year (default: month)
- `start_date`: ISO date string
- `end_date`: ISO date string
- `limit`: number of products to return (default: 10)

Response:
```json
{
  "total_products": 156,
  "active_products": 124,
  "top_products": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Industrial Gas Tank",
      "sku": "IGT-001",
      "sales": 450,
      "revenue": 225000.00,
      "views": 1200,
      "conversion_rate": 37.5,
      "growth": 12.5
    },
    {
      "id": "123e4567-e89b-12d3-a456-426614174002",
      "name": "Premium Gas Cylinder",
      "sku": "PGC-002",
      "sales": 380,
      "revenue": 38000.00,
      "views": 950,
      "conversion_rate": 40.0,
      "growth": 8.2
    }
  ],
  "category_performance": [
    {
      "category": "industrial",
      "sales": 780,
      "revenue": 390000.00,
      "percentage": 50.8
    },
    {
      "category": "residential",
      "sales": 620,
      "revenue": 310000.00,
      "percentage": 40.3
    },
    {
      "category": "commercial",
      "sales": 167,
      "revenue": 68432.50,
      "percentage": 8.9
    }
  ]
}
```

#### Customer Insights

```
GET /analytics/customers
```

Query parameters:
- `period`: day, week, month, year (default: month)
- `start_date`: ISO date string
- `end_date`: ISO date string

Response:
```json
{
  "total_customers": 2648,
  "new_customers": 156,
  "returning_customers": 2492,
  "customer_growth": 12.3,
  "average_satisfaction": 4.8,
  "segments": [
    {
      "segment": "Industrial",
      "customers": 1192,
      "percentage": 45,
      "average_order_value": 2500.00
    },
    {
      "segment": "Commercial",
      "customers": 794,
      "percentage": 30,
      "average_order_value": 1200.00
    },
    {
      "segment": "Residential",
      "customers": 662,
      "percentage": 25,
      "average_order_value": 150.00
    }
  ],
  "top_customers": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Acme Industries",
      "type": "B2B",
      "location": "Riyadh",
      "orders": 45,
      "spending": 125000.00,
      "growth": 12.5
    }
  ]
}
```

## Webhooks

The API supports webhooks for real-time event notifications. You can configure webhooks in the Settings > Integrations section of the portal.

### Available Events

- `order.created`: Triggered when a new order is created
- `order.updated`: Triggered when an order is updated
- `order.status_changed`: Triggered when an order's status changes
- `product.created`: Triggered when a new product is created
- `product.updated`: Triggered when a product is updated
- `product.status_changed`: Triggered when a product's status changes
- `ticket.created`: Triggered when a new support ticket is created
- `ticket.updated`: Triggered when a ticket is updated
- `ticket.message_added`: Triggered when a message is added to a ticket

### Webhook Payload

```json
{
  "event": "order.created",
  "timestamp": "2024-03-15T09:30:00Z",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "order_number": "ORD-2024-001",
    "status": "pending",
    "total_amount": 2499.95,
    "customer": {
      "id": "123e4567-e89b-12d3-a456-426614174001",
      "name": "Acme Industries",
      "type": "B2B"
    }
  }
}
```

### Webhook Security

Webhooks include a signature in the `X-Gasable-Signature` header to verify the authenticity of the request. The signature is a HMAC-SHA256 hash of the request body using your webhook secret as the key.

## Best Practices

1. **Use Pagination**: Always use pagination for list endpoints to avoid performance issues.

2. **Filter Appropriately**: Use filtering to reduce the amount of data transferred.

3. **Handle Rate Limits**: Implement exponential backoff when rate limits are reached.

4. **Validate Webhook Signatures**: Always verify webhook signatures to ensure security.

5. **Use Proper Error Handling**: Implement robust error handling for API responses.

6. **Cache Responses**: Cache API responses where appropriate to reduce load.

7. **Use Compression**: Enable gzip compression for API requests and responses.

8. **Monitor API Usage**: Regularly review API usage metrics to optimize performance.

## API Versioning

The API uses versioning in the URL path (e.g., `/v1/products`). When breaking changes are introduced, a new version will be released. Old versions will be supported for at least 12 months after a new version is released.

## Support

For API support, please contact:

- Email: api-support@gasable.com
- Support Portal: https://support.gasable.com/api