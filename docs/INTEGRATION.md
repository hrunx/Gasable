# Gasable Supplier Portal Integration Guide

## Overview

This document provides comprehensive guidance for integrating external systems with the Gasable Supplier Portal. Whether you're connecting an ERP system, logistics platform, IoT devices, or custom applications, this guide will help you establish seamless integration.

## Table of Contents

1. [Integration Options](#integration-options)
2. [API Integration](#api-integration)
3. [Webhook Integration](#webhook-integration)
4. [IoT Device Integration](#iot-device-integration)
5. [ERP System Integration](#erp-system-integration)
6. [Logistics Provider Integration](#logistics-provider-integration)
7. [Payment Gateway Integration](#payment-gateway-integration)
8. [Data Synchronization](#data-synchronization)
9. [Testing and Validation](#testing-and-validation)
10. [Troubleshooting](#troubleshooting)

## Integration Options

The Gasable Supplier Portal offers multiple integration methods to suit different requirements:

1. **REST API**: Comprehensive API for programmatic access to all platform features
2. **Webhooks**: Real-time event notifications for system events
3. **IoT Integration**: Direct connection with IoT devices for real-time monitoring
4. **File-based Integration**: Scheduled import/export of data via CSV/XML/JSON files
5. **Pre-built Connectors**: Ready-made integrations with popular systems

## API Integration

### Getting Started

1. **Generate API Credentials**:
   - Navigate to Settings > Integrations in the portal
   - Click "Generate API Key"
   - Store your API key securely; it will only be shown once

2. **API Base URL**:
   ```
   https://api.gasable.com/v1
   ```

3. **Authentication**:
   Include your API key in the request header:
   ```
   Authorization: Bearer YOUR_API_KEY
   ```

4. **Content Type**:
   ```
   Content-Type: application/json
   ```

### API Documentation

For detailed API documentation, refer to the [API Documentation](API.md) or visit our [API Reference Portal](https://api.gasable.com/docs).

### Sample Code

#### JavaScript/Node.js

```javascript
const axios = require('axios');

const GASABLE_API_KEY = 'your_api_key';
const GASABLE_API_URL = 'https://api.gasable.com/v1';

async function getProducts() {
  try {
    const response = await axios.get(`${GASABLE_API_URL}/products`, {
      headers: {
        'Authorization': `Bearer ${GASABLE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error.response?.data || error.message);
    throw error;
  }
}

// Example usage
getProducts()
  .then(products => console.log('Products:', products))
  .catch(err => console.error('Failed to get products:', err));
```

#### Python

```python
import requests

GASABLE_API_KEY = 'your_api_key'
GASABLE_API_URL = 'https://api.gasable.com/v1'

def get_products():
    headers = {
        'Authorization': f'Bearer {GASABLE_API_KEY}',
        'Content-Type': 'application/json'
    }
    
    response = requests.get(f'{GASABLE_API_URL}/products', headers=headers)
    response.raise_for_status()  # Raise exception for 4XX/5XX responses
    
    return response.json()

# Example usage
try:
    products = get_products()
    print('Products:', products)
except requests.exceptions.RequestException as e:
    print(f'Failed to get products: {e}')
```

#### PHP

```php
<?php

$GASABLE_API_KEY = 'your_api_key';
$GASABLE_API_URL = 'https://api.gasable.com/v1';

function getProducts() {
    global $GASABLE_API_KEY, $GASABLE_API_URL;
    
    $ch = curl_init("$GASABLE_API_URL/products");
    
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Authorization: Bearer $GASABLE_API_KEY",
        "Content-Type: application/json"
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    
    if (curl_errno($ch)) {
        throw new Exception(curl_error($ch));
    }
    
    curl_close($ch);
    
    if ($httpCode >= 400) {
        throw new Exception("API request failed with status code $httpCode: $response");
    }
    
    return json_decode($response, true);
}

// Example usage
try {
    $products = getProducts();
    echo "Products: " . print_r($products, true);
} catch (Exception $e) {
    echo "Failed to get products: " . $e->getMessage();
}
```

## Webhook Integration

### Configuring Webhooks

1. Navigate to Settings > Integrations > Webhooks in the portal
2. Click "Add Webhook"
3. Enter the endpoint URL where you want to receive webhook events
4. Select the events you want to subscribe to
5. Generate a webhook secret for signature verification
6. Save the configuration

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

### Verifying Webhook Signatures

Each webhook request includes a signature in the `X-Gasable-Signature` header. This signature is a HMAC-SHA256 hash of the request body using your webhook secret as the key.

#### JavaScript/Node.js Example

```javascript
const crypto = require('crypto');

function verifyWebhookSignature(requestBody, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  const calculatedSignature = hmac.update(requestBody).digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(calculatedSignature, 'hex'),
    Buffer.from(signature, 'hex')
  );
}

// Express.js example
app.post('/webhooks/gasable', express.raw({type: 'application/json'}), (req, res) => {
  const signature = req.headers['x-gasable-signature'];
  const webhookSecret = 'your_webhook_secret';
  
  if (!verifyWebhookSignature(req.body, signature, webhookSecret)) {
    return res.status(401).send('Invalid signature');
  }
  
  const event = JSON.parse(req.body);
  
  // Process the webhook event
  console.log('Received event:', event.event);
  console.log('Event data:', event.data);
  
  // Acknowledge receipt of the webhook
  res.status(200).send('Webhook received');
});
```

#### Python Example

```python
import hmac
import hashlib
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/webhooks/gasable', methods=['POST'])
def handle_webhook():
    signature = request.headers.get('X-Gasable-Signature')
    webhook_secret = 'your_webhook_secret'
    
    # Verify signature
    calculated_signature = hmac.new(
        webhook_secret.encode('utf-8'),
        request.data,
        hashlib.sha256
    ).hexdigest()
    
    if not hmac.compare_digest(calculated_signature, signature):
        return jsonify({'error': 'Invalid signature'}), 401
    
    event = request.json
    
    # Process the webhook event
    print(f"Received event: {event['event']}")
    print(f"Event data: {event['data']}")
    
    # Acknowledge receipt of the webhook
    return jsonify({'status': 'success'}), 200

if __name__ == '__main__':
    app.run(port=5000)
```

### Best Practices for Webhooks

1. **Implement Retry Logic**: Your webhook endpoint should be idempotent to handle potential duplicate deliveries.

2. **Quick Response**: Respond to webhook requests quickly (within 5 seconds) to avoid timeouts.

3. **Asynchronous Processing**: Acknowledge receipt immediately, then process the webhook data asynchronously.

4. **Signature Verification**: Always verify webhook signatures to ensure authenticity.

5. **Error Handling**: Implement robust error handling for webhook processing.

6. **Logging**: Log all webhook events for debugging and auditing purposes.

## IoT Device Integration

The Gasable Supplier Portal supports integration with IoT devices for real-time monitoring of gas levels, pressure, temperature, and other metrics.

### Supported Device Types

- Gas level sensors
- Pressure sensors
- Temperature sensors
- Flow meters
- Smart valves
- GPS trackers

### Integration Methods

1. **Direct API Integration**: Devices can send data directly to the Gasable API.
2. **MQTT Protocol**: Support for MQTT for lightweight IoT communications.
3. **Gateway Integration**: Connect through an IoT gateway for multiple devices.

### Device Registration

1. Navigate to Setup > IoT Integration in the portal
2. Click "Add Device"
3. Enter device details:
   - Device name
   - Device type
   - Serial number
   - Location
4. Generate device credentials
5. Configure the device with the provided credentials

### Data Format

Devices should send data in the following JSON format:

```json
{
  "device_id": "DEV-123456",
  "timestamp": "2024-03-15T09:30:00Z",
  "readings": [
    {
      "type": "level",
      "value": 75.5,
      "unit": "%"
    },
    {
      "type": "pressure",
      "value": 2.4,
      "unit": "bar"
    },
    {
      "type": "temperature",
      "value": 23,
      "unit": "°C"
    }
  ],
  "status": {
    "battery": 85,
    "signal": 92,
    "errors": []
  }
}
```

### Sample Code for IoT Integration

#### Arduino/ESP32 Example

```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char* ssid = "YourWiFiSSID";
const char* password = "YourWiFiPassword";
const char* deviceId = "DEV-123456";
const char* apiKey = "your_api_key";
const char* apiUrl = "https://api.gasable.com/v1/iot/readings";

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  
  Serial.println("Connected to WiFi");
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    // Read sensor data
    float level = readLevelSensor();
    float pressure = readPressureSensor();
    float temperature = readTemperatureSensor();
    int battery = readBatteryLevel();
    int signal = WiFi.RSSI();
    
    // Create JSON payload
    DynamicJsonDocument doc(1024);
    doc["device_id"] = deviceId;
    doc["timestamp"] = getCurrentTimestamp();
    
    JsonArray readings = doc.createNestedArray("readings");
    
    JsonObject levelReading = readings.createNestedObject();
    levelReading["type"] = "level";
    levelReading["value"] = level;
    levelReading["unit"] = "%";
    
    JsonObject pressureReading = readings.createNestedObject();
    pressureReading["type"] = "pressure";
    pressureReading["value"] = pressure;
    pressureReading["unit"] = "bar";
    
    JsonObject tempReading = readings.createNestedObject();
    tempReading["type"] = "temperature";
    tempReading["value"] = temperature;
    tempReading["unit"] = "°C";
    
    JsonObject status = doc.createNestedObject("status");
    status["battery"] = battery;
    status["signal"] = signal;
    status["errors"] = JsonArray();
    
    String jsonPayload;
    serializeJson(doc, jsonPayload);
    
    // Send data to API
    HTTPClient http;
    http.begin(apiUrl);
    http.addHeader("Content-Type", "application/json");
    http.addHeader("Authorization", String("Bearer ") + apiKey);
    
    int httpResponseCode = http.POST(jsonPayload);
    
    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println("HTTP Response code: " + String(httpResponseCode));
      Serial.println(response);
    } else {
      Serial.println("Error on sending POST: " + String(httpResponseCode));
    }
    
    http.end();
  }
  
  // Send data every 15 minutes
  delay(15 * 60 * 1000);
}

float readLevelSensor() {
  // Implementation depends on your specific sensor
  return 75.5;
}

float readPressureSensor() {
  // Implementation depends on your specific sensor
  return 2.4;
}

float readTemperatureSensor() {
  // Implementation depends on your specific sensor
  return 23.0;
}

int readBatteryLevel() {
  // Implementation depends on your specific device
  return 85;
}

String getCurrentTimestamp() {
  // In a real implementation, you would use NTP to get the current time
  return "2024-03-15T09:30:00Z";
}
```

## ERP System Integration

### Supported ERP Systems

- SAP
- Oracle
- Microsoft Dynamics
- Custom ERP solutions

### Integration Approaches

1. **API-based Integration**: Direct API calls between systems
2. **Middleware Integration**: Using integration platforms like MuleSoft, Boomi, or Zapier
3. **File-based Integration**: Scheduled import/export of data files
4. **Database-level Integration**: Direct database connections (for on-premises solutions)

### Common Integration Scenarios

#### Product Synchronization

Synchronize product data between your ERP system and Gasable:

1. **ERP to Gasable**: Push product updates from ERP to Gasable
   - Product details
   - Inventory levels
   - Pricing updates

2. **Gasable to ERP**: Push product updates from Gasable to ERP
   - New products created in Gasable
   - Product status changes
   - Product attribute updates

#### Order Management

Synchronize order data between systems:

1. **Gasable to ERP**: Push orders from Gasable to ERP
   - New orders
   - Order status updates
   - Order cancellations

2. **ERP to Gasable**: Push order updates from ERP to Gasable
   - Fulfillment status
   - Shipping information
   - Invoice details

#### Customer Data Synchronization

Maintain consistent customer records:

1. **ERP to Gasable**: Push customer data from ERP to Gasable
   - Customer details
   - Account status
   - Credit limits

2. **Gasable to ERP**: Push customer updates from Gasable to ERP
   - New customers
   - Customer preference updates
   - Address changes

### Sample Integration Workflow

#### SAP Integration Example

1. **Setup**:
   - Configure SAP OData services for product and order data
   - Generate API credentials in Gasable
   - Configure integration middleware (if used)

2. **Product Synchronization**:
   - Schedule daily product sync from SAP to Gasable
   - Map SAP product fields to Gasable fields
   - Handle product variants and configurations

3. **Order Processing**:
   - Real-time order creation in Gasable triggers webhook
   - Integration service receives webhook and creates sales order in SAP
   - SAP order status updates are pushed to Gasable via API

4. **Inventory Updates**:
   - SAP inventory changes trigger updates to Gasable
   - Set inventory thresholds for low stock alerts
   - Synchronize inventory across multiple locations

## Logistics Provider Integration

### Supported Logistics Providers

- Aramex
- DHL
- SMSA
- Custom logistics providers

### Integration Features

- Automated shipping label generation
- Real-time tracking updates
- Delivery status notifications
- Return management
- Shipping cost calculation

### Integration Setup

1. **Provider Configuration**:
   - Navigate to Setup > Logistics & Shipping in the portal
   - Select your logistics provider
   - Enter API credentials provided by the logistics company
   - Configure shipping methods and services

2. **Mapping Setup**:
   - Map product dimensions and weights
   - Configure packaging options
   - Set up delivery zones and rates
   - Define handling time and cut-off times

3. **Testing**:
   - Generate test labels
   - Verify tracking number generation
   - Test status updates
   - Validate shipping cost calculations

### Sample Integration Code

#### DHL Shipping Label Generation

```javascript
const axios = require('axios');

const DHL_API_URL = 'https://api-mock.dhl.com/mydhl/v1';
const DHL_API_KEY = 'your_dhl_api_key';
const DHL_ACCOUNT_NUMBER = 'your_account_number';

async function createShippingLabel(order) {
  try {
    // Prepare shipment data
    const shipmentData = {
      plannedShippingDateAndTime: new Date().toISOString(),
      pickup: {
        isRequested: false
      },
      customerDetails: {
        shipperDetails: {
          postalAddress: {
            postalCode: order.shipper.postalCode,
            cityName: order.shipper.city,
            countryCode: order.shipper.countryCode,
            addressLine1: order.shipper.address
          },
          contactInformation: {
            email: order.shipper.email,
            phone: order.shipper.phone,
            companyName: order.shipper.companyName,
            fullName: order.shipper.contactName
          }
        },
        receiverDetails: {
          postalAddress: {
            postalCode: order.receiver.postalCode,
            cityName: order.receiver.city,
            countryCode: order.receiver.countryCode,
            addressLine1: order.receiver.address
          },
          contactInformation: {
            email: order.receiver.email,
            phone: order.receiver.phone,
            companyName: order.receiver.companyName,
            fullName: order.receiver.contactName
          }
        }
      },
      content: {
        packages: order.packages.map(pkg => ({
          weight: pkg.weight,
          dimensions: {
            length: pkg.length,
            width: pkg.width,
            height: pkg.height
          },
          customerReferences: [
            {
              value: order.orderNumber
            }
          ]
        }))
      },
      documentImages: [
        {
          typeCode: "INV",
          imageFormat: "PDF",
          content: order.invoiceBase64
        }
      ],
      outputImageProperties: {
        printerDPI: 300,
        encodingFormat: "pdf",
        imageOptions: [
          {
            typeCode: "label",
            templateName: "ECOM26_84_001"
          }
        ]
      },
      customerDetails: {
        shipperDetails: {
          postalAddress: {
            postalCode: "12345",
            cityName: "Riyadh",
            countryCode: "SA",
            addressLine1: "123 Shipper Street"
          },
          contactInformation: {
            email: "shipper@example.com",
            phone: "+966123456789",
            companyName: "Shipper Company",
            fullName: "Shipper Contact"
          }
        },
        receiverDetails: {
          postalAddress: {
            postalCode: "54321",
            cityName: "Jeddah",
            countryCode: "SA",
            addressLine1: "456 Receiver Street"
          },
          contactInformation: {
            email: "receiver@example.com",
            phone: "+966987654321",
            companyName: "Receiver Company",
            fullName: "Receiver Contact"
          }
        }
      }
    };

    // Call DHL API
    const response = await axios.post(`${DHL_API_URL}/shipments`, shipmentData, {
      headers: {
        'Authorization': `Bearer ${DHL_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Account-Number': DHL_ACCOUNT_NUMBER
      }
    });

    return {
      trackingNumber: response.data.shipmentTrackingNumber,
      labelUrl: response.data.documents[0].url,
      shipmentId: response.data.shipmentId
    };
  } catch (error) {
    console.error('Error creating DHL shipping label:', error.response?.data || error.message);
    throw error;
  }
}

module.exports = { createShippingLabel };
```

## Payment Gateway Integration

### Supported Payment Gateways

- Bank transfers
- Credit card processors
- Digital wallets

### Integration Setup

1. **Gateway Configuration**:
   - Navigate to Settings > Finance > Payment Methods
   - Select your payment gateway
   - Enter API credentials
   - Configure payment methods to enable

2. **Testing**:
   - Use test credentials to process test payments
   - Verify successful payment flows
   - Test refund processes
   - Validate webhook notifications

### Sample Integration Code

#### Credit Card Payment Processing

```javascript
const axios = require('axios');

const PAYMENT_API_URL = 'https://api.payment-provider.com/v1';
const PAYMENT_API_KEY = 'your_payment_api_key';

async function processPayment(orderData) {
  try {
    const paymentData = {
      amount: orderData.amount,
      currency: 'SAR',
      description: `Payment for order ${orderData.orderNumber}`,
      source: orderData.paymentToken,
      customer: {
        email: orderData.customer.email,
        name: orderData.customer.name
      },
      metadata: {
        order_id: orderData.id,
        order_number: orderData.orderNumber
      }
    };

    const response = await axios.post(`${PAYMENT_API_URL}/charges`, paymentData, {
      headers: {
        'Authorization': `Bearer ${PAYMENT_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return {
      transactionId: response.data.id,
      status: response.data.status,
      amount: response.data.amount,
      currency: response.data.currency,
      paymentMethod: response.data.payment_method_details.type,
      createdAt: response.data.created
    };
  } catch (error) {
    console.error('Payment processing error:', error.response?.data || error.message);
    throw error;
  }
}

module.exports = { processPayment };
```

## Data Synchronization

### Synchronization Strategies

1. **Real-time Synchronization**: Immediate updates via API calls or webhooks
2. **Batch Synchronization**: Scheduled updates at regular intervals
3. **Delta Synchronization**: Only synchronize changed data
4. **Full Synchronization**: Complete data refresh (typically for initial setup)

### Handling Data Conflicts

1. **Timestamp-based Resolution**: Latest update wins
2. **Source Priority**: Define primary system for each data type
3. **Manual Resolution**: Flag conflicts for manual review
4. **Merge Strategy**: Combine data from multiple sources based on rules

### Synchronization Monitoring

1. **Sync Logs**: Detailed logs of all synchronization activities
2. **Error Reporting**: Notification of synchronization failures
3. **Reconciliation Reports**: Regular verification of data consistency
4. **Performance Metrics**: Monitoring of synchronization times and resource usage

## Testing and Validation

### Integration Testing Approach

1. **Unit Testing**: Test individual integration components
2. **Integration Testing**: Test end-to-end integration flows
3. **Performance Testing**: Verify system performance under load
4. **Error Handling Testing**: Validate error scenarios and recovery

### Test Environment

A dedicated test environment is available for integration testing:

```
https://api-test.gasable.com/v1
```

Test credentials can be obtained from the Gasable support team.

### Validation Checklist

- Verify data mapping accuracy
- Confirm bidirectional data flow
- Test error handling and recovery
- Validate security measures
- Check performance under expected load
- Verify compliance with rate limits

## Troubleshooting

### Common Integration Issues

1. **Authentication Failures**:
   - Verify API key or credentials
   - Check for expired tokens
   - Confirm correct authentication headers

2. **Data Mapping Issues**:
   - Review field mappings
   - Check for required fields
   - Validate data formats and types

3. **Rate Limiting**:
   - Implement exponential backoff
   - Optimize batch sizes
   - Schedule non-urgent operations during off-peak hours

4. **Webhook Delivery Failures**:
   - Ensure endpoint is publicly accessible
   - Check for firewall restrictions
   - Verify correct response codes (2xx)

### Logging and Monitoring

1. **Integration Logs**:
   - Enable detailed logging for troubleshooting
   - Retain logs for an appropriate period
   - Implement log rotation

2. **Monitoring Tools**:
   - Set up alerts for integration failures
   - Monitor API usage and rate limits
   - Track synchronization performance

### Support Resources

For integration support:

- Email: integration-support@gasable.com
- Support Portal: https://support.gasable.com/integration
- API Status: https://status.gasable.com
- Developer Community: https://community.gasable.com/developers

## Conclusion

Successful integration with the Gasable Supplier Portal requires careful planning, implementation, and ongoing maintenance. By following the guidelines in this document, you can establish reliable and efficient integrations that enhance your business operations.

For additional assistance, please contact our integration support team.