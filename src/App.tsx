import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './lib/auth';
import DemoModeIndicator from './components/DemoModeIndicator';
import TestComponent from './components/TestComponent';

// Auth Pages
import LandingPage from './pages/LandingPage';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

// Dashboard and Layout
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Setup Pages
import Setup from './pages/Setup';
import AddStore from './pages/AddStore';
import AddProduct from './pages/AddProduct';
import ShipmentSetup from './pages/ShipmentSetup';
import Approval from './pages/Approval';
import GoLive from './pages/GoLive';
import ProductManagement from './pages/ProductManagement';
import ProductPricing from './pages/ProductPricing';
import IoTIntegration from './pages/IoTIntegration';

// Store Management Pages
import BranchDirectory from './pages/stores/BranchDirectory';
import AddBranch from './pages/stores/AddBranch';
import EmployeeDirectory from './pages/stores/EmployeeDirectory';
import CustomerDirectory from './pages/stores/CustomerDirectory';
import AssetManagement from './pages/stores/AssetManagement';

// Order Management Pages
import OrdersShipments from './pages/OrdersShipments';
import ShipmentTracking from './pages/ShipmentTracking';
import OrderHistory from './pages/OrderHistory';
import OrdersFeedback from './pages/OrdersFeedback';
import OrderManagement from './pages/OrderManagement';

// Finance Pages
import Finance from './pages/Finance';
import FinanceTransactions from './pages/FinanceTransactions';
import AccountStatement from './pages/AccountStatement';
import Invoices from './pages/Invoices';
import FinanceSettings from './pages/FinanceSettings';

// Analytics Pages
import Overview from './pages/analytics/Overview';
import SalesAnalytics from './pages/analytics/SalesAnalytics';
import ProductPerformance from './pages/analytics/ProductPerformance';
import CustomerInsights from './pages/analytics/CustomerInsights';
import MarketAnalysis from './pages/analytics/MarketAnalysis';
import LogisticsReports from './pages/analytics/LogisticsReports';

// Campaign Pages
import CampaignsOverview from './pages/campaigns/CampaignsOverview';
import ManagePromotions from './pages/campaigns/ManagePromotions';
import SpecialOffers from './pages/campaigns/SpecialOffers';
import LoyaltyPrograms from './pages/campaigns/LoyaltyPrograms';
import CampaignAnalytics from './pages/campaigns/CampaignAnalytics';

// Settings Pages
import SettingsPage from './pages/settings/Settings';
import MerchantProfile from './pages/settings/MerchantProfile';
import SecuritySettings from './pages/settings/SecuritySettings';
import IntegrationsSettings from './pages/settings/IntegrationsSettings';
import SupportCenter from './pages/settings/SupportCenter';
import UserPreferences from './pages/settings/UserPreferences';
import SubscriptionManagement from './pages/settings/SubscriptionManagement';
import TicketingSystem from './pages/settings/TicketingSystem';

// Other Pages
import RealTimeMetrics from './pages/RealTimeMetrics';
import Notifications from './pages/Notifications';
import LogisticsShipment from './pages/LogisticsShipment';
import Reports from './pages/Reports';
import UsersCustomersManagement from './pages/users/UsersCustomersManagement';

// Add-ons Pages
import AddonsMarketplace from './pages/AddonsMarketplace';
import IoTIntegrationAddon from './pages/addons/IoTIntegration';
import FleetManagement from './pages/addons/FleetManagement';
import EaaSSubscription from './pages/addons/EaaSSubscription';
import EnergySolutions from './pages/addons/EnergySolutions';

