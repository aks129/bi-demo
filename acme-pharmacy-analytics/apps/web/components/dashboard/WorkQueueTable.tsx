'use client'

import { useState, useMemo } from 'react'
import {
  Phone,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Filter,
  Search,
  X
} from 'lucide-react'

interface WorkQueueMember {
  id: string
  memberId: string | null
  name: string
  age: number
  priorityScore: number
  chronicDiseaseCount: number
  chronicDiseases: string | null
  drugCostsYTD: number
  riskBand: string
  needsCMR: boolean
  openTips: number
  avgAdherence: number
  lastContact: Date | null
}

interface WorkQueueTableProps {
  members: WorkQueueMember[]
  variant?: 'critical' | 'high' | 'standard'
}

type SortField = 'priorityScore' | 'name' | 'avgAdherence' | 'chronicDiseaseCount' | 'lastContact'
type SortDirection = 'asc' | 'desc'

function formatLastContact(date: Date | null): string {
  if (!date) return 'Never'

  const now = new Date()
  const diffDays = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  return `${Math.floor(diffDays / 30)} months ago`
}

function getAdherenceBadge(pdc: number) {
  if (pdc >= 80) return { label: 'Healthy', color: 'text-green-600' }
  if (pdc >= 75) return { label: 'At Risk', color: 'text-yellow-600' }
  return { label: 'Critical', color: 'text-red-600' }
}

