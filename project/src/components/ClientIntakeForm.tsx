import React, { useState, useEffect } from 'react';
import { Building2, Lightbulb, LineChart, Brain, Camera, FileText, Home, Factory, Building, GraduationCap, X, Upload, Clock, MapPin, ArrowLeft, AlertTriangle } from 'lucide-react';
import { Header } from './Header';
import { Footer } from './Footer';
import { BuildingAssessment } from './BuildingAssessment';
import { DetailedAudit } from './DetailedAudit';
import { InitialReport } from './InitialReport';
import { ErrorBoundary } from './ErrorBoundary';
import AudenChat from './AudenChat';
import TranslationProvider from './TranslationProvider';
import { verifySupabaseConnection } from './lib/supabase';
import { AuditLevelInfo } from './AuditLevelInfo';

type Profile = 'residential' | 'commercial' | 'industrial' | 'educational' | null;
type ResidentialType = 'villa' | 'apartment' | 'duplex' | null;
type Step = 'type' | 'residential-type' | 'details' | 'documents' | 'report' | 'detailed-audit';

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

export function ClientIntakeForm({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<Step>('type');
  const [customerType, setCustomerType] = useState<Profile>(null);
  const [residentialType, setResidentialType] = useState<ResidentialType>(null);
  const [roomData, setRoomData] = useState<RoomData[]>([]);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    address: '',
    floorArea: '',
    rooms: '',
    residents: '',
    electricityBills: [],
    floorPlan: null
  });

  const handleStartDetailedAudit = (rooms: RoomData[]) => {
    setRoomData(rooms);
    setStep('detailed-audit');
  };

  const renderCurrentStep = () => {
    switch (step) {
      case 'type':
        return renderCustomerTypeSelection();
      case 'residential-type':
        return renderResidentialTypeSelection();
      case 'details':
        return renderDetailsForm();
      case 'documents':
        return renderDocumentUpload();
      case 'report':
        return <InitialReport formData={formData} onStartDetailedAudit={handleStartDetailedAudit} />;
      case 'detailed-audit':
        return (
          <DetailedAudit 
            customerType={customerType || 'residential'} 
            initialRoomData={roomData}
          />
        );
      default:
        return null;
    }
  };

  // Rest of the component implementation remains the same...
}