import React, { useState } from 'react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../../components/ui/table";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { 
  AlertTriangle,
  CheckCircle2,
  Plus,
  Search,
  Settings2,
  XCircle 
} from 'lucide-react';

interface Asset {
  id: string;
  name: string;
  type: string;
  status: 'operational' | 'maintenance' | 'offline';
  healthScore: number;
  lastMaintenance: string;
  nextMaintenance: string;
}

const mockAssets: Asset[] = [
  {
    id: '1',
    name: 'Industrial Freezer A1',
    type: 'Cold Storage',
    status: 'operational',
    healthScore: 92,
    lastMaintenance: '2025-03-15',
    nextMaintenance: '2025-06-15'
  },
  {
    id: '2',
    name: 'Delivery Van B2',
    type: 'Vehicle',
    status: 'maintenance',
    healthScore: 75,
    lastMaintenance: '2025-04-01',
    nextMaintenance: '2025-04-15'
  },
  {
    id: '3',
    name: 'Storage Unit C3',
    type: 'Storage',
    status: 'offline',
    healthScore: 45,
    lastMaintenance: '2025-02-28',
    nextMaintenance: '2025-04-10'
  }
];

const AssetManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'bg-green-100 text-green-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'offline':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'maintenance':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'offline':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const filteredAssets = mockAssets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || asset.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Asset Management</h1>
          <p className="text-gray-500">Monitor and manage your business assets</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add New Asset
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Assets</CardTitle>
            <CardDescription>Active assets in your inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{mockAssets.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Health Score</CardTitle>
            <CardDescription>Overall asset condition</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {Math.round(mockAssets.reduce((acc, asset) => acc + asset.healthScore, 0) / mockAssets.length)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Maintenance</CardTitle>
            <CardDescription>Assets requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">
              {mockAssets.filter(asset => asset.status === 'maintenance').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Cold Storage">Cold Storage</SelectItem>
            <SelectItem value="Vehicle">Vehicle</SelectItem>
            <SelectItem value="Storage">Storage</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">
          <Settings2 className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Health Score</TableHead>
              <TableHead>Last Maintenance</TableHead>
              <TableHead>Next Maintenance</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAssets.map((asset) => (
              <TableRow key={asset.id}>
                <TableCell className="font-medium">{asset.name}</TableCell>
                <TableCell>{asset.type}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(asset.status)}
                    <Badge className={getStatusColor(asset.status)}>
                      {asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={getHealthScoreColor(asset.healthScore)}>
                    {asset.healthScore}%
                  </span>
                </TableCell>
                <TableCell>{asset.lastMaintenance}</TableCell>
                <TableCell>{asset.nextMaintenance}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default AssetManagement;