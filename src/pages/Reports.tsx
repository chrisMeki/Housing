import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Eye, 
  Calendar, 
  Filter, 
  Search, 
  BarChart3, 
  Map, 
  Home, 
  Users, 
  TrendingUp,
  Plus,
  MoreVertical,
  MapPin,
  Building,
  Activity,
  Globe,
  X,
  Clock,
  CheckCircle,
  Menu,
  Bell,
  Settings
} from 'lucide-react';
import Sidebar from "../components/sidebar";

const Reports = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('reports');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [previewModal, setPreviewModal] = useState(null);

  const reportTypes = [
    {
      id: 1,
      name: 'Land Registration Overview',
      description: 'Comprehensive overview of registered land parcels and housing units',
      icon: Building,
      count: 12847,
      lastGenerated: '10 August 2025',
      status: 'ready',
      category: 'Land Management',
      details: {
        summary: 'This report provides a comprehensive analysis of all registered land parcels and housing units within the administrative boundaries. It includes data on property types, ownership patterns, and registration status.',
        dataPoints: [
          'Total registered properties: 12,847',
          'Residential properties: 8,567 (66.7%)',
          'Commercial properties: 2,134 (16.6%)',
          'Agricultural land: 1,892 (14.7%)',
          'Industrial properties: 254 (2.0%)'
        ],
        keyInsights: [
          'Residential registrations increased by 15% compared to last quarter',
          'Ward 15 shows highest concentration of new registrations (234 properties)',
          'Average property size: 0.8 hectares',
          'Complete registration rate: 87% (improvement from 82% last quarter)'
        ],
        methodology: 'Data collected from ward offices, traditional authority records, and community registration centers. Cross-referenced with surveyor general records and municipal planning documents.',
        coverage: 'All 142 wards within the district administrative boundaries',
        lastUpdate: '10 August 2025 at 14:30'
      }
    },
    {
      id: 2,
      name: 'Ward Distribution Analysis',
      description: 'Property distribution across wards and administrative boundaries',
      icon: MapPin,
      count: 8562,
      lastGenerated: '9 August 2025',
      status: 'ready',
      category: 'Geographic Analysis',
      details: {
        summary: 'Detailed geographic analysis showing property distribution patterns across all administrative wards, highlighting areas of high density and development gaps.',
        dataPoints: [
          'Total wards analyzed: 142',
          'Average properties per ward: 60.3',
          'Highest density ward: Ward 12 (489 properties)',
          'Lowest density ward: Ward 87 (12 properties)',
          'Urban wards: 45 (31.7% of total)'
        ],
        keyInsights: [
          'Urban wards contain 68% of all registered properties',
          'Rural wards show 23% increase in registrations over past year',
          'Border wards have lower registration rates due to accessibility',
          'Central business district wards show highest commercial property concentration'
        ],
        methodology: 'GIS mapping analysis combined with administrative boundary data. Property coordinates verified through ground surveys and satellite imagery validation.',
        coverage: 'Complete district coverage including rural, peri-urban, and urban areas',
        lastUpdate: '9 August 2025 at 16:45'
      }
    },
    {
      id: 3,
      name: 'Traditional Authority Mapping',
      description: 'Land ownership patterns in traditional authority areas',
      icon: Globe,
      count: 4321,
      lastGenerated: '8 August 2025',
      status: 'processing',
      category: 'Traditional Governance',
      details: {
        summary: 'Analysis of land ownership and usage patterns within traditional authority jurisdictions, examining the intersection of customary and statutory land rights.',
        dataPoints: [
          'Traditional authorities covered: 28',
          'Customary land holdings: 4,321',
          'Converted to statutory title: 1,567 (36.3%)',
          'Pending conversions: 892 (20.6%)',
          'Community land: 1,862 (43.1%)'
        ],
        keyInsights: [
          'Increasing trend in statutory title conversions (up 28% from last year)',
          'Chief Mangwende area shows highest conversion rate (78%)',
          'Family land disputes decreased by 15% with better documentation',
          'Women land ownership increased to 31% in converted areas'
        ],
        methodology: 'Collaboration with traditional leaders, community meetings, and family tree documentation. Cross-referenced with existing customary records.',
        coverage: '28 traditional authority areas across 89 wards',
        lastUpdate: '8 August 2025 at 11:20 (Processing)'
      }
    },
    {
      id: 4,
      name: 'Housing Development Trends',
      description: 'Urban and rural housing development patterns and growth',
      icon: TrendingUp,
      count: 2890,
      lastGenerated: '7 August 2025',
      status: 'ready',
      category: 'Development Planning',
      details: {
        summary: 'Comprehensive analysis of housing development trends showing growth patterns, construction types, and infrastructure development across urban and rural areas.',
        dataPoints: [
          'New housing developments: 2,890',
          'Urban developments: 1,734 (60.0%)',
          'Rural developments: 1,156 (40.0%)',
          'Multi-story buildings: 234 (8.1%)',
          'Low-cost housing projects: 567 (19.6%)'
        ],
        keyInsights: [
          'Rural housing development accelerated by 34% following infrastructure improvements',
          'Solar panel installations increased by 156% in new developments',
          'Water access improved to 89% in new housing areas',
          'Average construction time decreased from 8 to 6 months'
        ],
        methodology: 'Building permit analysis, construction completion certificates, and infrastructure connectivity assessments.',
        coverage: 'All registered housing developments completed in the last 24 months',
        lastUpdate: '7 August 2025 at 13:15'
      }
    },
    {
      id: 5,
      name: 'Community Demographics',
      description: 'Population and household statistics by residential areas',
      icon: Users,
      count: 15632,
      lastGenerated: '6 August 2025',
      status: 'ready',
      category: 'Social Statistics',
      details: {
        summary: 'Detailed demographic analysis of communities within registered housing areas, providing insights into household composition, age distribution, and socio-economic indicators.',
        dataPoints: [
          'Total households surveyed: 15,632',
          'Average household size: 4.7 persons',
          'Youth population (under 25): 62.3%',
          'Elderly population (over 60): 8.9%',
          'Female-headed households: 31.2%'
        ],
        keyInsights: [
          'Youth population concentration highest in peri-urban areas',
          'Female land ownership increased significantly in formal registration areas',
          'Average education level: primary completed (68%), secondary (45%)',
          'Main occupation: Agriculture (42%), informal trade (28%), formal employment (18%)'
        ],
        methodology: 'Community surveys conducted by trained enumerators, household visits, and community leader consultations.',
        coverage: 'Representative sample across all 142 wards with 95% confidence level',
        lastUpdate: '6 August 2025 at 09:30'
      }
    },
    {
      id: 6,
      name: 'Land Use Classification',
      description: 'Agricultural, residential, and commercial land use breakdown',
      icon: Map,
      count: 9876,
      lastGenerated: '5 August 2025',
      status: 'ready',
      category: 'Land Use Planning',
      details: {
        summary: 'Comprehensive land use classification report analyzing how registered land is utilized across different sectors and providing insights for future planning.',
        dataPoints: [
          'Total classified parcels: 9,876',
          'Agricultural use: 5,432 (55.0%)',
          'Residential use: 3,234 (32.7%)',
          'Commercial use: 876 (8.9%)',
          'Mixed use: 334 (3.4%)'
        ],
        keyInsights: [
          'Shift from agricultural to residential use in peri-urban areas (12% increase)',
          'Commercial development concentrated along main transport corridors',
          'Small-scale farming remains dominant in rural wards',
          'Mixed-use development increasing in market town centers'
        ],
        methodology: 'Satellite imagery analysis, ground surveys, and land use permit records. Validated through community consultations.',
        coverage: 'All registered land parcels with verified coordinates',
        lastUpdate: '5 August 2025 at 17:00'
      }
    }
  ];

  const documents = [
    {
      id: 1,
      name: 'Q2_Land_Registry_Report_2025.pdf',
      type: 'PDF',
      size: '3.2 MB',
      created: '5 August 2025',
      category: 'Report',
      icon: FileText,
      language: 'English'
    },
    {
      id: 2,
      name: 'Ward_Boundary_Data_Export.xlsx',
      type: 'Excel',
      size: '2.1 MB',
      created: '4 August 2025',
      category: 'Data Export',
      icon: FileText,
      language: 'English'
    },
    {
      id: 3,
      name: 'Traditional_Authority_Guidelines.pdf',
      type: 'PDF',
      size: '1.8 MB',
      created: '3 August 2025',
      category: 'Documentation',
      icon: FileText,
      language: 'English'
    },
    {
      id: 4,
      name: 'Community_Survey_Analysis_2025.xlsx',
      type: 'Excel',
      size: '4.1 MB',
      created: '2 August 2025',
      category: 'Analysis',
      icon: FileText,
      language: 'English'
    },
    {
      id: 5,
      name: 'Rural_Housing_Development_Plan.pdf',
      type: 'PDF',
      size: '2.8 MB',
      created: '1 August 2025',
      category: 'Planning',
      icon: FileText,
      language: 'English'
    },
    {
      id: 6,
      name: 'Urban_Settlement_Mapping_July.pdf',
      type: 'PDF',
      size: '3.5 MB',
      created: '31 July 2025',
      category: 'Report',
      icon: FileText,
      language: 'English'
    },
    {
      id: 7,
      name: 'Agricultural_Land_Assessment.xlsx',
      type: 'Excel',
      size: '1.9 MB',
      created: '30 July 2025',
      category: 'Analysis',
      icon: FileText,
      language: 'English'
    },
    {
      id: 8,
      name: 'Housing_Cooperative_Registry.pdf',
      type: 'PDF',
      size: '2.3 MB',
      created: '29 July 2025',
      category: 'Registry',
      icon: FileText,
      language: 'English'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-orange-100 text-orange-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Land Management': 'bg-blue-100 text-blue-700',
      'Geographic Analysis': 'bg-green-100 text-green-700',
      'Traditional Governance': 'bg-purple-100 text-purple-700',
      'Development Planning': 'bg-yellow-100 text-yellow-700',
      'Social Statistics': 'bg-pink-100 text-pink-700',
      'Land Use Planning': 'bg-indigo-100 text-indigo-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || doc.category.toLowerCase() === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex min-h-screen bg-orange-50">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main Content */}
      <div className="flex-1 lg:ml-72">
        {/* Mobile Header with Hamburger */}
        <div className="lg:hidden bg-white shadow-sm p-4 flex items-center justify-between sticky top-0 z-40">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">
            Reports & Documents
          </h1>
          <div className="w-8"></div> {/* Spacer for balance */}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header Section */}
          <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Reports & Documents</h1>
                <p className="text-gray-600 mt-2">Land registry reports and housing documentation system</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm text-orange-600 font-medium">Ministry of Lands, Housing & Urban Development</span>
                </div>
              </div>
              <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-sm">
                <Plus className="w-4 h-4" />
                <span className="whitespace-nowrap">Generate New Report</span>
              </button>
            </div>
          </div>

          {/* Statistics Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border border-orange-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Properties</p>
                  <p className="text-xl font-semibold text-gray-900">54,267</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-orange-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <MapPin className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Wards Covered</p>
                  <p className="text-xl font-semibold text-gray-900">142</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-orange-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Registered Owners</p>
                  <p className="text-xl font-semibold text-gray-900">38,451</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-orange-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Activity className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">This Month</p>
                  <p className="text-xl font-semibold text-gray-900">+523</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-xl shadow-sm border border-orange-100 mb-6">
            <div className="flex border-b border-orange-100 overflow-x-auto">
              <button
                onClick={() => setActiveTab('reports')}
                className={`px-4 sm:px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'reports'
                    ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  System Reports
                </div>
              </button>
              <button
                onClick={() => setActiveTab('documents')}
                className={`px-4 sm:px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'documents'
                    ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Document Library
                </div>
              </button>
            </div>

            {/* Reports Tab */}
            {activeTab === 'reports' && (
              <div className="p-6">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Available Reports</h2>
                  <p className="text-gray-600">Generate comprehensive reports for land administration and housing management</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {reportTypes.map((report) => {
                    const IconComponent = report.icon;
                    return (
                      <div key={report.id} className="bg-gradient-to-br from-white to-orange-25 rounded-lg p-6 border border-orange-100 hover:shadow-md transition-all duration-200">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start gap-4">
                            <div className="p-3 bg-orange-100 rounded-lg">
                              <IconComponent className="w-6 h-6 text-orange-600" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-1">{report.name}</h3>
                              <p className="text-gray-600 text-sm leading-relaxed">{report.description}</p>
                              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${getCategoryColor(report.category)}`}>
                                {report.category}
                              </span>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                            {report.status === 'ready' ? 'Available' : 'Processing'}
                          </span>
                        </div>
                        
                        <div className="bg-white rounded-lg p-3 mb-4 border border-orange-100">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm">
                            <div className="flex items-center gap-1 text-gray-600">
                              <Activity className="w-4 h-4" />
                              <span className="font-medium text-gray-900">{report.count.toLocaleString()}</span> records
                            </div>
                            <div className="flex items-center gap-1 text-gray-600">
                              <Calendar className="w-4 h-4" />
                              <span>Updated: {report.lastGenerated}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                          <button 
                            onClick={() => setPreviewModal(report)}
                            className="flex-1 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg flex items-center justify-center gap-2 border border-gray-200 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            Preview
                          </button>
                          <button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm">
                            <Download className="w-4 h-4" />
                            Download
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div className="p-6">
                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search documents and reports..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                    />
                  </div>
                  <div className="flex gap-3">
                    <select
                      value={selectedFilter}
                      onChange={(e) => setSelectedFilter(e.target.value)}
                      className="px-4 py-3 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white min-w-40"
                    >
                      <option value="all">All Categories</option>
                      <option value="report">Reports</option>
                      <option value="data export">Data Exports</option>
                      <option value="documentation">Documentation</option>
                      <option value="analysis">Analysis</option>
                      <option value="planning">Planning</option>
                      <option value="registry">Registry</option>
                    </select>
                    <button className="p-3 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors bg-white">
                      <Filter className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* Documents List */}
                <div className="bg-white rounded-lg border border-orange-100 overflow-hidden shadow-sm">
                  <div className="px-4 sm:px-6 py-4 bg-orange-50 border-b border-orange-100">
                    <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      <div className="col-span-7 sm:col-span-5">Document Name</div>
                      <div className="col-span-3 hidden sm:block">Type</div>
                      <div className="col-span-2 hidden sm:block">Size</div>
                      <div className="col-span-2 hidden sm:block">Date</div>
                      <div className="col-span-2 sm:col-span-1">Actions</div>
                    </div>
                  </div>
                  
                  <div className="divide-y divide-orange-100">
                    {filteredDocuments.map((doc) => {
                      const IconComponent = doc.icon;
                      return (
                        <div key={doc.id} className="px-4 sm:px-6 py-4 hover:bg-orange-25 transition-colors">
                          <div className="grid grid-cols-12 gap-4 items-center">
                            <div className="col-span-7 sm:col-span-5 flex items-center gap-3">
                              <div className="p-2 bg-orange-100 rounded-lg">
                                <IconComponent className="w-4 h-4 text-orange-600" />
                              </div>
                              <div className="min-w-0">
                                <div className="font-medium text-gray-900 truncate">{doc.name}</div>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                                    {doc.category}
                                  </span>
                                  <span className="text-xs text-gray-500 hidden sm:inline">{doc.language}</span>
                                </div>
                              </div>
                            </div>
                            <div className="col-span-3 text-sm text-gray-600 hidden sm:block">
                              <span className="px-2 py-1 bg-gray-100 rounded text-xs">{doc.type}</span>
                            </div>
                            <div className="col-span-2 text-sm text-gray-600 hidden sm:block">{doc.size}</div>
                            <div className="col-span-2 text-sm text-gray-600 hidden sm:block">{doc.created}</div>
                            <div className="col-span-2 sm:col-span-1 flex items-center gap-2">
                              <button className="p-2 hover:bg-orange-100 rounded-lg transition-colors text-gray-500 hover:text-orange-600">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-2 hover:bg-orange-100 rounded-lg transition-colors text-gray-500 hover:text-orange-600">
                                <Download className="w-4 h-4" />
                              </button>
                              <button className="p-2 hover:bg-orange-100 rounded-lg transition-colors text-gray-500 hover:text-orange-600">
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {filteredDocuments.length === 0 && (
                  <div className="text-center py-16">
                    <div className="p-4 bg-orange-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <FileText className="w-8 h-8 text-orange-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
                    <p className="text-gray-500 max-w-sm mx-auto">
                      Try adjusting your search terms or filter criteria to find the documents you're looking for.
                    </p>
                  </div>
                )}

                {/* Pagination */}
                {filteredDocuments.length > 0 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t border-orange-100 gap-4">
                    <p className="text-sm text-gray-600">
                      Showing {filteredDocuments.length} of {documents.length} documents
                    </p>
                    <div className="flex gap-2">
                      <button className="px-3 py-2 text-sm border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors">
                        Previous
                      </button>
                      <button className="px-3 py-2 text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                        1
                      </button>
                      <button className="px-3 py-2 text-sm border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors">
                        2
                      </button>
                      <button className="px-3 py-2 text-sm border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors">
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Information */}
          <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Report Schedule</h3>
                <p className="text-gray-600 text-sm">
                  Automated reports are generated weekly on Sundays and monthly summaries on the last day of each month.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Data Sources</h3>
                <p className="text-gray-600 text-sm">
                  Information sourced from ward offices, traditional authorities, and community registration centers.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Support</h3>
                <p className="text-gray-600 text-sm">
                  For technical assistance or data queries, contact the Land Registry Help Desk at extension 2847.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;