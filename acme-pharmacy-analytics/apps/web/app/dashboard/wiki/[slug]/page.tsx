export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getWikiPage, getWikiPages } from '@/lib/platform-service'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { BookOpen, ChevronLeft, Clock, User, Edit, FileText } from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'

interface WikiPageProps {
  params: Promise<{ slug: string }>
}

export default async function WikiPageView({ params }: WikiPageProps) {
  const { slug } = await params
  const page = await getWikiPage(slug)

  if (!page) {
    notFound()
  }

  // Get related pages in same category
  const allPages = await getWikiPages(page.category)
  const relatedPages = allPages.filter(p => p.id !== page.id).slice(0, 3)

  // Simple markdown-like rendering
  const renderContent = (content: string) => {
    const lines = content.split('\n')
    const elements: React.ReactNode[] = []

    let inCodeBlock = false
    let codeContent: string[] = []

    lines.forEach((line, index) => {
      // Code blocks
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          elements.push(
            <pre key={`code-${index}`} className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4 text-sm">
              <code>{codeContent.join('\n')}</code>
            </pre>
          )
          codeContent = []
          inCodeBlock = false
        } else {
          inCodeBlock = true
        }
        return
      }

      if (inCodeBlock) {
        codeContent.push(line)
        return
      }

      // Headers
      if (line.startsWith('# ')) {
        elements.push(<h1 key={index} className="text-3xl font-bold text-gray-900 mt-8 mb-4">{line.slice(2)}</h1>)
      } else if (line.startsWith('## ')) {
        elements.push(<h2 key={index} className="text-2xl font-semibold text-gray-900 mt-6 mb-3">{line.slice(3)}</h2>)
      } else if (line.startsWith('### ')) {
        elements.push(<h3 key={index} className="text-xl font-medium text-gray-900 mt-4 mb-2">{line.slice(4)}</h3>)
      }
      // List items
      else if (line.startsWith('- ')) {
        elements.push(
          <li key={index} className="text-gray-700 ml-4 list-disc">
            {renderInlineFormatting(line.slice(2))}
          </li>
        )
      } else if (/^\d+\. /.test(line)) {
        elements.push(
          <li key={index} className="text-gray-700 ml-4 list-decimal">
            {renderInlineFormatting(line.replace(/^\d+\. /, ''))}
          </li>
        )
      }
      // Table rows
      else if (line.startsWith('|')) {
        const cells = line.split('|').filter(c => c.trim())
        if (cells.some(c => c.includes('---'))) return // Skip separator row
        const isHeader = elements.length > 0 && !elements.some(e => e?.toString().includes('table'))
        elements.push(
          <tr key={index} className={isHeader ? 'bg-gray-50' : ''}>
            {cells.map((cell, i) => (
              isHeader ?
                <th key={i} className="px-4 py-2 text-left text-sm font-semibold text-gray-900 border-b">{cell.trim()}</th> :
                <td key={i} className="px-4 py-2 text-sm text-gray-700 border-b">{cell.trim()}</td>
            ))}
          </tr>
        )
      }
      // Empty line
      else if (line.trim() === '') {
        elements.push(<div key={index} className="h-2" />)
      }
      // Regular paragraph
      else {
        elements.push(
          <p key={index} className="text-gray-700 leading-relaxed">
            {renderInlineFormatting(line)}
          </p>
        )
      }
    })

    // Wrap table rows
    const result: React.ReactNode[] = []
    let tableRows: React.ReactNode[] = []

    elements.forEach((el, i) => {
      if (el && typeof el === 'object' && 'type' in el && el.type === 'tr') {
        tableRows.push(el)
      } else {
        if (tableRows.length > 0) {
          result.push(
            <div key={`table-wrapper-${i}`} className="overflow-x-auto my-4">
              <table className="min-w-full border border-gray-200 rounded-lg">
                <tbody>{tableRows}</tbody>
              </table>
            </div>
          )
          tableRows = []
        }
        result.push(el)
      }
    })

    if (tableRows.length > 0) {
      result.push(
        <div key="table-final" className="overflow-x-auto my-4">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <tbody>{tableRows}</tbody>
          </table>
        </div>
      )
    }

    return result
  }

  const renderInlineFormatting = (text: string) => {
    // Bold
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    // Inline code
    text = text.replace(/`(.+?)`/g, '<code class="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-purple-700">$1</code>')

    return <span dangerouslySetInnerHTML={{ __html: text }} />
  }

  return (
    <DashboardLayout
      title={page.title}
      subtitle={`${page.category.charAt(0).toUpperCase() + page.category.slice(1)} Documentation`}
      showChat={false}
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <Link
          href="/dashboard/wiki"
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Wiki
        </Link>
        <span className="text-gray-300">/</span>
        <span className={`px-2 py-0.5 text-xs rounded-full ${
          page.category === 'metric' ? 'bg-blue-100 text-blue-700' :
          page.category === 'process' ? 'bg-green-100 text-green-700' :
          page.category === 'clinical' ? 'bg-purple-100 text-purple-700' :
          'bg-gray-100 text-gray-700'
        }`}>
          {page.category}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white border border-gray-200 rounded-xl p-8">
            {/* Meta */}
            <div className="flex items-center gap-6 text-sm text-gray-500 mb-6 pb-6 border-b">
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {page.authorName}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Updated {formatDistanceToNow(new Date(page.updatedAt), { addSuffix: true })}
              </span>
              {page.publishedAt && (
                <span className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  Published {format(new Date(page.publishedAt), 'MMM d, yyyy')}
                </span>
              )}
            </div>

            {/* Content */}
            <div className="prose max-w-none">
              {renderContent(page.content)}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Actions */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Actions</h4>
            <div className="space-y-2">
              <button
                type="button"
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Edit className="h-4 w-4" />
                Suggest Edit
              </button>
            </div>
          </div>

          {/* Related Pages */}
          {relatedPages.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Related Pages</h4>
              <div className="space-y-2">
                {relatedPages.map((related) => (
                  <Link
                    key={related.id}
                    href={`/dashboard/wiki/${related.slug}`}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <FileText className="h-4 w-4 text-gray-400" />
                    {related.title}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Quick Links */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h4 className="font-semibold text-blue-900 mb-3">Quick Links</h4>
            <div className="space-y-2 text-sm">
              <Link
                href="/dashboard/data-dictionary"
                className="block text-blue-700 hover:text-blue-900 transition-colors"
              >
                Data Dictionary
              </Link>
              <Link
                href="/dashboard/case-studies"
                className="block text-blue-700 hover:text-blue-900 transition-colors"
              >
                Case Studies
              </Link>
              <Link
                href="/dashboard/community"
                className="block text-blue-700 hover:text-blue-900 transition-colors"
              >
                Ask the Community
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
