'use client'

import { Sidebar } from './Sidebar'
import { ContractSelector } from './ContractSelector'
import { ExportButton } from './ExportButton'

interface Contract {
  id: string
  name: string
  contractNumber: string
}

interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  contracts?: Contract[]
  currentContractId?: string
  showContractSelector?: boolean
  showExport?: boolean
}

export function DashboardLayout({
  children,
  title,
  subtitle,
  contracts = [],
  currentContractId,
  showContractSelector = false,
  showExport = true
}: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="print:hidden">
        <Sidebar />
      </div>
      <div className="flex-1">
        {(title || subtitle || showContractSelector) && (
          <div className="bg-white border-b border-gray-200 px-8 py-6 print:border-0">
            <div className="flex items-start justify-between">
              <div>
                {title && (
                  <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                )}
                {subtitle && (
                  <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
                )}
              </div>
              <div className="flex items-center gap-3 print:hidden">
                {showContractSelector && contracts.length > 0 && (
                  <ContractSelector
                    contracts={contracts}
                    currentContractId={currentContractId}
                  />
                )}
                {showExport && (
                  <ExportButton reportTitle={title} />
                )}
              </div>
            </div>
          </div>
        )}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
