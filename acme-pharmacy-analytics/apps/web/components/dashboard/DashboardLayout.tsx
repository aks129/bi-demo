'use client'

import { Sidebar } from './Sidebar'

interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
}

export function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        {(title || subtitle) && (
          <div className="bg-white border-b border-gray-200 px-8 py-6">
            {title && (
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            )}
            {subtitle && (
              <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
            )}
          </div>
        )}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
