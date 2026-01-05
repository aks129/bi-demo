'use client'

import { useState } from 'react'
import { Download, FileText, Mail, Loader2 } from 'lucide-react'

interface ExportButtonProps {
  reportTitle?: string
  reportType?: 'mtm' | 'roi' | 'eligibility' | 'work-queue'
}

export function ExportButton({
  reportTitle = 'Dashboard Report',
  reportType = 'mtm'
}: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const handlePrintPDF = async () => {
    setIsExporting(true)
    setIsOpen(false)

    // Small delay to let the menu close
    await new Promise(resolve => setTimeout(resolve, 100))

    // Use browser print dialog which allows saving as PDF
    window.print()

    setIsExporting(false)
  }

  const handleScheduleEmail = () => {
    setIsOpen(false)
    // Demo: show alert for feature not yet implemented
    alert('Email scheduling will be available in the next release. Contact your administrator to set up automated reports.')
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isExporting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        Export
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
            <div className="p-2">
              <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                Export Options
              </p>

              <button
                onClick={handlePrintPDF}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <FileText className="h-4 w-4 text-red-600" />
                <div className="text-left">
                  <p className="font-medium">Export as PDF</p>
                  <p className="text-xs text-gray-500">Print or save current view</p>
                </div>
              </button>

              <button
                onClick={handleScheduleEmail}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <Mail className="h-4 w-4 text-blue-600" />
                <div className="text-left">
                  <p className="font-medium">Schedule Email Report</p>
                  <p className="text-xs text-gray-500">Daily, weekly, or monthly</p>
                </div>
              </button>
            </div>

            <div className="border-t border-gray-100 p-3">
              <p className="text-xs text-gray-500">
                Report: {reportTitle}
              </p>
            </div>
          </div>
        </>
      )}

      {/* Print styles - hide sidebar and show only main content */}
      <style jsx global>{`
        @media print {
          /* Hide sidebar, nav, and non-essential elements */
          .print\\:hidden,
          nav,
          aside,
          [data-sidebar],
          button,
          .export-button {
            display: none !important;
          }

          /* Make main content full width */
          main {
            margin: 0 !important;
            padding: 20px !important;
            width: 100% !important;
          }

          /* Ensure content is visible */
          .print\\:block {
            display: block !important;
          }

          /* Add report header */
          body::before {
            content: "${reportTitle} - Generated ${new Date().toLocaleDateString()}";
            display: block;
            text-align: center;
            font-size: 12px;
            color: #666;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 1px solid #ccc;
          }

          /* Page settings */
          @page {
            margin: 0.5in;
            size: letter landscape;
          }

          /* Ensure charts render properly */
          svg {
            max-width: 100%;
            height: auto;
          }

          /* Force background colors to print */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  )
}
