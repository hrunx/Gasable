import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  DoughnutController,
  LineController,
  BarElement,
  BarController
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { format } from 'date-fns';
import { 
  Building2, 
  Lightbulb, 
  Thermometer, 
  BarChart, 
  ArrowDown, 
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Leaf,
  Clock,
  FileText,
  Download,
  Mail,
  Printer
} from 'lucide-react';
import { AuditLevelInfo } from './AuditLevelInfo';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  DoughnutController,
  LineController,
  BarElement,
  BarController
);

interface AuditSummaryProps {
  buildingData: {
    name: string;
    address: string;
    type: string;
    area: number;
    constructionYear: number;
    rooms: Array<{
      name: string;
      area: number;
      lightingType: string;
      numFixtures: number;
      acType: string;
      acSize: number;
    }>;
  };
  equipmentData: Array<{
    name: string;
    category: string;
    subType: string;
    location: string;
    ratedPower: number;
    efficiency: number;
    condition: string;
    annualEnergy: number;
    savingsPotential: number;
  }>;
  energyData: {
    annual: {
      consumption: number;
      cost: number;
      emissions: number;
    };
    monthly: Array<{
      date: string;
      consumption: number;
      peak: number;
    }>;
    distribution: {
      hvac: number;
      lighting: number;
      equipment: number;
      other: number;
    };
  };
  recommendations: Array<{
    category: string;
    title: string;
    description: string;
    savings: {
      energy: number;
      cost: number;
      carbon: number;
    };
    investment: number;
    roi: number;
    payback: number;
    priority: 'High' | 'Medium' | 'Low';
  }>;
  complianceData: {
    ashrae: {
      level: string;
      requirements: Array<{
        item: string;
        status: 'complete' | 'partial' | 'missing';
      }>;
    };
    iso: {
      standard: string;
      conformity: number;
    };
  };
}

