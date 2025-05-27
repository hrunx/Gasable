import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Filter, Plus, Edit, Trash2, Eye, MoreVertical, Phone, Mail, Clock, CheckCircle, AlertCircle, XCircle, Calendar, Download, RefreshCw, User, Building2, ArrowUpRight, ArrowDownRight, ChevronDown, Star, Award, Briefcase, UserCog, PenTool as Tool, DollarSign } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  branch: {
    id: string;
    name: string;
  };
  status: 'active' | 'on_leave' | 'inactive';
  contact: {
    phone: string;
    email: string;
  };
  performance: {
    rating: number;
    attendance: number;
    efficiency: number;
  };
  schedule: {
    shift: string;
    days: string[];
  };
  joinDate: string;
  photo?: string;
}

const mockEmployees: Employee[] = [
  {
    id: 'e1',
    name: 'Mohammed Al-Harbi',
    position: 'Station Manager',
    department: 'Operations',
    branch: {
      id: 'b1',
      name: 'Riyadh Central Gas Station',
    },
    status: 'active',
    contact: {
      phone: '+966-123-456-789',
      email: 'mohammed@example.com',
    },
    performance: {
      rating: 4.8,
      attendance: 98,
      efficiency: 95,
    },
    schedule: {
      shift: 'Morning (6:00 AM - 2:00 PM)',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    },
    joinDate: '2022-05-15',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  },
  {
    id: 'e2',
    name: 'Fatima Al-Zahrani',
    position: 'Shift Supervisor',
    department: 'Operations',
    branch: {
      id: 'b1',
      name: 'Riyadh Central Gas Station',
    },
    status: 'active',
    contact: {
      phone: '+966-123-456-790',
      email: 'fatima@example.com',
    },
    performance: {
      rating: 4.6,
      attendance: 95,
      efficiency: 92,
    },
    schedule: {
      shift: 'Evening (2:00 PM - 10:00 PM)',
      days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
    },
    joinDate: '2022-08-10',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  },
  {
    id: 'e3',
    name: 'Ahmed Al-Ghamdi',
    position: 'Maintenance Technician',
    department: 'Maintenance',
    branch: {
      id: 'b1',
      name: 'Riyadh Central Gas Station',
    },
    status: 'on_leave',
    contact: {
      phone: '+966-123-456-791',
      email: 'ahmed@example.com',
    },
    performance: {
      rating: 4.5,
      attendance: 90,
      efficiency: 88,
    },
    schedule: {
      shift: 'Rotating',
      days: ['Monday', 'Tuesday', 'Thursday', 'Friday', 'Saturday'],
    },
    joinDate: '2023-01-20',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
  },
  {
    id: 'e4',
    name: 'Noura Al-Qahtani',
    position: 'Sales Associate',
    department: 'Sales',
    branch: {
      id: 'b2',
      name: 'Jeddah Port LPG Center',
    },
    status: 'active',
    contact: {
      phone: '+966-123-456-792',
      email: 'noura@example.com',
    },
    performance: {
      rating: 4.9,
      attendance: 99,
      efficiency: 97,
    },
    schedule: {
      shift: 'Morning (7:00 AM - 3:00 PM)',
      days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
    },
    joinDate: '2023-03-05',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
  },
];

