'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  TrendingUp,
  Users,
  Activity,
  Bell,
  Settings,
  Home,
  BarChart3,
  ExternalLink
} from 'lucide-react'

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Executive Overview', href: '/dashboard/executive', icon: LayoutDashboard },
  { name: 'Client Analytics', href: '/dashboard', icon: TrendingUp },
  { name: 'Adherence Deep Dive', href: '/dashboard/adherence', icon: Activity },
  { name: 'Member Analytics', href: '/dashboard/members', icon: Users },
  { name: 'Insights & Alerts', href: '/dashboard/insights', icon: Bell },
  { name: 'Embedded Analytics', href: '/dashboard/embedded', icon: ExternalLink },
]

const secondaryNavigation = [
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col w-64 bg-gray-900 min-h-screen">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 bg-gray-950">
        <BarChart3 className="h-8 w-8 text-blue-500" />
        <span className="ml-3 text-white font-bold text-lg">ACME Analytics</span>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
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
      </nav>

      {/* Secondary Navigation */}
      <div className="px-4 py-6 border-t border-gray-800">
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
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
              JD
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">Demo User</p>
            <p className="text-xs text-gray-400">analyst@acme.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}
