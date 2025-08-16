import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Home, MapPin, AlertTriangle, CheckCircle, TrendingUp, TrendingDown, Users, Building, FileText, Clock, Shield, Database, Menu, Bell, Settings, X } from 'lucide-react';
import Sidebar from '../components/sidebar'; // Importing the Sidebar component



const Analytics = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('6m');
  const [selectedRegion, setSelectedRegion] = useState('all');

  // African-specific housing data reflecting the reality of mixed formal/informal settlements
  const settlementTypeData = [
    { type: 'Formal Dwellings', count: 8350, percentage: 83.5, change: 2.1 },
    { type: 'Informal Settlements', count: 1220, percentage: 12.2, change: -1.5 },
    { type: 'Traditional Dwellings', count: 390, percentage: 3.9, change: -2.8 },
    { type: 'Backyard Structures', count: 430, percentage: 4.3, change: 8.2 }
  ];

  const registrationStatusData = [
    { month: 'Jan', registered: 245, pending: 180, incomplete: 95, backlog: 67 },
    { month: 'Feb', registered: 267, pending: 195, incomplete: 112, backlog: 73 },
    { month: 'Mar', registered: 234, pending: 168, incomplete: 89, backlog: 58 },
    { month: 'Apr', registered: 289, pending: 221, incomplete: 134, backlog: 82 },
    { month: 'May', registered: 312, pending: 198, incomplete: 107, backlog: 64 },
    { month: 'Jun', registered: 298, pending: 215, incomplete: 125, backlog: 78 }
  ];

  const tenureSecurityData = [
    { name: 'Title Deeds', value: 35, color: '#10b981' },
    { name: 'Permission to Occupy', value: 28, color: '#3b82f6' },
    { name: 'Informal Tenure', value: 24, color: '#f59e0b' },
    { name: 'No Documentation', value: 13, color: '#ef4444' }
  ];

  const upgradeProgressData = [
    { quarter: 'Q1', planned: 450, started: 320, completed: 180 },
    { quarter: 'Q2', planned: 520, started: 380, completed: 245 },
    { quarter: 'Q3', planned: 480, started: 410, completed: 290 },
    { quarter: 'Q4', planned: 580, started: 445, completed: 312 }
  ];

  const servicesAccessData = [
    { service: 'Water Access', formal: 95, informal: 45, traditional: 23 },
    { service: 'Electricity', formal: 92, informal: 38, traditional: 18 },
    { service: 'Sanitation', formal: 88, informal: 28, traditional: 15 },
    { service: 'Waste Collection', formal: 85, informal: 22, traditional: 8 },
    { service: 'Road Access', formal: 78, informal: 35, traditional: 25 }
  ];

  const provincialData = [
    { province: 'Gauteng', totalUnits: 45600, informal: 15.2, registrationRate: 67, upgradeProjects: 23 },
    { province: 'Western Cape', totalUnits: 32400, informal: 18.7, registrationRate: 72, upgradeProjects: 19 },
    { province: 'KwaZulu-Natal', totalUnits: 38900, informal: 22.3, registrationRate: 58, upgradeProjects: 31 },
    { province: 'Eastern Cape', totalUnits: 28700, informal: 28.5, registrationRate: 45, upgradeProjects: 27 },
    { province: 'Limpopo', totalUnits: 19500, informal: 12.1, registrationRate: 52, upgradeProjects: 15 }
  ];

  const MetricCard = ({ title, value, change, icon: Icon, color = 'blue', subtitle }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-xs sm:text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
          {change !== undefined && (
            <div className="flex items-center mt-2">
              {change > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-xs sm:text-sm font-medium ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(change)}%
              </span>
              <span className="text-xs sm:text-sm text-gray-500 ml-1">vs last period</span>
            </div>
          )}
        </div>
        <div className={`p-2 sm:p-3 rounded-lg bg-${color}-50`}>
          <Icon className={`h-5 w-5 sm:h-6 sm:w-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Left as original */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main Content */}
      <div className="flex-1 lg:ml-72">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <Menu className="h-6 w-6 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Analytics Dashboard</h1>
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-md hover:bg-gray-100">
              <Bell className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {/* Filters at the top */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 sm:mb-8">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">African Housing Registration Analytics</h1>
              <p className="text-sm sm:text-base text-gray-600">Monitor formal registrations, informal settlements, and upgrade programs</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <select 
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Provinces</option>
                <option value="gauteng">Gauteng</option>
                <option value="western-cape">Western Cape</option>
                <option value="kwazulu-natal">KwaZulu-Natal</option>
                <option value="eastern-cape">Eastern Cape</option>
                <option value="limpopo">Limpopo</option>
              </select>
              <select 
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="3m">Last 3 months</option>
                <option value="6m">Last 6 months</option>
                <option value="1y">Last year</option>
                <option value="2y">Last 2 years</option>
              </select>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <MetricCard 
              title="Total Housing Units" 
              value="165,490" 
              change={4.2} 
              icon={Home} 
              color="blue"
              subtitle="Formal & Informal Combined"
            />
            <MetricCard 
              title="Registration Rate" 
              value="63.8%" 
              change={2.8} 
              icon={Database} 
              color="green"
              subtitle="Of eligible properties"
            />
            <MetricCard 
              title="Informal Settlements" 
              value="18.2%" 
              change={-1.5} 
              icon={Building} 
              color="amber"
              subtitle="Of total housing stock"
            />
            <MetricCard 
              title="Active Upgrade Projects" 
              value="115" 
              change={12.4} 
              icon={Shield} 
              color="purple"
              subtitle="Formalization in progress"
            />
          </div>

          {/* Settlement Types & Registration Trends */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 sm:mb-8">
            {/* Settlement Types Distribution */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Housing Settlement Types</h3>
              <div className="space-y-3 sm:space-y-4">
                {settlementTypeData.map((type, index) => (
                  <div key={index} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Home className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                      <div>
                        <p className="text-sm sm:text-base font-medium text-gray-900">{type.type}</p>
                        <div className="flex items-center gap-1 sm:gap-2">
                          <p className="text-xs sm:text-sm text-gray-500">{type.count.toLocaleString()} units</p>
                          <span className="text-xs text-gray-400">({type.percentage}%)</span>
                        </div>
                      </div>
                    </div>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs sm:text-sm font-medium ${
                      type.change > 0 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {type.change > 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {Math.abs(type.change)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Registration Status Trends */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
                <h3 className="text-lg font-semibold text-gray-900">Registration Progress</h3>
                <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
                    <span>Registered</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full"></div>
                    <span>Pending</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full"></div>
                    <span>Incomplete</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
                    <span>Backlog</span>
                  </div>
                </div>
              </div>
              <div className="h-[250px] sm:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={registrationStatusData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip />
                    <Area type="monotone" dataKey="registered" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="pending" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="incomplete" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="backlog" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Tenure Security & Upgrade Progress */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 sm:mb-8">
            {/* Tenure Security */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Tenure Security Status</h3>
              <div className="flex items-center justify-center">
                <div className="h-[250px] sm:h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={tenureSecurityData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {tenureSecurityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mt-4">
                {tenureSecurityData.map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="flex items-center gap-1 sm:gap-2 mb-1">
                      <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full`} style={{ backgroundColor: item.color }}></div>
                      <span className="text-xs sm:text-sm font-medium text-gray-600">{item.name}</span>
                    </div>
                    <p className="text-base sm:text-lg font-bold text-gray-900">{item.value}%</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Settlement Upgrade Progress */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Settlement Upgrade Progress</h3>
              <div className="h-[250px] sm:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={upgradeProgressData} barCategoryGap="15%">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="quarter" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip />
                    <Bar dataKey="planned" fill="#e5e7eb" name="Planned" />
                    <Bar dataKey="started" fill="#3b82f6" name="Started" />
                    <Bar dataKey="completed" fill="#10b981" name="Completed" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Services Access Comparison */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Basic Services Access by Settlement Type (%)</h3>
            <div className="h-[300px] sm:h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={servicesAccessData} barCategoryGap="15%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="service" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Bar dataKey="formal" fill="#10b981" name="Formal Dwellings" />
                  <Bar dataKey="informal" fill="#f59e0b" name="Informal Settlements" />
                  <Bar dataKey="traditional" fill="#8b5cf6" name="Traditional Dwellings" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Provincial Performance Overview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 overflow-x-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Provincial Performance Overview</h3>
            <div className="min-w-[700px] sm:min-w-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 sm:px-4 font-semibold text-gray-900">Province</th>
                    <th className="text-left py-3 px-2 sm:px-4 font-semibold text-gray-900">Total Units</th>
                    <th className="text-left py-3 px-2 sm:px-4 font-semibold text-gray-900">Informal Rate</th>
                    <th className="text-left py-3 px-2 sm:px-4 font-semibold text-gray-900">Registration Rate</th>
                    <th className="text-left py-3 px-2 sm:px-4 font-semibold text-gray-900">Active Projects</th>
                    <th className="text-left py-3 px-2 sm:px-4 font-semibold text-gray-900">Priority Level</th>
                  </tr>
                </thead>
                <tbody>
                  {provincialData.map((province, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-2 sm:px-4">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="font-medium text-gray-900">{province.province}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2 sm:px-4 text-sm sm:text-base text-gray-600">{province.totalUnits.toLocaleString()}</td>
                      <td className="py-3 px-2 sm:px-4">
                        <div className="flex items-center gap-1 sm:gap-2">
                          {province.informal > 20 ? (
                            <AlertTriangle className="h-4 w-4 text-orange-500" />
                          ) : (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                          <span className={`text-sm ${province.informal > 20 ? 'text-orange-600' : 'text-gray-600'}`}>
                            {province.informal}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-2 sm:px-4">
                        <span className={`text-sm sm:text-base font-medium ${
                          province.registrationRate >= 70 ? 'text-green-600' : 
                          province.registrationRate >= 50 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {province.registrationRate}%
                        </span>
                      </td>
                      <td className="py-3 px-2 sm:px-4 text-sm sm:text-base text-gray-600">{province.upgradeProjects}</td>
                      <td className="py-3 px-2 sm:px-4">
                        <span className={`px-2 py-1 rounded-full text-xs sm:text-sm font-medium ${
                          province.registrationRate >= 70 && province.informal < 15
                            ? 'bg-green-100 text-green-700'
                            : province.registrationRate >= 50 && province.informal < 25
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {province.registrationRate >= 70 && province.informal < 15 
                            ? 'Low' 
                            : province.registrationRate >= 50 && province.informal < 25
                            ? 'Medium' 
                            : 'High Priority'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;