function App() {
  const { user, loading, isDemoMode } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <DemoModeIndicator />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/test" element={<TestComponent />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Dashboard Metrics */}
        <Route
          path="/dashboard/metrics"
          element={
            <ProtectedRoute>
              <Layout>
                <RealTimeMetrics />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/notifications"
          element={
            <ProtectedRoute>
              <Layout>
                <Notifications />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Setup Routes */}
        <Route
          path="/setup"
          element={
            <ProtectedRoute>
              <Layout>
                <Setup />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/setup/add-store"
          element={
            <ProtectedRoute>
              <Layout>
                <AddStore />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/setup/add-product"
          element={
            <ProtectedRoute>
              <Layout>
                <AddProduct />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/setup/shipment"
          element={
            <ProtectedRoute>
              <Layout>
                <ShipmentSetup />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/setup/approval"
          element={
            <ProtectedRoute>
              <Layout>
                <Approval />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/setup/go-live"
          element={
            <ProtectedRoute>
              <Layout>
                <GoLive />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Product Management */}
        <Route
          path="/dashboard/setup/products"
          element={
            <ProtectedRoute>
              <Layout>
                <ProductManagement />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/setup/pricing"
          element={
            <ProtectedRoute>
              <Layout>
                <ProductPricing />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/setup/logistics"
          element={
            <ProtectedRoute>
              <Layout>
                <LogisticsShipment />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/setup/iot"
          element={
            <ProtectedRoute>
              <Layout>
                <IoTIntegration />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Store Management Routes */}
        <Route
          path="/dashboard/stores/branches"
          element={
            <ProtectedRoute>
              <Layout>
                <BranchDirectory />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/stores/add-branch"
          element={
            <ProtectedRoute>
              <Layout>
                <AddBranch />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/stores/employees"
          element={
            <ProtectedRoute>
              <Layout>
                <EmployeeDirectory />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/stores/customers"
          element={
            <ProtectedRoute>
              <Layout>
                <CustomerDirectory />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/stores/assets"
          element={
            <ProtectedRoute>
              <Layout>
                <AssetManagement />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Users & Customers Management Routes */}
        <Route
          path="/dashboard/users"
          element={
            <ProtectedRoute>
              <Layout>
                <UsersCustomersManagement />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Order Management Routes */}
        <Route
          path="/dashboard/orders"
          element={
            <ProtectedRoute>
              <Layout>
                <OrdersShipments />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/orders/management"
          element={
            <ProtectedRoute>
              <Layout>
                <OrderManagement />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/orders/tracking"
          element={
            <ProtectedRoute>
              <Layout>
                <ShipmentTracking />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/orders/history"
          element={
            <ProtectedRoute>
              <Layout>
                <OrderHistory />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/orders/feedback"
          element={
            <ProtectedRoute>
              <Layout>
                <OrdersFeedback />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Finance Routes */}
        <Route
          path="/dashboard/finance"
          element={
            <ProtectedRoute>
              <Layout>
                <Finance />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/finance/transactions"
          element={
            <ProtectedRoute>
              <Layout>
                <FinanceTransactions />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/finance/statement"
          element={
            <ProtectedRoute>
              <Layout>
                <AccountStatement />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/finance/invoices"
          element={
            <ProtectedRoute>
              <Layout>
                <Invoices />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/finance/settings"
          element={
            <ProtectedRoute>
              <Layout>
                <FinanceSettings />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Analytics Routes */}
        <Route
          path="/dashboard/analytics"
          element={
            <ProtectedRoute>
              <Layout>
                <Overview />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/analytics/sales"
          element={
            <ProtectedRoute>
              <Layout>
                <SalesAnalytics />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/analytics/products"
          element={
            <ProtectedRoute>
              <Layout>
                <ProductPerformance />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/analytics/customers"
          element={
            <ProtectedRoute>
              <Layout>
                <CustomerInsights />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/analytics/market"
          element={
            <ProtectedRoute>
              <Layout>
                <MarketAnalysis />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/analytics/logistics"
          element={
            <ProtectedRoute>
              <Layout>
                <LogisticsReports />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Campaign Routes */}
        <Route
          path="/dashboard/campaigns"
          element={
            <ProtectedRoute>
              <Layout>
                <CampaignsOverview />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/campaigns/promotions"
          element={
            <ProtectedRoute>
              <Layout>
                <ManagePromotions />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/campaigns/offers"
          element={
            <ProtectedRoute>
              <Layout>
                <SpecialOffers />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/campaigns/loyalty"
          element={
            <ProtectedRoute>
              <Layout>
                <LoyaltyPrograms />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/campaigns/analytics"
          element={
            <ProtectedRoute>
              <Layout>
                <CampaignAnalytics />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Add-ons Routes */}
        <Route
          path="/dashboard/addons/marketplace"
          element={
            <ProtectedRoute>
              <Layout>
                <AddonsMarketplace />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/addons/iot"
          element={
            <ProtectedRoute>
              <Layout>
                <IoTIntegrationAddon />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/addons/fleet"
          element={
            <ProtectedRoute>
              <Layout>
                <FleetManagement />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/addons/eaas"
          element={
            <ProtectedRoute>
              <Layout>
                <EaaSSubscription />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/addons/energy"
          element={
            <ProtectedRoute>
              <Layout>
                <EnergySolutions />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Settings Routes */}
        <Route
          path="/dashboard/settings"
          element={
            <ProtectedRoute>
              <Layout>
                <SettingsPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/settings/preferences"
          element={
            <ProtectedRoute>
              <Layout>
                <UserPreferences />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/settings/security"
          element={
            <ProtectedRoute>
              <Layout>
                <SecuritySettings />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/settings/integrations"
          element={
            <ProtectedRoute>
              <Layout>
                <IntegrationsSettings />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/settings/support"
          element={
            <ProtectedRoute>
              <Layout>
                <SupportCenter />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/settings/merchant-profile"
          element={
            <ProtectedRoute>
              <Layout>
                <MerchantProfile />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/settings/tickets"
          element={
            <ProtectedRoute>
              <Layout>
                <TicketingSystem />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/settings/subscription"
          element={
            <ProtectedRoute>
              <Layout>
                <SubscriptionManagement />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Reports */}
        <Route
          path="/dashboard/reports"
          element={
            <ProtectedRoute>
              <Layout>
                <Reports />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} />} />
      </Routes>
    </Router>
  );
}

export default App;