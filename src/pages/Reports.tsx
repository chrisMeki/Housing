import React, { useState, useEffect } from "react";
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
  Settings,
  User,
} from "lucide-react";
import Sidebar from "../components/sidebar";
import ReportsService from "../services/reports_Service";

// Define TypeScript interfaces
interface Document {
  name: string;
  url: string;
  fileType: string;
}

interface Report {
  _id: string;
  title: string;
  description: string;
  userId: string;
  document: Document;
  createdAt: string;
  updatedAt: string;
  author: string;
  size: string;
  category: string;
  recordCount: number;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Reports: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("reports");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [previewModal, setPreviewModal] = useState<Report | null>(null);
  const [reports, setReports] = useState<Report[]>([]); // Properly typed as Report[]
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async (): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const userId = localStorage.getItem("userId");

        if (!userId) {
          setError("No user ID found. Please log in again.");
          setLoading(false);
          return;
        }

        const response = await ReportsService.getReportsByUserId(userId);
        setReports(response.data || response);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
        setError("Failed to load reports. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const getFileIcon = (fileType: string) => {
    switch (fileType?.toLowerCase()) {
      case "pdf":
        return FileText;
      case "xlsx":
      case "xls":
        return FileText;
      case "docx":
      case "doc":
        return FileText;
      default:
        return FileText;
    }
  };

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      "Land Management": "bg-blue-100 text-blue-700",
      "Geographic Analysis": "bg-green-100 text-green-700",
      "Traditional Governance": "bg-purple-100 text-purple-700",
      "Development Planning": "bg-yellow-100 text-yellow-700",
      "Social Statistics": "bg-pink-100 text-pink-700",
      "Land Use Planning": "bg-indigo-100 text-indigo-700",
    };
    return colors[category] || "bg-gray-100 text-gray-700";
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatFileType = (fileType: string): string => {
    if (!fileType) return "FILE";

    const typeMap: Record<string, string> = {
      pdf: "PDF",
      "application/pdf": "PDF",
      doc: "DOC",
      "application/msword": "DOC",
      docx: "DOCX",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        "DOCX",
      xls: "XLS",
      "application/vnd.ms-excel": "XLS",
      xlsx: "XLSX",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        "XLSX",
    };

    const cleanType = fileType.toLowerCase();
    return (
      typeMap[cleanType] || fileType.split(".").pop()?.toUpperCase() || "FILE"
    );
  };

  const filteredReports = reports.filter((report: Report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      selectedFilter === "all" ||
      report.category.toLowerCase().includes(selectedFilter.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  // Replace the existing loading return statement with this:
  if (loading) {
    return (
      <div className="flex min-h-screen bg-orange-50">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 lg:ml-72 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading reports...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-orange-50">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 lg:ml-72 flex items-center justify-center">
          <div className="text-center">
            <div className="p-4 bg-red-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <FileText className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Error Loading Reports
            </h3>
            <p className="text-gray-500 max-w-sm mx-auto mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-orange-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

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
          <div className="w-8"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header Section */}
          <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Reports & Documents
                </h1>
                <p className="text-gray-600 mt-2">
                  Land registry reports and housing documentation system
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm text-orange-600 font-medium">
                    Ministry of Lands, Housing & Urban Development
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border border-orange-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Reports</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {reports.length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-orange-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <MapPin className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Categories</p>
                  <p className="text-xl font-semibold text-gray-900">6</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-orange-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Contributors</p>
                  <p className="text-xl font-semibold text-gray-900">6</p>
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
                  <p className="text-xl font-semibold text-gray-900">
                    +{reports.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search reports by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                />
              </div>
              <div className="flex gap-3">
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="px-4 py-3 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white min-w-48"
                >
                  <option value="all">All Categories</option>
                  <option value="land management">Land Management</option>
                  <option value="geographic">Geographic Analysis</option>
                  <option value="traditional">Traditional Governance</option>
                  <option value="development">Development Planning</option>
                  <option value="social">Social Statistics</option>
                  <option value="land use">Land Use Planning</option>
                </select>
                <button className="p-3 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors bg-white">
                  <Filter className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
          </div>

          {/* Reports Grid */}
          {filteredReports.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {filteredReports.map((report: Report) => {
                const IconComponent = getFileIcon(report.document.fileType);
                return (
                  <div
                    key={report._id}
                    className="bg-gradient-to-br from-white to-orange-25 rounded-lg p-6 border border-orange-100 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-orange-100 rounded-lg">
                          <IconComponent className="w-6 h-6 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {report.title}
                          </h3>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {report.description}
                          </p>
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${getCategoryColor(
                              report.category
                            )}`}
                          >
                            {report.category}
                          </span>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {formatFileType(report.document.fileType)}
                      </span>
                    </div>

                    <div className="bg-white rounded-lg p-3 mb-4 border border-orange-100">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-1 text-gray-600">
                          <User className="w-4 h-4" />
                          <span className="text-gray-900 font-medium">
                            {report.author}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <Activity className="w-4 h-4" />
                          <span className="font-medium text-gray-900">
                            {(report.recordCount || 0).toLocaleString()}
                          </span>{" "}
                          records
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(report.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>{report.size}</span>
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
                      <a
                        href={report.document.url}
                        download={report.document.name}
                        className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-orange-100">
              <div className="p-4 bg-orange-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <FileText className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No reports found
              </h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                Try adjusting your search terms or filter criteria to find the
                reports you're looking for.
              </p>
            </div>
          )}

          {/* Preview Modal */}
          {previewModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {previewModal.title}
                    </h2>
                    <button
                      onClick={() => setPreviewModal(null)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">
                        Description
                      </h3>
                      <p className="text-gray-600">
                        {previewModal.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">
                          Document Details
                        </h3>
                        <div className="space-y-2 text-sm">
                          <p>
                            <span className="font-medium">File:</span>{" "}
                            {previewModal.document.name}
                          </p>
                          <p>
                            <span className="font-medium">Type:</span>{" "}
                            {formatFileType(previewModal.document.fileType)}
                          </p>
                          <p>
                            <span className="font-medium">Size:</span>{" "}
                            {previewModal.size}
                          </p>
                          <p>
                            <span className="font-medium">Records:</span>{" "}
                            {(previewModal.recordCount || 0).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">
                          Report Information
                        </h3>
                        <div className="space-y-2 text-sm">
                          <p>
                            <span className="font-medium">Author:</span>{" "}
                            {previewModal.author}
                          </p>
                          <p>
                            <span className="font-medium">Category:</span>{" "}
                            {previewModal.category}
                          </p>
                          <p>
                            <span className="font-medium">Created:</span>{" "}
                            {formatDate(previewModal.createdAt)}
                          </p>
                          <p>
                            <span className="font-medium">Updated:</span>{" "}
                            {formatDate(previewModal.updatedAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => setPreviewModal(null)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                    >
                      Close
                    </button>
                    <a
                      href={previewModal.document.url}
                      download={previewModal.document.name}
                      className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
