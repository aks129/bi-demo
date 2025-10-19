'use client'

import { useState } from 'react'

interface FilterOption {
  label: string
  value: string
}

interface FilterBarProps {
  dateRange?: {
    start: string
    end: string
    onChange: (start: string, end: string) => void
  }
  filters?: Array<{
    label: string
    options: FilterOption[]
    value: string
    onChange: (value: string) => void
  }>
}

export function FilterBar({ dateRange, filters }: FilterBarProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div className="flex flex-wrap gap-4 items-center">
        {dateRange && (
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Date Range:</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => dateRange.onChange(e.target.value, dateRange.end)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => dateRange.onChange(dateRange.start, e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        {filters?.map((filter, index) => (
          <div key={index} className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">{filter.label}:</label>
            <select
              value={filter.value}
              onChange={(e) => filter.onChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  )
}