const EmployeeDirectory = () => {
  const [employees] = useState<Employee[]>(mockEmployees);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [filterBranch, setFilterBranch] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const getStatusColor = (status: Employee['status']) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-50';
      case 'on_leave':
        return 'text-yellow-600 bg-yellow-50';
      case 'inactive':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: Employee['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4" />;
      case 'on_leave':
        return <Clock className="h-4 w-4" />;
      case 'inactive':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getDepartmentIcon = (department: string) => {
    switch (department.toLowerCase()) {
      case 'operations':
        return <Briefcase className="h-5 w-5" />;
      case 'maintenance':
        return <Tool className="h-5 w-5" />;
      case 'sales':
        return <DollarSign className="h-5 w-5" />;
      case 'administration':
        return <UserCog className="h-5 w-5" />;
      default:
        return <Briefcase className="h-5 w-5" />;
    }
  };

  const filteredEmployees = employees.filter(employee => {
    if (filterStatus !== 'all' && employee.status !== filterStatus) {
      return false;
    }
    if (filterDepartment !== 'all' && employee.department !== filterDepartment) {
      return false;
    }
    if (filterBranch !== 'all' && employee.branch.id !== filterBranch) {
      return false;
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        employee.name.toLowerCase().includes(query) ||
        employee.position.toLowerCase().includes(query) ||
        employee.contact.email.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const selectedEmployeeData = selectedEmployee ? employees.find(e => e.id === selectedEmployee) : null;

  // Get unique departments and branches for filters
  const departments = Array.from(new Set(employees.map(e => e.department)));
  const branches = Array.from(new Set(employees.map(e => e.branch.id))).map(id => {
    const branch = employees.find(e => e.branch.id === id)?.branch;
    return branch ? { id: branch.id, name: branch.name } : { id: '', name: '' };
  }).filter(b => b.id !== '');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900 mb-2">
              👥 Employee Directory
            </h1>
            <p className="text-secondary-600">
              Manage your staff across all branches and departments
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleRefresh}
              className={`p-2 rounded-lg text-secondary-600 hover:bg-secondary-100 ${
                isRefreshing ? 'animate-spin' : ''
              }`}
            >
              <RefreshCw className="h-5 w-5" />
            </button>
            <button className="px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors flex items-center space-x-2">
              <Download className="h-5 w-5" />
              <span>Export</span>
            </button>
            <button className="btn-primary flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Add Employee</span>
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-secondary-50 p-6 rounded-xl border border-secondary-100"
          >
            <div className="flex items-center justify-between mb-2">
              <Users className="h-6 w-6 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">{employees.length}</span>
            </div>
            <p className="text-secondary-600">Total Employees</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-secondary-50 p-6 rounded-xl border border-secondary-100"
          >
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <span className="text-2xl font-bold text-green-600">
                {employees.filter(e => e.status === 'active').length}
              </span>
            </div>
            <p className="text-secondary-600">Active Employees</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-secondary-50 p-6 rounded-xl border border-secondary-100"
          >
            <div className="flex items-center justify-between mb-2">
              <Clock className="h-6 w-6 text-yellow-600" />
              <span className="text-2xl font-bold text-yellow-600">
                {employees.filter(e => e.status === 'on_leave').length}
              </span>
            </div>
            <p className="text-secondary-600">On Leave</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-secondary-50 p-6 rounded-xl border border-secondary-100"
          >
            <div className="flex items-center justify-between mb-2">
              <Star className="h-6 w-6 text-purple-600" />
              <span className="text-2xl font-bold text-purple-600">
                {(employees.reduce((sum, e) => sum + e.performance.rating, 0) / employees.length).toFixed(1)}
              </span>
            </div>
            <p className="text-secondary-600">Avg. Performance</p>
          </motion.div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search employees by name, position, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="on_leave">On Leave</option>
            <option value="inactive">Inactive</option>
          </select>
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          >
            <option value="all">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          <select
            value={filterBranch}
            onChange={(e) => setFilterBranch(e.target.value)}
            className="px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          >
            <option value="all">All Branches</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>{branch.name}</option>
            ))}
          </select>
          <button className="p-2 hover:bg-secondary-100 rounded-lg text-secondary-600">
            <Filter className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Employees Table */}
      <div className="bg-white rounded-xl shadow-sm border border-secondary-100">
        <div className="p-6 border-b border-secondary-100">
          <h2 className="text-lg font-semibold text-secondary-900">All Employees</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-secondary-50">
                <th className="py-4 px-6 text-left font-medium text-secondary-600">Employee</th>
                <th className="py-4 px-6 text-left font-medium text-secondary-600">Position</th>
                <th className="py-4 px-6 text-left font-medium text-secondary-600">Department</th>
                <th className="py-4 px-6 text-left font-medium text-secondary-600">Branch</th>
                <th className="py-4 px-6 text-left font-medium text-secondary-600">Contact</th>
                <th className="py-4 px-6 text-left font-medium text-secondary-600">Performance</th>
                <th className="py-4 px-6 text-left font-medium text-secondary-600">Status</th>
                <th className="py-4 px-6 text-left font-medium text-secondary-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="border-b border-secondary-100 hover:bg-secondary-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        {employee.photo ? (
                          <img
                            src={employee.photo}
                            alt={employee.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                            {employee.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{employee.name}</div>
                        <div className="text-sm text-secondary-600">
                          Since {new Date(employee.joinDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">{employee.position}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      {getDepartmentIcon(employee.department)}
                      <span>{employee.department}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-1">
                      <Building2 className="h-4 w-4 text-secondary-400" />
                      <span>{employee.branch.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1">
                        <Phone className="h-4 w-4 text-secondary-400" />
                        <span className="text-sm">{employee.contact.phone}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Mail className="h-4 w-4 text-secondary-400" />
                        <span className="text-sm">{employee.contact.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span>{employee.performance.rating}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${getStatusColor(employee.status)}`}>
                      {getStatusIcon(employee.status)}
                      <span className="capitalize">{employee.status.replace('_', ' ')}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => setSelectedEmployee(selectedEmployee === employee.id ? null : employee.id)}
                        className="p-1 hover:bg-secondary-100 rounded text-secondary-600"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-1 hover:bg-secondary-100 rounded text-secondary-600">
                        <Edit className="h-4 w-4" />
                      </button>
                      <div className="relative">
                        <button
                          onClick={() => setShowActionMenu(showActionMenu === employee.id ? null : employee.id)}
                          className="p-1 hover:bg-secondary-100 rounded text-secondary-600"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        {showActionMenu === employee.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-secondary-100 py-1 z-10">
                            <button
                              className="w-full px-4 py-2 text-left hover:bg-secondary-50 flex items-center space-x-2"
                              onClick={() => {/* Handle view details */}}
                            >
                              <Eye className="h-4 w-4" />
                              <span>View Details</span>
                            </button>
                            <button
                              className="w-full px-4 py-2 text-left hover:bg-secondary-50 flex items-center space-x-2"
                              onClick={() => {/* Handle edit */}}
                            >
                              <Edit className="h-4 w-4" />
                              <span>Edit Employee</span>
                            </button>
                            <button
                              className="w-full px-4 py-2 text-left hover:bg-secondary-50 flex items-center space-x-2"
                              onClick={() => {/* Handle status change */}}
                            >
                              <Clock className="h-4 w-4" />
                              <span>Change Status</span>
                            </button>
                            <button
                              className="w-full px-4 py-2 text-left hover:bg-secondary-50 flex items-center space-x-2 text-red-600"
                              onClick={() => {/* Handle delete */}}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span>Remove Employee</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-secondary-100 flex items-center justify-between">
          <div className="text-sm text-secondary-600">
            Showing 1 to {filteredEmployees.length} of {filteredEmployees.length} entries
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 border border-secondary-200 rounded hover:bg-secondary-50">
              Previous
            </button>
            <button className="px-3 py-1 bg-primary-600 text-white rounded">
              1
            </button>
            <button className="px-3 py-1 border border-secondary-200 rounded hover:bg-secondary-50">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Employee Details */}
      {selectedEmployeeData && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full overflow-hidden">
                {selectedEmployeeData.photo ? (
                  <img
                    src={selectedEmployeeData.photo}
                    alt={selectedEmployeeData.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-primary-100 flex items-center justify-center text-primary-700 text-2xl font-bold">
                    {selectedEmployeeData.name.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{selectedEmployeeData.name}</h2>
                <div className="flex items-center space-x-2 text-secondary-600">
                  <span>{selectedEmployeeData.position}</span>
                  <span>•</span>
                  <span>{selectedEmployeeData.department}</span>
                </div>
              </div>
            </div>
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor(selectedEmployeeData.status)}`}>
              {getStatusIcon(selectedEmployeeData.status)}
              <span className="capitalize">{selectedEmployeeData.status.replace('_', ' ')}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Contact Information</h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-secondary-400" />
                  <span>{selectedEmployeeData.contact.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-secondary-400" />
                  <span>{selectedEmployeeData.contact.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Building2 className="h-5 w-5 text-secondary-400" />
                  <span>{selectedEmployeeData.branch.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-secondary-400" />
                  <span>Joined on {new Date(selectedEmployeeData.joinDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            {/* Schedule */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Work Schedule</h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-secondary-400" />
                  <span>{selectedEmployeeData.schedule.shift}</span>
                </div>
                <div>
                  <div className="text-sm text-secondary-600 mb-2">Working Days</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedEmployeeData.schedule.days.map((day, index) => (
                      <span key={index} className="px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-sm">
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Performance */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Performance Metrics</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-secondary-600">Overall Rating</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 font-medium">{selectedEmployeeData.performance.rating}</span>
                    </div>
                  </div>
                  <div className="h-2 bg-secondary-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400"
                      style={{ width: `${(selectedEmployeeData.performance.rating / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-secondary-600">Attendance</span>
                    <span className="font-medium">{selectedEmployeeData.performance.attendance}%</span>
                  </div>
                  <div className="h-2 bg-secondary-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-500"
                      style={{ width: `${selectedEmployeeData.performance.attendance}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-secondary-600">Efficiency</span>
                    <span className="font-medium">{selectedEmployeeData.performance.efficiency}%</span>
                  </div>
                  <div className="h-2 bg-secondary-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{ width: `${selectedEmployeeData.performance.efficiency}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button className="px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors">
              View Full Profile
            </button>
            <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              Edit Employee
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDirectory;