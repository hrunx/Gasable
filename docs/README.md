# Gasable Supplier Portal Documentation

## Overview

The Gasable Supplier Portal is a comprehensive platform designed for energy suppliers to manage their products, orders, shipments, and business operations. This documentation provides detailed information about the system architecture, database schema, integration points, and usage guidelines.

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Database Schema](#database-schema)
3. [User Roles and Permissions](#user-roles-and-permissions)
4. [Core Features](#core-features)
5. [Integration Points](#integration-points)
6. [Security Measures](#security-measures)
7. [Deployment Guidelines](#deployment-guidelines)
8. [Troubleshooting](#troubleshooting)

## System Architecture

The Gasable Supplier Portal is built using a modern tech stack:

- **Frontend**: React with TypeScript
- **State Management**: React Context API
- **Styling**: Tailwind CSS
- **Data Visualization**: Recharts
- **Maps**: react-simple-maps
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Hosting**: Netlify

The application follows a component-based architecture with the following structure:

```
src/
├── components/       # Reusable UI components
├── pages/            # Page components
│   ├── analytics/    # Analytics-related pages
│   ├── campaigns/    # Marketing campaign pages
│   └── settings/     # Settings pages
├── services/         # API and service integrations
├── hooks/            # Custom React hooks
├── utils/            # Utility functions
├── types/            # TypeScript type definitions
└── context/          # React Context providers
```

## Database Schema

### Core Tables

#### users
Stores user account information.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| email | text | User's email address |
| created_at | timestamptz | Account creation timestamp |
| updated_at | timestamptz | Last update timestamp |
| role | text | User role (admin, supplier, etc.) |
| status | text | Account status |

#### companies
Stores company/merchant information.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | text | Company name |
| cr_number | text | Commercial registration number |
| vat_number | text | VAT registration number |
| phone | text | Contact phone number |
| email | text | Contact email |
| address | text | Physical address |
| city | text | City |
| country | text | Country |
| logo_url | text | URL to company logo |
| created_at | timestamptz | Record creation timestamp |
| updated_at | timestamptz | Last update timestamp |

#### stores
Stores information about supplier stores/locations.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| company_id | uuid | Foreign key to companies |
| name | text | Store name |
| type | text | Store type (warehouse, retail, etc.) |
| address | text | Physical address |
| city | text | City |
| country | text | Country |
| location | geography | Geographic coordinates |
| status | text | Store status (active, pending, etc.) |
| created_at | timestamptz | Record creation timestamp |
| updated_at | timestamptz | Last update timestamp |

#### products
Stores product information.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| company_id | uuid | Foreign key to companies |
| name | text | Product name |
| sku | text | Stock keeping unit |
| description | text | Product description |
| type | text | Product type |
| category | text | Product category |
| status | text | Product status |
| created_at | timestamptz | Record creation timestamp |
| updated_at | timestamptz | Last update timestamp |

#### product_attributes
Stores product attributes and specifications.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| product_id | uuid | Foreign key to products |
| attribute_type | text | Type of attribute |
| name | text | Attribute name |
| value | text | Attribute value |
| unit | text | Unit of measurement |

#### product_images
Stores product images.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| product_id | uuid | Foreign key to products |
| url | text | Image URL |
| is_primary | boolean | Whether this is the primary image |
| created_at | timestamptz | Record creation timestamp |

#### product_pricing
Stores product pricing information.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| product_id | uuid | Foreign key to products |
| zone_id | uuid | Foreign key to delivery_zones |
| base_price | numeric | Base price |
| b2b_price | numeric | Business-to-business price |
| b2c_price | numeric | Business-to-consumer price |
| currency | text | Currency code |
| created_at | timestamptz | Record creation timestamp |
| updated_at | timestamptz | Last update timestamp |

#### delivery_zones
Stores delivery zone information.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| company_id | uuid | Foreign key to companies |
| name | text | Zone name |
| base_fee | numeric | Base delivery fee |
| min_order_value | numeric | Minimum order value |
| estimated_time | text | Estimated delivery time |
| created_at | timestamptz | Record creation timestamp |
| updated_at | timestamptz | Last update timestamp |

#### orders
Stores order information.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| order_number | text | Order reference number |
| company_id | uuid | Foreign key to companies |
| customer_id | uuid | Foreign key to customers |
| status | text | Order status |
| total_amount | numeric | Total order amount |
| payment_status | text | Payment status |
| payment_method | text | Payment method |
| delivery_method | text | Delivery method |
| delivery_status | text | Delivery status |
| created_at | timestamptz | Record creation timestamp |
| updated_at | timestamptz | Last update timestamp |

#### order_items
Stores order line items.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| order_id | uuid | Foreign key to orders |
| product_id | uuid | Foreign key to products |
| quantity | integer | Quantity ordered |
| unit_price | numeric | Unit price |
| total_price | numeric | Total price for this item |

#### support_tickets
Stores customer support tickets.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| ticket_number | text | Ticket reference number |
| company_id | uuid | Foreign key to companies |
| customer_id | uuid | Foreign key to customers (optional) |
| title | text | Ticket title |
| description | text | Ticket description |
| status | text | Ticket status |
| priority | text | Ticket priority |
| category | text | Ticket category |
| assignee_id | uuid | Foreign key to users (support staff) |
| created_at | timestamptz | Record creation timestamp |
| updated_at | timestamptz | Last update timestamp |
| resolved_at | timestamptz | Resolution timestamp |

#### ticket_messages
Stores messages related to support tickets.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| ticket_id | uuid | Foreign key to support_tickets |
| sender_id | uuid | Foreign key to users |
| sender_type | text | Type of sender (customer, support, system) |
| message | text | Message content |
| created_at | timestamptz | Record creation timestamp |

### Relationships

- A **company** can have multiple **stores**
- A **company** can have multiple **products**
- A **product** can have multiple **attributes**
- A **product** can have multiple **images**
- A **product** can have multiple **pricing** entries (for different zones)
- A **company** can define multiple **delivery_zones**
- An **order** can have multiple **order_items**
- A **support_ticket** can have multiple **ticket_messages**

## User Roles and Permissions

### Admin
- Full access to all features and data
- Can manage users and permissions
- Can view and modify all company data

### Supplier
- Can manage their own company profile
- Can create and manage stores
- Can create and manage products
- Can view and process orders
- Can manage delivery zones and shipping settings
- Can view analytics related to their products and orders
- Can create and respond to support tickets

### Support Staff
- Can view and respond to support tickets
- Can view order information
- Limited access to company and product data

## Core Features

### Dashboard
The dashboard provides an overview of key metrics and recent activities:
- Sales statistics
- Recent orders
- Pending approvals
- Performance charts
- Geographical distribution of sales

### Store Management
Suppliers can manage their store locations:
- Add new stores
- Define store types (warehouse, retail, etc.)
- Set working hours
- Configure store services (pickup, delivery)
- View store performance metrics

### Product Management
Comprehensive product management features:
- Add new products with detailed specifications
- Upload product images
- Define product attributes (mechanical, physical, chemical, etc.)
- Set pricing for different customer segments (B2B, B2C)
- Configure product availability by zone

### Order Management
Complete order processing workflow:
- View incoming orders
- Update order status
- Process shipments
- Track deliveries
- Manage returns and refunds
- View order history and analytics

### Shipment and Logistics
Tools for managing product delivery:
- Define delivery zones
- Set shipping fees
- Configure delivery methods
- Track shipments in real-time
- Manage fleet and drivers (for own-fleet delivery)

### Finance and Billing
Financial management features:
- View transaction history
- Generate invoices
- Track payments
- Manage account statements
- Configure payment methods

### Analytics and Reporting
Comprehensive analytics tools:
- Sales performance
- Product performance
- Customer insights
- Market analysis
- Logistics reports

### Marketing and Campaigns
Tools for promoting products:
- Create promotions and discounts
- Set up special offers
- Manage loyalty programs
- Track campaign performance

### Support Ticketing System
Customer support management:
- Create and track support tickets
- Categorize issues
- Assign tickets to team members
- Track resolution time
- Analyze support performance

### Settings and Configuration
System configuration options:
- User preferences
- Security settings
- Notification preferences
- API integrations
- Company profile management

## Integration Points

### Payment Gateways
The system integrates with various payment processors:
- Bank transfers
- Credit card processors
- Digital wallets

### Logistics Providers
Integration with shipping and logistics services:
- Aramex
- DHL
- SMSA
- Custom logistics providers

### IoT Devices
Support for IoT device integration:
- Tank level sensors
- Flow meters
- Smart valves
- Temperature sensors

### ERP Systems
Integration capabilities with enterprise systems:
- SAP
- Oracle
- Microsoft Dynamics
- Custom ERP solutions

### API Access
RESTful API endpoints for external integrations:
- Product data
- Order management
- Inventory updates
- Pricing information

## Security Measures

### Authentication
- Email and password authentication
- Multi-factor authentication support
- Session management and timeout controls

### Authorization
- Role-based access control
- Row-level security in database
- Permission-based feature access

### Data Protection
- Encryption of sensitive data
- Secure password storage (bcrypt hashing)
- HTTPS for all communications
- Input validation and sanitization

### Compliance
- GDPR compliance features
- Data retention policies
- Privacy controls
- Audit logging

## Deployment Guidelines

### Environment Setup
1. Configure environment variables:
   - `VITE_SUPABASE_URL`: Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key
   - Additional service-specific variables as needed

2. Database initialization:
   - Run migration scripts to create schema
   - Set up initial data (categories, regions, etc.)
   - Configure RLS policies

### Build Process
1. Install dependencies:
   ```
   npm install
   ```

2. Build the application:
   ```
   npm run build
   ```

3. Test the build locally:
   ```
   npm run preview
   ```

### Deployment
1. Deploy to Netlify:
   - Connect repository to Netlify
   - Configure build settings
   - Set environment variables
   - Deploy the application

2. Post-deployment verification:
   - Test critical user flows
   - Verify API integrations
   - Check database connections
   - Validate authentication flows

## Troubleshooting

### Common Issues

#### Authentication Problems
- Verify Supabase credentials are correctly set
- Check user permissions in Supabase
- Ensure email verification is properly configured

#### Database Connection Issues
- Verify network connectivity to Supabase
- Check RLS policies for proper access
- Validate database schema matches application expectations

#### Performance Issues
- Optimize database queries with proper indexes
- Implement caching for frequently accessed data
- Use pagination for large data sets
- Optimize image sizes and loading

#### Integration Failures
- Verify API keys and credentials
- Check network connectivity to third-party services
- Validate request/response formats
- Review rate limiting policies

### Support Resources
- Supabase Documentation: [https://supabase.com/docs](https://supabase.com/docs)
- React Documentation: [https://reactjs.org/docs](https://reactjs.org/docs)
- Tailwind CSS Documentation: [https://tailwindcss.com/docs](https://tailwindcss.com/docs)
- Gasable Support: support@gasable.com