export function WorkQueueTable({ members, variant = 'standard' }: WorkQueueTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<SortField>('priorityScore')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [filters, setFilters] = useState({
    needsCMR: false,
    hasOpenTips: false,
    lowAdherence: false,
    riskBand: 'all' as 'all' | 'High' | 'Medium' | 'Low'
  })
  const [showFilters, setShowFilters] = useState(false)

  // Filter and sort members
  const filteredMembers = useMemo(() => {
    let result = [...members]

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(m =>
        m.name.toLowerCase().includes(term) ||
        m.memberId?.toLowerCase().includes(term) ||
        m.chronicDiseases?.toLowerCase().includes(term)
      )
    }

    // Apply filters
    if (filters.needsCMR) {
      result = result.filter(m => m.needsCMR)
    }
    if (filters.hasOpenTips) {
      result = result.filter(m => m.openTips > 0)
    }
    if (filters.lowAdherence) {
      result = result.filter(m => m.avgAdherence < 80)
    }
    if (filters.riskBand !== 'all') {
      result = result.filter(m => m.riskBand === filters.riskBand)
    }

    // Sort
    result.sort((a, b) => {
      let aVal: number | string | Date | null
      let bVal: number | string | Date | null

      switch (sortField) {
        case 'name':
          aVal = a.name
          bVal = b.name
          break
        case 'lastContact':
          aVal = a.lastContact
          bVal = b.lastContact
          break
        default:
          aVal = a[sortField]
          bVal = b[sortField]
      }

      if (aVal === null) return 1
      if (bVal === null) return -1

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal)
      }

      if (aVal instanceof Date && bVal instanceof Date) {
        return sortDirection === 'asc'
          ? aVal.getTime() - bVal.getTime()
          : bVal.getTime() - aVal.getTime()
      }

      return sortDirection === 'asc'
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number)
    })

    return result
  }, [members, searchTerm, sortField, sortDirection, filters])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null
    return sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
  }

  const activeFilterCount = [
    filters.needsCMR,
    filters.hasOpenTips,
    filters.lowAdherence,
    filters.riskBand !== 'all'
  ].filter(Boolean).length

  const variantStyles = {
    critical: { row: 'hover:bg-red-100', button: 'bg-red-600 hover:bg-red-700' },
    high: { row: 'hover:bg-orange-50', button: 'bg-orange-600 hover:bg-orange-700' },
    standard: { row: 'hover:bg-gray-50', button: 'bg-blue-600 hover:bg-blue-700' }
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, member ID, or condition..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
            showFilters || activeFilterCount > 0
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Filter className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="px-1.5 py-0.5 text-xs bg-blue-600 text-white rounded-full">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-4">
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.needsCMR}
                onChange={(e) => setFilters(f => ({ ...f, needsCMR: e.target.checked }))}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Needs CMR</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.hasOpenTips}
                onChange={(e) => setFilters(f => ({ ...f, hasOpenTips: e.target.checked }))}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Has Open TIPs</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.lowAdherence}
                onChange={(e) => setFilters(f => ({ ...f, lowAdherence: e.target.checked }))}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Low Adherence (&lt;80%)</span>
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">Risk Band:</span>
              <select
                value={filters.riskBand}
                onChange={(e) => setFilters(f => ({ ...f, riskBand: e.target.value as typeof filters.riskBand }))}
                className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>
          {activeFilterCount > 0 && (
            <button
              onClick={() => setFilters({ needsCMR: false, hasOpenTips: false, lowAdherence: false, riskBand: 'all' })}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Results count */}
      <div className="text-sm text-gray-500">
        Showing {filteredMembers.length} of {members.length} members
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="text-left py-3 px-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('priorityScore')}
              >
                <div className="flex items-center gap-1">
                  Priority <SortIcon field="priorityScore" />
                </div>
              </th>
              <th
                className="text-left py-3 px-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-1">
                  Member <SortIcon field="name" />
                </div>
              </th>
              <th
                className="text-left py-3 px-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('chronicDiseaseCount')}
              >
                <div className="flex items-center gap-1">
                  Conditions <SortIcon field="chronicDiseaseCount" />
                </div>
              </th>
              <th
                className="text-left py-3 px-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('avgAdherence')}
              >
                <div className="flex items-center gap-1">
                  Adherence <SortIcon field="avgAdherence" />
                </div>
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Open Items
              </th>
              <th
                className="text-left py-3 px-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('lastContact')}
              >
                <div className="flex items-center gap-1">
                  Last Contact <SortIcon field="lastContact" />
                </div>
              </th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-500">
                  No members match your search or filters
                </td>
              </tr>
            ) : (
              filteredMembers.map((member) => {
                const adherenceBadge = getAdherenceBadge(member.avgAdherence)
                return (
                  <tr key={member.id} className={`border-b border-gray-100 ${variantStyles[variant].row}`}>
                    <td className="py-3 px-4">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                        member.priorityScore >= 70 ? 'bg-red-100' :
                        member.priorityScore >= 50 ? 'bg-orange-100' :
                        member.priorityScore >= 30 ? 'bg-yellow-100' : 'bg-gray-100'
                      }`}>
                        <span className={`font-bold ${
                          member.priorityScore >= 70 ? 'text-red-800' :
                          member.priorityScore >= 50 ? 'text-orange-800' :
                          member.priorityScore >= 30 ? 'text-yellow-800' : 'text-gray-600'
                        }`}>{member.priorityScore}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-900">{member.name}</p>
                      <p className="text-xs text-gray-500">
                        {member.memberId} | Age {member.age} | {member.riskBand} Risk
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-700">{member.chronicDiseaseCount} conditions</span>
                      {member.chronicDiseases && (
                        <p className="text-xs text-gray-500 truncate max-w-[150px]" title={member.chronicDiseases}>
                          {member.chronicDiseases.split(',').slice(0, 2).join(', ')}
                          {member.chronicDiseases.split(',').length > 2 && '...'}
                        </p>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-medium ${adherenceBadge.color}`}>
                        {member.avgAdherence.toFixed(0)}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {member.needsCMR && (
                          <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">CMR</span>
                        )}
                        {member.openTips > 0 && (
                          <span className="px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded">{member.openTips} TIP</span>
                        )}
                        {!member.needsCMR && member.openTips === 0 && (
                          <span className="text-xs text-gray-400">None</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {formatLastContact(member.lastContact)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white rounded-lg transition-colors ${variantStyles[variant].button}`}>
                          <Phone className="h-3 w-3" />
                          Contact
                        </button>
                        <button className="text-blue-600 hover:text-blue-800 p-1.5">
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
