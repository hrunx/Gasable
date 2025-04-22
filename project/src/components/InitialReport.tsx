import React, { useState, useEffect } from 'react';
import { AlertTriangle, ArrowRight, Loader2, FileText, Lightbulb, Thermometer, BarChart } from 'lucide-react';
import { analyzeFilesWithProxy, talkToDeepSeek } from '../lib/deepseek';
import { supabase } from '../lib/supabase';
import { AuditLevelInfo } from './AuditLevelInfo';

interface FormData {
  name: string;
  phone: string;
  email: string;
  address: string;
  floorArea: string;
  rooms: string;
  residents: string;
  electricityBills: File[];
  floorPlan: File | null;
}

interface RoomData {
  name: string;
  area: number;
  type?: string;
  windows?: number;
  lighting_type?: string;
  num_fixtures?: number;
  ac_type?: string;
  ac_size?: number;
}

interface InitialReportProps {
  formData: FormData;
  onStartDetailedAudit: (roomData: RoomData[]) => void;
}

export function InitialReport({ formData, onStartDetailedAudit }: InitialReportProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<any | null>(null);
  const [buildingId, setBuildingId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [roomData, setRoomData] = useState<RoomData[]>([]);

  useEffect(() => {
    const tempId = crypto.randomUUID();
    setBuildingId(tempId);
    initializeBuilding(tempId);
  }, []);

  async function initializeBuilding(tempBuildingId: string) {
    try {
      await createTemporaryBuilding(tempBuildingId);
      await uploadFiles(tempBuildingId);
    } catch (error) {
      console.error('Initialization error:', error);
      setError(`Failed to initialize: ${error.message}`);
    }
  }

  async function uploadFileToStorage(file: File, buildingId: string): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    
    setUploadProgress(prev => ({
      ...prev,
      [file.name]: 0
    }));

    try {
      const { data, error } = await supabase.storage
        .from('audit-files')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
          onUploadProgress(progress) {
            const percent = Math.round((progress.loaded / progress.total) * 100);
            setUploadProgress(prev => ({
              ...prev,
              [file.name]: percent
            }));
          }
        });

      if (error) {
        console.error('[Storage] Upload failed:', error);
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('audit-files')
        .getPublicUrl(fileName);

      await supabase
        .from('audit_files')
        .insert({
          file_url: publicUrl,
          file_name: file.name,
          file_type: file.type,
          building_id: buildingId
        });

      setUploadProgress(prev => ({
        ...prev,
        [file.name]: 100
      }));

      return publicUrl;
    } catch (error) {
      console.error('[Storage] Upload failed:', error);
      setUploadProgress(prev => ({
        ...prev,
        [file.name]: 0
      }));
      throw error;
    }
  }

  async function uploadFiles(tempBuildingId: string) {
    setIsUploading(true);
    setError(null);
    
    try {
      const allFiles = [...formData.electricityBills];
      if (formData.floorPlan) allFiles.push(formData.floorPlan);

      const initialProgress = allFiles.reduce((acc, file) => ({
        ...acc,
        [file.name]: 0
      }), {});
      setUploadProgress(initialProgress);

      await Promise.all(allFiles.map(file => uploadFileToStorage(file, tempBuildingId)));
      setIsUploading(false);
    } catch (error) {
      console.error('Upload error:', error);
      setError(`Failed to upload files: ${error.message}`);
      setIsUploading(false);
    }
  }

  async function createTemporaryBuilding(buildingId: string) {
    const { error } = await supabase
      .from('buildings')
      .insert({
        id: buildingId,
        name: formData.name || 'Temporary Building',
        address: formData.address,
        type: 'residential',
        area: parseFloat(formData.floorArea),
        construction_year: new Date().getFullYear(),
      });

    if (error) {
      throw new Error(`Failed to create building record: ${error.message}`);
    }
  }

  async function generateReport(tempBuildingId: string) {
    setError(null);
    
    if (!formData.electricityBills.length) {
      setError('Please upload at least one electricity bill.');
      return;
    }
    if (!formData.floorPlan) {
      setError('Please upload a floor plan.');
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    
    const validateFile = (file: File) => {
      if (file.size > maxSize) {
        throw new Error(`File ${file.name} exceeds maximum size of 10MB`);
      }
      if (!validTypes.includes(file.type)) {
        throw new Error(`File ${file.name} must be PDF, JPEG, or PNG`);
      }
    };

    try {
      formData.electricityBills.forEach(validateFile);
      if (formData.floorPlan) validateFile(formData.floorPlan);
    } catch (err) {
      setError(err.message);
      return;
    }

    setLoading(true);
    try {
      console.log('[InitialReport] Starting report generation');

      const billsText = await analyzeFilesWithProxy(
        Array.from(formData.electricityBills),
        tempBuildingId
      ).catch(err => {
        throw new Error(`Failed to analyze electricity bills: ${err.message}`);
      });
      
      const planText = await analyzeFilesWithProxy(
        [formData.floorPlan],
        tempBuildingId
      ).catch(err => {
        throw new Error(`Failed to analyze floor plan: ${err.message}`);
      });

      const prompt = `
        As an expert energy auditor, analyze this building data and provide a structured JSON response with the following format:
        {
          "energyConsumption": {
            "annual": number (kWh),
            "peak": number (kW),
            "average": number (kWh/month)
          },
          "carbonFootprint": number (tCO2e/year),
          "costMetrics": {
            "annual": number (USD),
            "perSquareMeter": number (USD/m²)
          },
          "recommendations": [
            {
              "title": string,
              "description": string,
              "potentialSavings": number (USD/year),
              "priority": "high" | "medium" | "low"
            }
          ],
          "roomData": [
            {
              "name": string,
              "area": number,
              "type": string,
              "windows": number
            }
          ]
        }

        Building Details:
        - Floor Area: ${formData.floorArea} m²
        - Number of Rooms: ${formData.rooms}
        - Number of Residents: ${formData.residents}

        Electricity Bills Analysis:
        ${billsText}

        Floor Plan Analysis:
        ${planText}

        Please analyze the floor plan carefully and identify:
        1. Number and types of rooms
        2. Approximate area of each room
        3. Number of windows per room (if visible)
        4. Room layout and arrangement
      `.trim();

      const response = await talkToDeepSeek(prompt);
      console.debug('[InitialReport] raw analysis:', response);

      let jsonText: string;
      const fenceMatch = response.match(/```json\s*([\s\S]*?)\s*```/i);
      
      if (fenceMatch) {
        jsonText = fenceMatch[1];
      } else {
        const firstBrace = response.indexOf('{');
        if (firstBrace === -1) {
          throw new Error('Could not find JSON data in the AI response');
        }
        jsonText = response.slice(firstBrace);
      }

      let analysisResult: any;
      try {
        analysisResult = JSON.parse(jsonText);
        setRoomData(analysisResult.roomData || []);
      } catch (e) {
        console.error('[InitialReport] invalid JSON payload:', jsonText);
        throw new Error(`Failed to parse AI response as JSON: ${e instanceof Error ? e.message : String(e)}`);
      }

      setReport(analysisResult);
      console.log('[InitialReport] Report generation completed successfully');
    } catch (err) {
      console.error('[InitialReport] Error generating report:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(`Failed to generate report: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }

  const renderAIRecommendations = (recommendations: string) => {
    return (
      <div className="mt-2 p-4 bg-green-50 rounded">
        <div className="font-medium text-green-800 mb-2">AI Recommendations:</div>
        <div className="text-green-700 whitespace-pre-line">
          {recommendations}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-green-600" />
          <p className="text-gray-600">Analyzing files and generating report...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-red-600">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Uploading Files</h3>
          <div className="space-y-4">
            {Object.entries(uploadProgress).map(([fileName, progress]) => (
              <div key={fileName} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 truncate max-w-[80%]">{fileName}</span>
                  <span className="text-gray-900 font-medium">{progress}%</span>
                </div>
                <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="absolute left-0 top-0 h-full bg-green-600 transition-all duration-300 ease-out rounded-full"
                    style={{ 
                      width: `${progress}%`,
                      transition: 'width 0.3s ease-out'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={() => buildingId && generateReport(buildingId)}
            disabled={isUploading || Object.values(uploadProgress).some(p => p < 100)}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
              isUploading || Object.values(uploadProgress).some(p => p < 100)
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            Generate Initial Report
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AuditLevelInfo 
        level="I"
        isoStandard="ISO 50001:2018 Energy Review"
        className="mb-6"
      />

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Initial Energy Assessment</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900">Annual Consumption</h3>
            </div>
            <p className="text-2xl font-bold text-blue-700">{report.energyConsumption.annual.toLocaleString()} kWh</p>
            <p className="text-sm text-blue-600 mt-1">Peak: {report.energyConsumption.peak} kW</p>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Thermometer className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-green-900">Carbon Footprint</h3>
            </div>
            <p className="text-2xl font-bold text-green-700">{report.carbonFootprint.toFixed(1)} tCO₂e</p>
            <p className="text-sm text-green-600 mt-1">Per Year</p>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-5 h-5 text-yellow-600" />
              <h3 className="font-semibold text-yellow-900">Energy Cost</h3>
            </div>
            <p className="text-2xl font-bold text-yellow-700">${report.costMetrics.annual.toLocaleString()}</p>
            <p className="text-sm text-yellow-600 mt-1">${report.costMetrics.perSquareMeter}/m² annually</p>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-purple-900">Recommendations</h3>
            </div>
            <p className="text-2xl font-bold text-purple-700">{report.recommendations.length}</p>
            <p className="text-sm text-purple-600 mt-1">Improvement Actions</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Recommended Actions</h3>
          {report.recommendations.map((rec, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">{rec.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                  rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {rec.priority.charAt(0).toUpperCase() + rec.priority.slice(1)} Priority
                </span>
              </div>
              <div className="mt-2">
                <span className="text-sm font-medium text-green-600">
                  Potential Savings: ${rec.potentialSavings.toLocaleString()}/year
                </span>
              </div>
              {rec.aiRecommendations && renderAIRecommendations(rec.aiRecommendations)}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => onStartDetailedAudit(roomData)}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Start Detailed Audit
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}