export function AuditSummary({
  buildingData,
  equipmentData,
  energyData,
  recommendations,
  complianceData
}: AuditSummaryProps) {
  const totalSavings = recommendations.reduce((acc, rec) => acc + rec.savings.cost, 0);
  const totalInvestment = recommendations.reduce((acc, rec) => acc + rec.investment, 0);
  const averageROI = recommendations.reduce((acc, rec) => acc + rec.roi, 0) / recommendations.length;
  
  const monthlyConsumptionData = {
    labels: energyData.monthly.map(m => format(new Date(m.date), 'MMM yyyy')),
    datasets: [
      {
        label: 'Energy Consumption (kWh)',
        data: energyData.monthly.map(m => m.consumption),
        borderColor: 'rgb(34, 197, 94)',
        tension: 0.1
      },
      {
        label: 'Peak Demand (kW)',
        data: energyData.monthly.map(m => m.peak),
        borderColor: 'rgb(234, 179, 8)',
        tension: 0.1
      }
    ]
  };

  const energyDistributionData = {
    labels: ['HVAC', 'Lighting', 'Equipment', 'Other'],
    datasets: [{
      data: [
        energyData.distribution.hvac,
        energyData.distribution.lighting,
        energyData.distribution.equipment,
        energyData.distribution.other
      ],
      backgroundColor: [
        'rgb(34, 197, 94)',
        'rgb(234, 179, 8)',
        'rgb(59, 130, 246)',
        'rgb(107, 114, 128)'
      ]
    }]
  };

  const savingsByCategory = {
    labels: ['HVAC', 'Lighting', 'Equipment', 'Controls'],
    datasets: [{
      label: 'Potential Savings ($)',
      data: recommendations.reduce((acc, rec) => {
        const category = rec.category.toLowerCase();
        acc[category] = (acc[category] || 0) + rec.savings.cost;
        return acc;
      }, {} as Record<string, number>),
      backgroundColor: 'rgb(34, 197, 94)'
    }]
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Energy Audit Report</h1>
          <p className="text-gray-600 mt-2">Generated on {format(new Date(), 'MMMM d, yyyy')}</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Download className="w-4 h-4" /> Download PDF
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Mail className="w-4 h-4" /> Share
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Printer className="w-4 h-4" /> Print
          </button>
        </div>
      </div>

      {/* Compliance Info */}
      <AuditLevelInfo 
        level={complianceData.ashrae.level as 'I' | 'II' | 'III'}
        isoStandard={complianceData.iso.standard}
      />

      {/* Executive Summary */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Executive Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-green-900">Annual Savings</h3>
            </div>
            <p className="text-2xl font-bold text-green-700">
              ${totalSavings.toLocaleString()}
            </p>
            <p className="text-sm text-green-600 mt-1">Potential annual cost reduction</p>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900">ROI</h3>
            </div>
            <p className="text-2xl font-bold text-blue-700">
              {averageROI.toFixed(1)}%
            </p>
            <p className="text-sm text-blue-600 mt-1">Average return on investment</p>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              <h3 className="font-semibold text-yellow-900">Payback Period</h3>
            </div>
            <p className="text-2xl font-bold text-yellow-700">
              {(totalInvestment / (totalSavings / 12)).toFixed(1)} months
            </p>
            <p className="text-sm text-yellow-600 mt-1">Average time to break even</p>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Leaf className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-purple-900">CO₂ Reduction</h3>
            </div>
            <p className="text-2xl font-bold text-purple-700">
              {recommendations.reduce((acc, rec) => acc + rec.savings.carbon, 0).toFixed(1)} tons
            </p>
            <p className="text-sm text-purple-600 mt-1">Annual carbon reduction</p>
          </div>
        </div>
      </div>

      {/* Energy Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Energy Profile</h3>
          <Line data={monthlyConsumptionData} options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top' as const,
              }
            }
          }} />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Energy Distribution</h3>
          <Doughnut data={energyDistributionData} options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top' as const,
              }
            }
          }} />
        </div>
      </div>

      {/* Equipment Analysis */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Equipment Analysis</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Annual Energy (kWh)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Efficiency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Savings Potential</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {equipmentData.map((equipment, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{equipment.name}</div>
                    <div className="text-sm text-gray-500">{equipment.category} - {equipment.subType}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {equipment.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {equipment.annualEnergy.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      equipment.efficiency >= 90 ? 'bg-green-100 text-green-800' :
                      equipment.efficiency >= 75 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {equipment.efficiency}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {equipment.savingsPotential > 0 && (
                      <span className="text-green-600">
                        {equipment.savingsPotential.toLocaleString()} kWh/year
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
        <div className="space-y-6">
          {recommendations.map((rec, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">{rec.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  rec.priority === 'High' ? 'bg-red-100 text-red-800' :
                  rec.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {rec.priority} Priority
                </span>
              </div>
              <div className="mt-4 grid grid-cols-4 gap-4">
                <div>
                  <label className="text-xs text-gray-500">Energy Savings</label>
                  <p className="font-medium text-gray-900">{rec.savings.energy.toLocaleString()} kWh/year</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Cost Savings</label>
                  <p className="font-medium text-green-600">${rec.savings.cost.toLocaleString()}/year</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Investment</label>
                  <p className="font-medium text-gray-900">${rec.investment.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">ROI</label>
                  <p className="font-medium text-blue-600">{rec.roi}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance Details */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Summary</h3>
        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">ASHRAE Level {complianceData.ashrae.level} Requirements</h4>
            <div className="space-y-2">
              {complianceData.ashrae.requirements.map((req, index) => (
                <div key={index} className="flex items-center gap-2">
                  {req.status === 'complete' ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : req.status === 'partial' ? (
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  )}
                  <span className="text-sm text-gray-700">{req.item}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">ISO Conformity</h4>
            <div className="flex items-center gap-4">
              <div className="flex-grow bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${complianceData.iso.conformity}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-700">
                {complianceData.iso.conformity}% Complete
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}