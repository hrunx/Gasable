import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  BarChart2,
  Filter,
  Download,
  Calendar,
  MapPin,
  Package,
  User,
  Clock,
  Search,
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowUpDown,
  Eye,
  FileText,
  Printer,
  Share2,
  MoreVertical,
  Tag,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface Feedback {
  id: string;
  orderId: string;
  customerName: string;
  customerType: 'B2B' | 'B2C';
  productName: string;
  rating: number;
  comment: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  date: string;
  location: string;
  tags: string[];
  helpful: number;
  response?: {
    text: string;
    date: string;
  };
}

const mockFeedback: Feedback[] = [
  {
    id: '1',
    orderId: 'ORD-2024-001',
    customerName: 'Acme Industries',
    customerType: 'B2B',
    productName: 'Industrial Gas Tank',
    rating: 5,
    comment: 'Excellent service and product quality. The delivery was on time and the installation team was very professional.',
    sentiment: 'positive',
    date: '2024-03-15',
    location: 'Riyadh',
    tags: ['Quality', 'Service', 'Delivery'],
    helpful: 12,
    response: {
      text: 'Thank you for your positive feedback! We\'re glad you had a great experience.',
      date: '2024-03-16'
    }
  },
  {
    id: '2',
    orderId: 'ORD-2024-002',
    customerName: 'Green Energy Corp',
    customerType: 'B2B',
    productName: 'Solar Panel Kit',
    rating: 4,
    comment: 'Good product but installation took longer than expected. Team was knowledgeable though.',
    sentiment: 'neutral',
    date: '2024-03-14',
    location: 'Jeddah',
    tags: ['Installation', 'Service'],
    helpful: 8
  },
  {
    id: '3',
    orderId: 'ORD-2024-003',
    customerName: 'John Smith',
    customerType: 'B2C',
    productName: 'Premium Gas Cylinder',
    rating: 5,
    comment: 'Very satisfied with the product. Easy ordering process and quick delivery.',
    sentiment: 'positive',
    date: '2024-03-13',
    location: 'Dammam',
    tags: ['Delivery', 'Ease of Use'],
    helpful: 15
  }
];

const OrdersFeedback = () => {
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Analytics Data
  const stats = {
    averageRating: 4.7,
    totalReviews: 156,
    responseRate: 92,
    satisfactionScore: 95
  };

  const ratingDistribution = [
    { rating: 5, count: 85 },
    { rating: 4, count: 45 },
    { rating: 3, count: 15 },
    { rating: 2, count: 8 },
    { rating: 1, count: 3 }
  ];

  const sentimentData = [
    { name: 'Positive', value: 75, color: '#34D399' },
    { name: 'Neutral', value: 15, color: '#FCD34D' },
    { name: 'Negative', value: 10, color: '#F87171' }
  ];

  const tagAnalytics = [
    { tag: 'Quality', count: 45 },
    { tag: 'Service', count: 38 },
    { tag: 'Delivery', count: 32 },
    { tag: 'Installation', count: 28 },
    { tag: 'Price', count: 25 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <h1 className="text-2xl font-bold text-secondary-900 mb-2">
          ⭐ Customer Feedback & Ratings
        </h1>
        <p className="text-secondary-600">
          Monitor customer satisfaction, analyze feedback trends, and improve your service quality.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100"
        >
          <div className="flex items-center justify-between mb-2">
            <Star className="h-6 w-6 text-yellow-500" />
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-secondary-900">{stats.averageRating}</h3>
          <p className="text-secondary-600">Average Rating</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100"
        >
          <div className="flex items-center justify-between mb-2">
            <MessageSquare className="h-6 w-6 text-blue-500" />
            <span className="text-sm text-green-500">+12%</span>
          </div>
          <h3 className="text-2xl font-bold text-secondary-900">{stats.totalReviews}</h3>
          <p className="text-secondary-600">Total Reviews</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100"
        >
          <div className="flex items-center justify-between mb-2">
            <Clock className="h-6 w-6 text-purple-500" />
            <span className="text-sm text-green-500">+5%</span>
          </div>
          <h3 className="text-2xl font-bold text-secondary-900">{stats.responseRate}%</h3>
          <p className="text-secondary-600">Response Rate</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100"
        >
          <div className="flex items-center justify-between mb-2">
            <ThumbsUp className="h-6 w-6 text-green-500" />
            <span className="text-sm text-green-500">+3%</span>
          </div>
          <h3 className="text-2xl font-bold text-secondary-900">{stats.satisfactionScore}%</h3>
          <p className="text-secondary-600">Satisfaction Score</p>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Rating Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
          <h2 className="text-lg font-semibold text-secondary-900 mb-6">Rating Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ratingDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="rating" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip />
                <Bar dataKey="count" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sentiment Analysis */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
          <h2 className="text-lg font-semibold text-secondary-900 mb-6">Sentiment Analysis</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            {sentimentData.map((item) => (
              <div key={item.name} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-secondary-600">
                  {item.name} ({item.value}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feedback List */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-secondary-900">Recent Feedback</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search feedback..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>
            <button className="p-2 hover:bg-secondary-100 rounded-lg text-secondary-600">
              <Filter className="h-5 w-5" />
            </button>
            <button className="p-2 hover:bg-secondary-100 rounded-lg text-secondary-600">
              <Download className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {mockFeedback.map((feedback) => (
            <motion.div
              key={feedback.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-secondary-50 rounded-xl"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-lg">{feedback.customerName}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      feedback.customerType === 'B2B'
                        ? 'bg-purple-50 text-purple-700'
                        : 'bg-blue-50 text-blue-700'
                    }`}>
                      {feedback.customerType}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-secondary-600">
                    <div className="flex items-center space-x-1">
                      <Package className="h-4 w-4" />
                      <span>{feedback.productName}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{feedback.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{feedback.date}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < feedback.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-secondary-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <p className="mt-4 text-secondary-800">{feedback.comment}</p>

              <div className="mt-4 flex items-center space-x-2">
                {feedback.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-white rounded-full text-sm text-secondary-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {feedback.response && (
                <div className="mt-4 pl-4 border-l-2 border-primary-200">
                  <p className="text-secondary-700">{feedback.response.text}</p>
                  <p className="mt-1 text-sm text-secondary-500">
                    Responded on {feedback.response.date}
                  </p>
                </div>
              )}

              <div className="mt-4 flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-1 text-secondary-600 hover:text-secondary-800">
                    <ThumbsUp className="h-4 w-4" />
                    <span>Helpful ({feedback.helpful})</span>
                  </button>
                  <button className="flex items-center space-x-1 text-secondary-600 hover:text-secondary-800">
                    <MessageSquare className="h-4 w-4" />
                    <span>Reply</span>
                  </button>
                </div>
                <span className="text-secondary-500">Order #{feedback.orderId}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tag Analytics */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <h2 className="text-lg font-semibold text-secondary-900 mb-6">Common Feedback Topics</h2>
        <div className="grid grid-cols-5 gap-4">
          {tagAnalytics.map((tag) => (
            <div
              key={tag.tag}
              className="p-4 bg-secondary-50 rounded-lg text-center"
            >
              <h3 className="text-xl font-bold text-secondary-900">{tag.count}</h3>
              <p className="text-sm text-secondary-600">{tag.tag}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrdersFeedback;