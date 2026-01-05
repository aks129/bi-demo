export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { getCommunityPosts } from '@/lib/platform-service'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { DashboardCard } from '@/components/dashboard/DashboardCard'
import {
  MessageSquare,
  ThumbsUp,
  MessageCircle,
  Eye,
  Clock,
  Pin,
  HelpCircle,
  Lightbulb,
  Megaphone,
  Users
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

const categories = [
  { key: 'all', name: 'All Posts', icon: MessageSquare },
  { key: 'question', name: 'Questions', icon: HelpCircle },
  { key: 'best-practice', name: 'Best Practices', icon: Lightbulb },
  { key: 'discussion', name: 'Discussions', icon: Users },
  { key: 'announcement', name: 'Announcements', icon: Megaphone },
]

const roleColors: Record<string, string> = {
  'Clinical Pharmacist': 'bg-blue-100 text-blue-700',
  'MTM Program Manager': 'bg-green-100 text-green-700',
  'Quality Coordinator': 'bg-purple-100 text-purple-700',
  'System Admin': 'bg-red-100 text-red-700',
  'Member': 'bg-gray-100 text-gray-700',
}

export default async function CommunityPage() {
  const posts = await getCommunityPosts()

  const pinnedPosts = posts.filter(p => p.isPinned)
  const regularPosts = posts.filter(p => !p.isPinned)

  return (
    <DashboardLayout
      title="Analytics Community"
      subtitle="Share best practices, ask questions, and collaborate with MTM professionals"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-xl p-8 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <MessageSquare className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">MTM Community</h2>
              <p className="text-green-100">Connect with {posts.length > 100 ? '500+' : '200+'} MTM professionals nationwide</p>
            </div>
          </div>
          <Link
            href="/dashboard/community/new"
            className="px-6 py-3 bg-white text-green-700 rounded-lg font-semibold hover:bg-green-50 transition-colors"
          >
            Start Discussion
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Categories */}
          <DashboardCard title="Categories">
            <div className="space-y-1">
              {categories.map((cat) => {
                const count = cat.key === 'all'
                  ? posts.length
                  : posts.filter(p => p.category === cat.key).length
                return (
                  <Link
                    key={cat.key}
                    href={`/dashboard/community?category=${cat.key}`}
                    className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <cat.icon className="h-4 w-4 text-gray-400" />
                      {cat.name}
                    </span>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                      {count}
                    </span>
                  </Link>
                )
              })}
            </div>
          </DashboardCard>

          {/* Popular Tags */}
          <DashboardCard title="Popular Tags">
            <div className="flex flex-wrap gap-2">
              {['CMR', 'adherence', 'Star-Ratings', '2025', 'ROI', 'outreach', 'refusal-rate', 'CMS'].map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs hover:bg-green-100 hover:text-green-700 cursor-pointer transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </DashboardCard>

          {/* Community Stats */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <h4 className="font-semibold text-green-900 mb-3">Community Stats</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-green-700">Active members</span>
                <span className="font-medium text-green-900">542</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Posts this month</span>
                <span className="font-medium text-green-900">87</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Responses today</span>
                <span className="font-medium text-green-900">23</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Pinned Posts */}
          {pinnedPosts.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Pin className="h-4 w-4 text-amber-500" />
                Pinned
              </h3>
              {pinnedPosts.map((post) => (
                <PostCard key={post.id} post={post} isPinned />
              ))}
            </div>
          )}

          {/* Regular Posts */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Recent Discussions</h3>
            {regularPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

interface PostCardProps {
  post: {
    id: string
    title: string
    content: string
    category: string
    authorName: string
    authorRole: string
    tags: string[]
    viewCount: number
    voteCount: number
    commentCount: number
    createdAt: Date
  }
  isPinned?: boolean
}

function PostCard({ post, isPinned }: PostCardProps) {
  const categoryIcon = {
    question: HelpCircle,
    'best-practice': Lightbulb,
    discussion: Users,
    announcement: Megaphone,
  }[post.category] || MessageSquare

  const CategoryIcon = categoryIcon

  return (
    <Link
      href={`/dashboard/community/${post.id}`}
      className={`block bg-white border rounded-xl p-6 hover:border-green-300 hover:shadow-md transition-all ${
        isPinned ? 'border-amber-200 bg-amber-50/50' : 'border-gray-200'
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Category Icon */}
        <div className={`p-2 rounded-lg ${
          post.category === 'question' ? 'bg-blue-100' :
          post.category === 'best-practice' ? 'bg-green-100' :
          post.category === 'announcement' ? 'bg-red-100' :
          'bg-gray-100'
        }`}>
          <CategoryIcon className={`h-5 w-5 ${
            post.category === 'question' ? 'text-blue-600' :
            post.category === 'best-practice' ? 'text-green-600' :
            post.category === 'announcement' ? 'text-red-600' :
            'text-gray-600'
          }`} />
        </div>

        <div className="flex-1 min-w-0">
          {/* Title */}
          <h4 className="font-semibold text-gray-900 text-lg hover:text-green-700 transition-colors">
            {post.title}
          </h4>

          {/* Preview */}
          <p className="text-gray-600 text-sm mt-1 line-clamp-2">
            {post.content.split('\n')[0].slice(0, 200)}...
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mt-3">
            {post.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                {tag}
              </span>
            ))}
          </div>

          {/* Meta */}
          <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <span className={`px-2 py-0.5 rounded-full text-xs ${roleColors[post.authorRole] || 'bg-gray-100 text-gray-700'}`}>
                {post.authorName}
              </span>
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </span>
            <span className="flex items-center gap-1">
              <ThumbsUp className="h-3.5 w-3.5" />
              {post.voteCount}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="h-3.5 w-3.5" />
              {post.commentCount}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {post.viewCount}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
