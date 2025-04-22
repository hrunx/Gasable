import React, { useRef } from 'react';
import { jsPDF } from 'jspdf';
import { FileText, Download, Mail, Printer, CheckCircle, AlertTriangle, XCircle, BarChart, Lightbulb, Thermometer } from 'lucide-react';
import { AuditLevelInfo } from './AuditLevelInfo';

interface AuditReportProps {
  buildingData: {
    name: string;
    address: string;
    type: string;
    area: number;
    constructionYear: number;
  };
  energyData: {
    annualConsumption: number;
    peakDemand: number;
    carbonFootprint: number;
    energyCost: number;
  };
  equipment: Array<{
    type: string;
    count: number;
    avgEfficiency: number;
    condition: string;
  }>;
  recommendations: Array<{
    title: string;
    description: string;
    savings: number;
    cost: number;
    roi: number;
    priority: 'High' | 'Medium' | 'Low';
  }>;
}

export function AuditReport({
  buildingData,
  energyData,
  equipment,
  recommendations
}: AuditReportProps) {
  const reportRef = useRef<HTMLDivElement>(null);

  const generatePDF = () => {
    if (!reportRef.current) return;

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Add report content
    doc.setFontSize(24);
    doc.text('Energy Audit Report', 20, 20);
    
    doc.setFontSize(14);
    doc.text(`Building: ${buildingData.name}`, 20, 40);
    doc.text(`Address: ${buildingData.address}`, 20, 50);
    doc.text(`Type: ${buildingData.type}`, 20, 60);
    doc.text(`Area: ${buildingData.area} m²`, 20, 70);
    
    // Add more sections...
    
    doc.save('energy-audit-report.pdf');
  };

  const getStatusColor = (value: number, threshold: number) => {
    if (value <= threshold * 0.8) return 'text-green-600';
    if (value <= threshold * 1.2) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const complianceTable = [
    { section: 'Intake', ashrae: 'Level I', iso: 'ISO 50001:2018, Clause 6.3' },
    { section: 'Detailed Audit', ashrae: 'Level II', iso: 'ISO 50002:2014, Sections 5-8' },
    { section: 'Simulation', ashrae: 'Level III', iso: 'ISO 50002:2014, Section 9' },
    { section: 'M&V', ashrae: 'N/A', iso: 'ISO 50006 + IPMVP Option B' }
  ];

  return (
    <div className="space-y-8" ref={reportRef}>
      <div className="flex flex-col gap-4">
        <AuditLevelInfo 
          level="III"
          isoStandard="ISO 50001/50002 Compliance"
          className="mb-4"
        />
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Summary</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ASHRAE Level</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ISO Clause</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {complianceTable.map((row, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.section}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.ashrae}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.iso}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Energy Audit Report</h2>
        <div className="flex gap-4">
          <button
            onClick={generatePDF}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Mail className="w-4 h-4" />
            Share
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Printer className="w-4 h-4" />
            Print
          </button>
        </div>
      </div>

      {/* Building Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Building Information</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <label className="text-sm text-gray-500">Building Name</label>
            <p className="font-medium text-gray-900">{buildingData.name}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Building Type</label>
            <p className="font-medium text-gray-900">{buildingData.type}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Total Area</label>
            <p className="font-medium text-gray-900">{buildingData.area} m²</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Construction Year</label>
            <p className="font-medium text-gray-900">{buildingData.constructionYear}</p>
          </div>
        </div>
      </div>

      {/* Energy Performance */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Energy Performance</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BarChart className="w-5 h-5 text-blue-600" />
              <label className="text-sm text-gray-500">Annual Consumption</label>
            </div>
            <p className="font-medium text-gray-900">{energyData.annualConsumption} kWh</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-5 h-5 text-yellow-600" />
              <label className="text-sm text-gray-500">Peak Demand</label>
            </div>
            <p className="font-medium text-gray-900">{energyData.peakDemand} kW</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Thermometer className="w-5 h-5 text-red-600" />
              <label className="text-sm text-gray-500">Carbon Footprint</label>
            </div>
            <p className="font-medium text-gray-900">{energyData.carbonFootprint} tCO₂e</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-green-600" />
              <label className="text-sm text-gray-500">Energy Cost</label>
            </div>
            <p className="font-medium text-gray-900">{formatCurrency(energyData.energyCost)}</p>
          </div>
        </div>
      </div>

      {/* Equipment Summary */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Equipment Summary</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Efficiency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condition</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {equipment.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.count}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.avgEfficiency}%</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.condition === 'Excellent' ? 'bg-green-100 text-green-800' :
                      item.condition === 'Good' ? 'bg-blue-100 text-blue-800' :
                      item.condition === 'Fair' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {item.condition}
                    </span>
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
        <div className="space-y-4">
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
              <div className="mt-4 grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-gray-500">Annual Savings</label>
                  <p className="font-medium text-green-600">{formatCurrency(rec.savings)}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Implementation Cost</label>
                  <p className="font-medium text-gray-900">{formatCurrency(rec.cost)}</p>
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

      {/* Summary */}
      <div className="bg-green-50 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-green-900 mb-4">Executive Summary</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium text-green-900">Total Potential Savings</h4>
              <p className="text-green-800">
                {formatCurrency(recommendations.reduce((acc, rec) => acc + rec.savings, 0))} per year
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Implementation Investment</h4>
              <p className="text-blue-800">
                {formatCurrency(recommendations.reduce((acc, rec) => acc + rec.cost, 0))}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
              <BarChart className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h4 className="font-medium text-purple-900">Average ROI</h4>
              <p className="text-purple-800">
                {Math.round(recommendations.reduce((acc, rec) => acc + rec.roi, 0) / recommendations.length)}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}