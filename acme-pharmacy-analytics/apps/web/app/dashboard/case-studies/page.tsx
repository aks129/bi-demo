export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { getCaseStudies } from '@/lib/platform-service'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { DashboardCard } from '@/components/dashboard/DashboardCard'
import { KPICard } from '@/components/dashboard/KPICard'
import {
  FileText,
  Star,
  TrendingUp,
  Award,
  Building2,
  Calendar,
  User,
  ArrowRight
} from 'lucide-react'
import { format } from 'date-fns'

const industries = [
  { key: 'all', name: 'All Industries' },
  { key: 'medicare', name: 'Medicare' },
  { key: 'medicaid', name: 'Medicaid' },
  { key: 'commercial', name: 'Commercial' },
  { key: 'specialty', name: 'Specialty' },
]

export default async function CaseStudiesPage() {
  const caseStudies = await getCaseStudies()
  const featuredStudies = caseStudies.filter(s => s.featured)

  return (
    <DashboardLayout
      title="Case Studies & Success Stories"
      subtitle="Real-world examples of MTM program success and ROI"
    >
      {/* Hero */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-8 mb-8 text-white">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-lg">
            <Award className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Success Stories Library</h2>
            <p className="text-amber-100">Learn from {caseStudies.length} documented case studies across our client base</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Case Studies"
          value={caseStudies.length}
          subtitle="Documented success stories"
          status="neutral"
          icon={<FileText className="h-10 w-10" />}
        />
        <KPICard
          title="Featured"
          value={featuredStudies.length}
          subtitle="Top performing cases"
          status="healthy"
          icon={<Star className="h-10 w-10" />}
        />
        <KPICard
          title="Avg ROI Improvement"
          value="+85%"
          subtitle="Across all case studies"
          status="healthy"
          icon={<TrendingUp className="h-10 w-10" />}
        />
        <KPICard
          title="Total Savings"
          value="$14.2M"
          subtitle="Combined cost avoidance"
          status="healthy"
          icon={<Award className="h-10 w-10" />}
        />
      </div>

      {/* Featured Case Studies */}
      {featuredStudies.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-500" />
            Featured Case Studies
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {featuredStudies.map((study) => (
              <CaseStudyCard key={study.id} study={study} featured />
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {industries.map((ind) => (
          <button
            key={ind.key}
            type="button"
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 whitespace-nowrap"
          >
            {ind.name}
          </button>
        ))}
      </div>

      {/* All Case Studies */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {caseStudies.filter(s => !s.featured).map((study) => (
          <CaseStudyCard key={study.id} study={study} />
        ))}
      </div>
    </DashboardLayout>
  )
}

interface CaseStudyCardProps {
  study: {
    id: string
    title: string
    summary: string
    industry: string
    outcomes: Array<{ metric: string; before: string; after: string; improvement: string }>
    tags: string[]
    authorName: string
    publishedAt: Date | null
    featured: boolean
  }
  featured?: boolean
}

function CaseStudyCard({ study, featured }: CaseStudyCardProps) {
  const industryColors: Record<string, string> = {
    medicare: 'bg-blue-100 text-blue-700',
    medicaid: 'bg-green-100 text-green-700',
    commercial: 'bg-purple-100 text-purple-700',
    specialty: 'bg-amber-100 text-amber-700',
  }

  return (
    <Link
      href={`/dashboard/case-studies/${study.id}`}
      className={`block bg-white border rounded-xl overflow-hidden hover:shadow-lg transition-all ${
        featured ? 'border-amber-200' : 'border-gray-200'
      }`}
    >
      {/* Header */}
      <div className={`p-6 ${featured ? 'bg-gradient-to-r from-amber-50 to-orange-50' : ''}`}>
        <div className="flex items-start justify-between mb-3">
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${industryColors[study.industry] || 'bg-gray-100 text-gray-700'}`}>
            {study.industry.charAt(0).toUpperCase() + study.industry.slice(1)}
          </span>
          {featured && (
            <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
          )}
        </div>
        <h4 className="font-semibold text-gray-900 text-lg mb-2">{study.title}</h4>
        <p className="text-gray-600 text-sm line-clamp-2">{study.summary}</p>
      </div>

      {/* Outcomes Preview */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Key Outcomes</p>
        <div className="grid grid-cols-2 gap-3">
          {study.outcomes.slice(0, 2).map((outcome, i) => (
            <div key={i} className="text-center">
              <p className="text-lg font-bold text-green-600">{outcome.improvement}</p>
              <p className="text-xs text-gray-500">{outcome.metric}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {study.authorName}
          </span>
          {study.publishedAt && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {format(new Date(study.publishedAt), 'MMM yyyy')}
            </span>
          )}
        </div>
        <span className="text-green-600 flex items-center gap-1 text-sm font-medium">
          Read More <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}
