'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  TrendingUp,
  Users,
  Activity,
  Bell,
  Settings,
  Home,
  BarChart3,
  ExternalLink,
  ClipboardList,
  DollarSign,
  Shield,
  Target,
  MessageSquare,
  BookOpen,
  Database,
  FileText,
  Wand2,
  Rss,
  LogOut
} from 'lucide-react'

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Executive Overview', href: '/dashboard/executive', icon: LayoutDashboard },
  { name: 'Client Analytics', href: '/dashboard', icon: TrendingUp },
  { name: 'Adherence Deep Dive', href: '/dashboard/adherence', icon: Activity },
  { name: 'Member Analytics', href: '/dashboard/members', icon: Users },
  { name: 'Insights & Alerts', href: '/dashboard/insights', icon: Bell },
]

const mtmNavigation = [
  { name: 'MTM Performance', href: '/dashboard/mtm', icon: Target },
  { name: 'Financial ROI', href: '/dashboard/roi', icon: DollarSign },
  { name: '2025 Eligibility', href: '/dashboard/eligibility', icon: Shield },
  { name: 'Work Queue', href: '/dashboard/work-queue', icon: ClipboardList },
]

const platformNavigation = [
  { name: 'Community', href: '/dashboard/community', icon: MessageSquare },
  { name: 'Wiki', href: '/dashboard/wiki', icon: BookOpen },
  { name: 'Data Dictionary', href: '/dashboard/data-dictionary', icon: Database },
  { name: 'Case Studies', href: '/dashboard/case-studies', icon: FileText },
  { name: 'Benchmarking', href: '/dashboard/benchmarking', icon: BarChart3 },
  { name: 'Report Builder', href: '/dashboard/report-builder', icon: Wand2 },
  { name: 'Activity Feed', href: '/dashboard/feed', icon: Rss },
]

const secondaryNavigation = [
  { name: 'Embedded Analytics', href: '/dashboard/embedded', icon: ExternalLink },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="flex flex-col w-64 bg-gray-900 min-h-screen">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 bg-gray-950">
        <BarChart3 className="h-8 w-8 text-blue-500" />
        <span className="ml-3 text-white font-bold text-lg">ACME Analytics</span>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Analytics</p>
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                ${isActive
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }
              `}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.name}
            </Link>
          )
        })}

        {/* MTM Section */}
        <div className="pt-4">
          <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">MTM Program</p>
          {mtmNavigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                  ${isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }
                `}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
                {item.name === '2025 Eligibility' && (
                  <span className="ml-auto px-1.5 py-0.5 text-xs bg-amber-500 text-amber-950 rounded font-semibold">NEW</span>
                )}
              </Link>
            )
          })}
        </div>

        {/* Platform Section */}
        <div className="pt-4">
          <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Platform</p>
          {platformNavigation.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                  ${isActive
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }
                `}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
                {item.name === 'Community' && (
                  <span className="ml-auto px-1.5 py-0.5 text-xs bg-green-500 text-green-950 rounded font-semibold">NEW</span>
                )}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Secondary Navigation */}
      <div className="px-4 py-4 border-t border-gray-800">
        {secondaryNavigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                ${isActive
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }
              `}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.name}
            </Link>
          )
        })}
      </div>

      {/* User Info */}
      <div className="px-4 py-4 bg-gray-950">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                SK
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">Dr. Sarah Kim</p>
              <p className="text-xs text-gray-400">pharmacist@acme.com</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
