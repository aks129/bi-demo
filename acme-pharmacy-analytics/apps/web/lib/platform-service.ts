// Platform service for Community, Wiki, Case Studies, Benchmarking, Reports, and Feed
// Using mock data for the MVP demo - Prisma integration can be added when database is ready

import {
  mockCommunityPosts,
  mockCommunityComments,
  mockWikiPages,
  mockDictionaryEntries,
  mockCaseStudies,
  mockBenchmarkMetrics,
  mockCustomReports,
  mockActivityItems,
  type MockCommunityPost,
  type MockCommunityComment,
  type MockWikiPage,
  type MockDictionaryEntry,
  type MockCaseStudy,
  type MockBenchmarkMetric,
  type MockCustomReport,
  type MockActivityItem,
} from './platform-mock-data'

// ============== COMMUNITY ==============
export async function getCommunityPosts(category?: string): Promise<MockCommunityPost[]> {
  let posts = [...mockCommunityPosts]
  if (category && category !== 'all') {
    posts = posts.filter(p => p.category === category)
  }
  return posts.sort((a, b) => {
    if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1
    return b.createdAt.getTime() - a.createdAt.getTime()
  })
}

export async function getCommunityPost(postId: string): Promise<MockCommunityPost | null> {
  return mockCommunityPosts.find(p => p.id === postId) || null
}

export async function getPostComments(postId: string): Promise<MockCommunityComment[]> {
  return mockCommunityComments.filter(c => c.postId === postId)
}

// ============== WIKI ==============
export async function getWikiPages(category?: string): Promise<MockWikiPage[]> {
  let pages = mockWikiPages.filter(p => p.publishedAt !== null)
  if (category && category !== 'all') {
    pages = pages.filter(p => p.category === category)
  }
  return pages.sort((a, b) => a.title.localeCompare(b.title))
}

export async function getWikiPage(slug: string): Promise<MockWikiPage | null> {
  return mockWikiPages.find(p => p.slug === slug) || null
}

// ============== DATA DICTIONARY ==============
export async function getDictionaryEntries(category?: string, search?: string): Promise<MockDictionaryEntry[]> {
  let entries = [...mockDictionaryEntries]
  if (category && category !== 'all') {
    entries = entries.filter(e => e.category === category)
  }
  if (search) {
    const searchLower = search.toLowerCase()
    entries = entries.filter(e =>
      e.term.toLowerCase().includes(searchLower) ||
      e.definition.toLowerCase().includes(searchLower)
    )
  }
  return entries.sort((a, b) => a.term.localeCompare(b.term))
}

// ============== CASE STUDIES ==============
export async function getCaseStudies(industry?: string, featured?: boolean): Promise<MockCaseStudy[]> {
  let studies = mockCaseStudies.filter(s => s.publishedAt !== null)
  if (industry && industry !== 'all') {
    studies = studies.filter(s => s.industry === industry)
  }
  if (featured !== undefined) {
    studies = studies.filter(s => s.featured === featured)
  }
  return studies.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1
    return (b.publishedAt?.getTime() || 0) - (a.publishedAt?.getTime() || 0)
  })
}

export async function getCaseStudy(id: string): Promise<MockCaseStudy | null> {
  return mockCaseStudies.find(s => s.id === id) || null
}

// ============== BENCHMARKING ==============
export async function getBenchmarkMetrics(): Promise<MockBenchmarkMetric[]> {
  return mockBenchmarkMetrics
}

// ============== CUSTOM REPORTS ==============
export async function getCustomReports(): Promise<MockCustomReport[]> {
  return mockCustomReports
}

export async function getCustomReport(id: string): Promise<MockCustomReport | null> {
  return mockCustomReports.find(r => r.id === id) || null
}

// ============== ACTIVITY FEED ==============
export async function getActivityFeed(limit: number = 20): Promise<MockActivityItem[]> {
  return mockActivityItems.slice(0, limit)
}

export async function logActivity(data: {
  userId: string
  userName: string
  action: string
  entityType: string
  entityId: string
  entityTitle?: string
  metadata?: Record<string, unknown>
}): Promise<void> {
  // In production, this would write to the database
  // For MVP demo, we just log to console
  console.log('Activity logged:', data)
}
