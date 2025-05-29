import { useState } from 'react';
import { supabase } from '../supabase';

interface DeliveryZone {
  id?: string;
  name: string;
  baseFee: number;
  minOrderValue: number;
  estimatedTime: string;
}

interface Vehicle {
  id?: string;
  number: string;
  type: 'truck' | 'van' | 'bike';
  capacity: number;
  fuelType: string;
}

interface Driver {
  id?: string;
  name: string;
  licenseNumber: string;
  phone: string;
  status: 'available' | 'busy' | 'offline';
  vehicleId?: string;
}

interface LogisticsData {
  store_id: string;
  company_id: string;
  shipment_type: string;
  delivery_zones: DeliveryZone[];
  vehicles?: Vehicle[];
  drivers?: Driver[];
}

export function useLogistics() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createLogistics = async (logisticsData: LogisticsData) => {
    setLoading(true);
    setError(null);

    try {
      // 1. Create delivery zones
      const zonePromises = logisticsData.delivery_zones.map(zone =>
        supabase.from('delivery_zones').insert({
          company_id: logisticsData.company_id,
          store_id: logisticsData.store_id,
          name: zone.name,
          base_fee: zone.baseFee,
          min_order_value: zone.minOrderValue,
          estimated_time: zone.estimatedTime
        }).select().single()
      );

      const zoneResults = await Promise.all(zonePromises);
      const zoneErrors = zoneResults.filter(result => result.error);
      if (zoneErrors.length > 0) {
        throw new Error(`Failed to create delivery zones: ${zoneErrors[0].error?.message}`);
      }

      // 2. Create vehicles if provided (for own-fleet)
      let createdVehicles: any[] = [];
      if (logisticsData.vehicles && logisticsData.vehicles.length > 0) {
        const vehiclePromises = logisticsData.vehicles.map(vehicle =>
          supabase.from('delivery_vehicles').insert({
            company_id: logisticsData.company_id,
            store_id: logisticsData.store_id,
            number: vehicle.number,
            type: vehicle.type,
            capacity: vehicle.capacity,
            fuel_type: vehicle.fuelType,
            status: 'active'
          }).select().single()
        );

        const vehicleResults = await Promise.all(vehiclePromises);
        const vehicleErrors = vehicleResults.filter(result => result.error);
        if (vehicleErrors.length > 0) {
          throw new Error(`Failed to create vehicles: ${vehicleErrors[0].error?.message}`);
        }

        createdVehicles = vehicleResults.map(result => result.data);
      }

      // 3. Create drivers if provided (for own-fleet)
      if (logisticsData.drivers && logisticsData.drivers.length > 0) {
        const driverPromises = logisticsData.drivers.map((driver, index) => {
          // Assign driver to a vehicle if available
          const assignedVehicleId = createdVehicles[index]?.id || driver.vehicleId;
          
          return supabase.from('delivery_drivers').insert({
            company_id: logisticsData.company_id,
            store_id: logisticsData.store_id,
            vehicle_id: assignedVehicleId,
            name: driver.name,
            license_number: driver.licenseNumber,
            phone: driver.phone,
            status: driver.status
          }).select().single();
        });

        const driverResults = await Promise.all(driverPromises);
        const driverErrors = driverResults.filter(result => result.error);
        if (driverErrors.length > 0) {
          throw new Error(`Failed to create drivers: ${driverErrors[0].error?.message}`);
        }
      }

      // 4. Create logistics configuration record (commented out - table doesn't exist)
      // const { data: logisticsConfig, error: configError } = await supabase
      //   .from('logistics_config')
      //   .insert({
      //     store_id: logisticsData.store_id,
      //     shipment_type: logisticsData.shipment_type,
      //     status: 'active'
      //   })
      //   .select()
      //   .single();

      // if (configError) throw configError;

      return {
        // config: logisticsConfig,
        zones: zoneResults.map(r => r.data),
        vehicles: createdVehicles,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create logistics setup';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getLogisticsByStore = async (storeId: string) => {
    setLoading(true);
    setError(null);

    try {
      // Get logistics config (commented out - table doesn't exist)
      // const { data: config, error: configError } = await supabase
      //   .from('logistics_config')
      //   .select('*')
      //   .eq('store_id', storeId)
      //   .single();

      // if (configError) throw configError;

      // Get delivery zones
      const { data: zones, error: zonesError } = await supabase
        .from('delivery_zones')
        .select('*')
        .eq('store_id', storeId);

      if (zonesError) throw zonesError;

      // Get vehicles
      const { data: vehicles, error: vehiclesError } = await supabase
        .from('delivery_vehicles')
        .select('*')
        .eq('store_id', storeId);

      if (vehiclesError) throw vehiclesError;

      // Get drivers
      const { data: drivers, error: driversError } = await supabase
        .from('delivery_drivers')
        .select(`
          *,
          delivery_vehicles!inner(store_id)
        `)
        .eq('delivery_vehicles.store_id', storeId);

      if (driversError) throw driversError;

      return {
        // config,
        zones,
        vehicles,
        drivers
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch logistics data';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addVehicle = async (storeId: string, companyId: string, vehicle: Vehicle) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('delivery_vehicles')
        .insert({
          company_id: companyId,
          store_id: storeId,
          number: vehicle.number,
          type: vehicle.type,
          capacity: vehicle.capacity,
          fuel_type: vehicle.fuelType,
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add vehicle';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addDriver = async (vehicleId: string, companyId: string, storeId: string, driver: Driver) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('delivery_drivers')
        .insert({
          company_id: companyId,
          store_id: storeId,
          vehicle_id: vehicleId,
          name: driver.name,
          license_number: driver.licenseNumber,
          phone: driver.phone,
          status: driver.status
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add driver';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createLogistics,
    getLogisticsByStore,
    addVehicle,
    addDriver,
    loading,
    error
  };
} 