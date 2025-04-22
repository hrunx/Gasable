import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Camera, ArrowRight } from 'lucide-react';
import { AuditLevelInfo } from './AuditLevelInfo';
import { talkToDeepSeek } from '../lib/deepseek';

interface Room {
  id: string;
  name: string;
  area: number;
  lightingType: string;
  numFixtures: number;
  acType: string;
  acSize: number;
  windows: Array<{
    id: string;
    height: number;
    width: number;
    glazingType: 'single' | 'double';
  }>;
  notes: string;
  aiRecommendations?: string;
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

interface RoomAssessmentProps {
  onComplete: () => void;
  initialRoomData?: RoomData[];
}

export function RoomAssessment({ onComplete, initialRoomData = [] }: RoomAssessmentProps) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    if (initialRoomData.length > 0) {
      const prepopulatedRooms: Room[] = initialRoomData.map(roomData => ({
        id: crypto.randomUUID(),
        name: roomData.name || '',
        area: roomData.area || 0,
        lightingType: roomData.lighting_type || '',
        numFixtures: roomData.num_fixtures || 0,
        acType: roomData.ac_type || '',
        acSize: roomData.ac_size || 0,
        windows: Array(roomData.windows || 0).fill(null).map(() => ({
          id: crypto.randomUUID(),
          height: 0,
          width: 0,
          glazingType: 'single'
        })),
        notes: ''
      }));
      setRooms(prepopulatedRooms);
    }
  }, [initialRoomData]);

  const addRoom = () => {
    const newRoom: Room = {
      id: crypto.randomUUID(),
      name: '',
      area: 0,
      lightingType: '',
      numFixtures: 0,
      acType: '',
      acSize: 0,
      windows: [],
      notes: ''
    };
    setRooms(prev => [...prev, newRoom]);
  };

  const updateRoom = (roomId: string, updates: Partial<Room>) => {
    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, ...updates } : r));
  };

  const addWindow = (roomId: string) => {
    setRooms(prev =>
      prev.map(r =>
        r.id === roomId
          ? {
              ...r,
              windows: [
                ...r.windows,
                { id: crypto.randomUUID(), height: 0, width: 0, glazingType: 'single' },
              ],
            }
          : r
      )
    );
  };

  const analyzeRoom = async (room: Room) => {
    setAnalyzing(true);
    try {
      const prompt = `
As an expert energy auditor, analyze this room data and provide 3 specific energy efficiency recommendations:

Room Details:
- Name: ${room.name}
- Area: ${room.area} m²
- Lighting: ${room.lightingType} (${room.numFixtures} fixtures)
- AC: ${room.acType} (${room.acSize} BTU)
- Windows: ${room.windows.length} (${room.windows.map(w => `${w.width}×${w.height}m, ${w.glazingType} glazed`).join(', ')})
- Notes: ${room.notes}

Format your response as a numbered list with clear, actionable recommendations.
`.trim();

      const recommendations = await talkToDeepSeek(prompt);
      updateRoom(room.id, { aiRecommendations: recommendations });
    } catch (error) {
      console.error('Error analyzing room:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleContinue = () => {
    if (rooms.length === 0) {
      alert('Please add at least one room before continuing.');
      return;
    }
    onComplete();
  };

  return (
    <div className="space-y-6">
      <AuditLevelInfo 
        level="II"
        isoStandard="ASHRAE Level II – Room Assessment"
        className="mb-6"
      />

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Room Assessment</h2>
        <button
          onClick={addRoom}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Plus className="w-4 h-4" /> Add Room
        </button>
      </div>

      {rooms.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
          <Plus className="w-8 h-8 mx-auto text-gray-400" />
          <p className="text-gray-600 mt-2">No rooms added yet. Click "Add Room" to begin.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {rooms.map(room => (
            <div key={room.id} className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Room Details</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setRooms(prev => prev.filter(r => r.id !== room.id))}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Room Name</label>
                    <input
                      type="text"
                      value={room.name}
                      onChange={e => updateRoom(room.id, { name: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="e.g., Living Room"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Area (m²)</label>
                    <input
                      type="number"
                      value={room.area || ''}
                      onChange={e => updateRoom(room.id, { area: Number(e.target.value) })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lighting Type</label>
                    <select
                      value={room.lightingType}
                      onChange={e => updateRoom(room.id, { lightingType: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Select type</option>
                      <option value="LED">LED</option>
                      <option value="CFL">CFL</option>
                      <option value="Fluorescent">Fluorescent</option>
                      <option value="Halogen">Halogen</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Number of Fixtures</label>
                    <input
                      type="number"
                      value={room.numFixtures || ''}
                      onChange={e => updateRoom(room.id, { numFixtures: Number(e.target.value) })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">AC Type</label>
                    <select
                      value={room.acType}
                      onChange={e => updateRoom(room.id, { acType: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Select type</option>
                      <option value="Split Unit">Split Unit</option>
                      <option value="Window Unit">Window Unit</option>
                      <option value="Central">Central</option>
                      <option value="None">None</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">AC Size (BTU)</label>
                    <input
                      type="number"
                      value={room.acSize || ''}
                      onChange={e => updateRoom(room.id, { acSize: Number(e.target.value) })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Windows</label>
                    <button
                      onClick={() => addWindow(room.id)}
                      className="text-sm text-green-600 hover:text-green-700 flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" /> Add Window
                    </button>
                  </div>
                  <div className="space-y-3">
                    {room.windows.map((w, i) => (
                      <div key={w.id} className="grid grid-cols-3 gap-3">
                        <input
                          type="number"
                          placeholder="Height (m)"
                          value={w.height || ''}
                          onChange={e => {
                            const updated = [...room.windows];
                            updated[i].height = Number(e.target.value);
                            updateRoom(room.id, { windows: updated });
                          }}
                          className="px-3 py-1.5 border rounded text-sm"
                        />
                        <input
                          type="number"
                          placeholder="Width (m)"
                          value={w.width || ''}
                          onChange={e => {
                            const updated = [...room.windows];
                            updated[i].width = Number(e.target.value);
                            updateRoom(room.id, { windows: updated });
                          }}
                          className="px-3 py-1.5 border rounded text-sm"
                        />
                        <select
                          value={w.glazingType}
                          onChange={e => {
                            const updated = [...room.windows];
                            updated[i].glazingType = e.target.value as 'single' | 'double';
                            updateRoom(room.id, { windows: updated });
                          }}
                          className="px-3 py-1.5 border rounded text-sm"
                        >
                          <option value="single">Single Glazed</option>
                          <option value="double">Double Glazed</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    rows={3}
                    value={room.notes}
                    onChange={e => updateRoom(room.id, { notes: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="Additional observations..."
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => analyzeRoom(room)}
                    disabled={analyzing}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {analyzing ? 'Analyzing...' : 'Get AI Recommendations'}
                  </button>
                </div>
              </div>

              {room.aiRecommendations && (
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-medium text-green-900 mb-2">AI Recommendations</h4>
                  <div className="text-green-800 whitespace-pre-line">
                    {room.aiRecommendations}
                  </div>
                </div>
              )}
            </div>
          ))}

          <div className="flex justify-end">
            <button
              onClick={handleContinue}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Continue to Equipment <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}