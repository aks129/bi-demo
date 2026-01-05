'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { DashboardCard } from '@/components/dashboard/DashboardCard'
import { Database, Search, Tag, Code, FileText, Link as LinkIcon, X } from 'lucide-react'

// Import mock data directly for client component
import { mockDictionaryEntries, type MockDictionaryEntry } from '@/lib/platform-mock-data'

const categories = [
  { key: 'all', name: 'All Terms', count: 0 },
  { key: 'metric', name: 'Metrics', count: 0 },
  { key: 'clinical', name: 'Clinical', count: 0 },
  { key: 'business', name: 'Business', count: 0 },
  { key: 'dimension', name: 'Dimensions', count: 0 },
]

export default function DataDictionaryPage() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedTerm, setSelectedTerm] = useState<MockDictionaryEntry | null>(null)
  const [entries, setEntries] = useState<MockDictionaryEntry[]>([])

  useEffect(() => {
    // Filter entries based on search and category
    let filtered = [...mockDictionaryEntries]

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(e => e.category === selectedCategory)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(e =>
        e.term.toLowerCase().includes(searchLower) ||
        e.definition.toLowerCase().includes(searchLower)
      )
    }

    setEntries(filtered.sort((a, b) => a.term.localeCompare(b.term)))
  }, [search, selectedCategory])

  // Calculate category counts
  const categoryCounts = {
    all: mockDictionaryEntries.length,
    metric: mockDictionaryEntries.filter(e => e.category === 'metric').length,
    clinical: mockDictionaryEntries.filter(e => e.category === 'clinical').length,
    business: mockDictionaryEntries.filter(e => e.category === 'business').length,
    dimension: mockDictionaryEntries.filter(e => e.category === 'dimension').length,
  }

  return (
    <DashboardLayout
      title="Data Dictionary"
      subtitle="Definitions, formulas, and data sources for all platform metrics"
      showChat={false}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 mb-8 text-white">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-lg">
            <Database className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Data Dictionary</h2>
            <p className="text-purple-100 text-sm">
              Search and explore {mockDictionaryEntries.length} terms, metrics, and definitions
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Categories */}
        <div className="lg:col-span-1">
          <DashboardCard title="Categories">
            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedCategory === cat.key
                      ? 'bg-purple-100 text-purple-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    selectedCategory === cat.key
                      ? 'bg-purple-200 text-purple-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {categoryCounts[cat.key as keyof typeof categoryCounts]}
                  </span>
                </button>
              ))}
            </div>
          </DashboardCard>

          {/* Legend */}
          <div className="mt-6 bg-white border border-gray-200 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 mb-3 text-sm">Data Types</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded">number</span>
                <span className="text-gray-500">Numeric values</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded">string</span>
                <span className="text-gray-500">Text values</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded">boolean</span>
                <span className="text-gray-500">True/False</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded">date</span>
                <span className="text-gray-500">Date/Time</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search terms, definitions, or formulas..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Terms Table */}
          <DashboardCard
            title={`${entries.length} Terms`}
            subtitle={selectedCategory !== 'all' ? `Filtered by ${selectedCategory}` : 'All categories'}
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Term
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Definition
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {entries.map((entry) => (
                    <tr
                      key={entry.id}
                      className="hover:bg-purple-50 cursor-pointer transition-colors"
                      onClick={() => setSelectedTerm(entry)}
                    >
                      <td className="px-4 py-4">
                        <span className="font-medium text-gray-900">{entry.term}</span>
                      </td>
                      <td className="px-4 py-4 max-w-md">
                        <span className="text-sm text-gray-600 line-clamp-2">{entry.definition}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          entry.category === 'metric' ? 'bg-blue-100 text-blue-700' :
                          entry.category === 'clinical' ? 'bg-green-100 text-green-700' :
                          entry.category === 'business' ? 'bg-amber-100 text-amber-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {entry.category}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        {entry.dataType && (
                          <span className={`px-2 py-0.5 text-xs rounded ${
                            entry.dataType === 'number' ? 'bg-blue-100 text-blue-700' :
                            entry.dataType === 'string' ? 'bg-green-100 text-green-700' :
                            entry.dataType === 'boolean' ? 'bg-amber-100 text-amber-700' :
                            'bg-purple-100 text-purple-700'
                          }`}>
                            {entry.dataType}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DashboardCard>
        </div>
      </div>

      {/* Term Detail Modal */}
      {selectedTerm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedTerm.term}</h2>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      selectedTerm.category === 'metric' ? 'bg-blue-100 text-blue-700' :
                      selectedTerm.category === 'clinical' ? 'bg-green-100 text-green-700' :
                      selectedTerm.category === 'business' ? 'bg-amber-100 text-amber-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {selectedTerm.category}
                    </span>
                    {selectedTerm.dataType && (
                      <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded">
                        {selectedTerm.dataType}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedTerm(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Definition */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Definition
                </h3>
                <p className="text-gray-900">{selectedTerm.definition}</p>
              </div>

              {/* Formula */}
              {selectedTerm.formula && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    Formula / Calculation
                  </h3>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                    {selectedTerm.formula}
                  </div>
                </div>
              )}

              {/* Source */}
              {selectedTerm.source && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    Data Source
                  </h3>
                  <code className="bg-purple-50 text-purple-700 px-3 py-1.5 rounded text-sm">
                    {selectedTerm.source}
                  </code>
                </div>
              )}

              {/* Example */}
              {selectedTerm.example && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Example
                  </h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
                    {selectedTerm.example}
                  </div>
                </div>
              )}

              {/* Related Terms */}
              {selectedTerm.relatedTerms.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <LinkIcon className="h-4 w-4" />
                    Related Terms
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTerm.relatedTerms.map((term, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          const related = mockDictionaryEntries.find(e => e.term === term)
                          if (related) setSelectedTerm(related)
                        }}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-purple-100 hover:text-purple-700 transition-colors flex items-center gap-1"
                      >
                        <Tag className="h-3 w-3" />
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setSelectedTerm(null)}
                className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
