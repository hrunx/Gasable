import React, { useState, lazy, Suspense } from 'react';
import { Camera, Plus, Trash2, ArrowRight, X, AlertTriangle, Info } from 'lucide-react';
import { AuditLevelInfo } from './AuditLevelInfo';
import { RoomAssessment } from './RoomAssessment';
import { talkToDeepSeek } from '../lib/deepseek';
import { AuditSummary } from './AuditSummary';
import type { Equipment } from '../types/equipment';
import { getEquipmentTypes } from '../lib/constants/equipmentTypes';

const AIEquipmentDetection = lazy(() => import('./AIEquipmentDetection').then(module => ({ default: module.AIEquipmentDetection })));

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

interface DetailedAuditProps {
  customerType: string;
  initialRoomData?: RoomData[];
}

type Step = 'rooms' | 'equipment' | 'summary';

export function DetailedAudit({ customerType, initialRoomData = [] }: DetailedAuditProps) {
  const [step, setStep] = useState<Step>('rooms');
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [showAIDetection, setShowAIDetection] = useState(false);
  const [rooms] = useState<string[]>(initialRoomData.map(room => room.name));

  const renderStep = () => {
    switch (step) {
      case 'rooms':
        return (
          <RoomAssessment 
            onComplete={() => setStep('equipment')} 
            initialRoomData={initialRoomData}
          />
        );
      case 'equipment':
        return (
          <div className="space-y-6">
            <AuditLevelInfo 
              level="II"
              isoStandard="ASHRAE Level II – Equipment Assessment + ISO 50002 Section 7"
              className="mb-6"
            />

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Equipment Assessment</h2>
              <button
                onClick={() => {
                  const newEquipment: Equipment = {
                    id: crypto.randomUUID(),
                    name: '',
                    category: 'HVAC',
                    subType: '',
                    location: '',
                    ratedPower: 0,
                    operatingHours: 0,
                    operatingDays: 0,
                    usageSchedule: '',
                    efficiency: 0,
                    loadFactor: 'Low (0-33%)',
                    condition: 'Good',
                    controlSystem: 'Manual',
                    age: 0,
                    manufacturer: '',
                    modelNo: '',
                    serialNumber: '',
                    capacity: '',
                    installationDate: '',
                    maintenanceFrequency: 'Annual',
                    lastMaintenanceDate: '',
                    nextMaintenanceDate: '',
                    maintenanceHistory: [],
                    energyMetered: false,
                    iotConnected: false,
                    notes: ''
                  };
                  setEquipment(prev => [...prev, newEquipment]);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Plus className="w-4 h-4" /> Add Equipment
              </button>
            </div>

            {equipment.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
                <Plus className="w-8 h-8 mx-auto text-gray-400" />
                <p className="text-gray-600 mt-2">No equipment added yet. Click "Add Equipment" to begin.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {equipment.map(eq => renderEquipmentForm(eq, (id, updates) => {
                  setEquipment(currentEquipment => {
                    const updatedEquipment = currentEquipment.map(e => 
                      e.id === id ? { ...e, ...updates } : e
                    );
                    return updatedEquipment;
                  });
                }, setShowAIDetection, setEquipment, rooms))}

                <div className="flex justify-end">
                  <button
                    onClick={() => setStep('summary')}
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Continue to Summary <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {showAIDetection && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">AI Equipment Detection</h3>
                    <button 
                      onClick={() => setShowAIDetection(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <Suspense fallback={
                    <div className="flex items-center justify-center h-64">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
                    </div>
                  }>
                    <AIEquipmentDetection />
                  </Suspense>
                </div>
              </div>
            )}
          </div>
        );
      case 'summary':
        return (
          <AuditSummary 
            buildingData={{
              name: "Sample Building",
              address: "123 Main St",
              type: customerType,
              area: 5000,
              constructionYear: 2010,
              rooms: initialRoomData.map(room => ({
                name: room.name,
                area: room.area,
                lightingType: room.lighting_type || '',
                numFixtures: room.num_fixtures || 0,
                acType: room.ac_type || '',
                acSize: room.ac_size || 0
              }))
            }}
            equipmentData={equipment.map(eq => ({
              name: eq.name,
              category: eq.category,
              subType: eq.subType,
              location: eq.location,
              ratedPower: eq.ratedPower,
              efficiency: eq.efficiency,
              condition: eq.condition,
              annualEnergy: 0, // Calculate this based on equipment data
              savingsPotential: 0 // Calculate this based on equipment data
            }))}
            energyData={{
              annual: {
                consumption: equipment.reduce((acc, eq) => acc + (eq.ratedPower * 8760), 0),
                cost: equipment.reduce((acc, eq) => acc + (eq.ratedPower * 8760 * 0.12), 0),
                emissions: equipment.reduce((acc, eq) => acc + (eq.ratedPower * 8760 * 0.0004), 0)
              },
              monthly: [
                { date: '2025-01', consumption: 45000, peak: 150 },
                { date: '2025-02', consumption: 42000, peak: 145 },
                { date: '2025-03', consumption: 44000, peak: 155 }
              ],
              distribution: {
                hvac: 45,
                lighting: 25,
                equipment: 20,
                other: 10
              }
            }}
            recommendations={[]}
            complianceData={{
              ashrae: {
                level: 'II',
                requirements: [
                  { item: 'Building Survey', status: 'complete' },
                  { item: 'Energy Analysis', status: 'complete' },
                  { item: 'Equipment Assessment', status: 'complete' },
                  { item: 'Economic Analysis', status: 'complete' }
                ]
              },
              iso: {
                standard: 'ISO 50002:2014',
                conformity: 95
              }
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {renderStep()}
    </div>
  );
}