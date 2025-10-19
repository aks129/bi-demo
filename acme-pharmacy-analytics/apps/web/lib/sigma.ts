import jwt from 'jsonwebtoken'

/**
 * Sigma Computing API Integration
 *
 * This module provides utilities for working with Sigma's Embed API
 * using JWT-signed URLs for secure embedding.
 */

export interface SigmaEmbedConfig {
  workbookUrl: string
  userEmail?: string
  userAttributes?: Record<string, any>
  externalUserId?: string
  accountType?: 'viewer' | 'creator' | 'admin'
  teamIds?: string[]
}

/**
 * Generate a JWT-signed Sigma embed URL
 *
 * @param config - Configuration for the embed
 * @returns Signed embed URL ready for iframe
 */
export function generateSigmaEmbedUrl(config: SigmaEmbedConfig): string {
  const {
    workbookUrl,
    userEmail = 'demo@acme.com',
    userAttributes = {},
    externalUserId = 'demo-user',
    accountType = 'viewer',
    teamIds = []
  } = config

  const clientId = process.env.SIGMA_CLIENT_ID
  const secret = process.env.SIGMA_CLIENT_SECRET

  if (!clientId || !secret) {
    throw new Error('Sigma credentials not configured. Set SIGMA_CLIENT_ID and SIGMA_CLIENT_SECRET environment variables.')
  }

  // JWT payload following Sigma's specification
  const payload = {
    sub: externalUserId,  // External user ID
    email: userEmail,
    account_type: accountType,
    teams: teamIds,
    ...userAttributes,  // Custom user attributes for row-level security
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600  // 1 hour expiration
  }

  // Sign the JWT with the client secret (ensure secret is a string)
  const token = jwt.sign(payload, secret as string, {
    algorithm: 'HS256',
    keyid: clientId
  })

  // Append the JWT as a query parameter to the workbook URL
  const separator = workbookUrl.includes('?') ? '&' : '?'
  return `${workbookUrl}${separator}:jwt=${token}`
}

/**
 * Validate Sigma API credentials
 */
export function validateSigmaCredentials(): { valid: boolean; error?: string } {
  const clientId = process.env.SIGMA_CLIENT_ID
  const secret = process.env.SIGMA_CLIENT_SECRET

  if (!clientId) {
    return { valid: false, error: 'SIGMA_CLIENT_ID not configured' }
  }

  if (!secret) {
    return { valid: false, error: 'SIGMA_CLIENT_SECRET not configured' }
  }

  return { valid: true }
}

/**
 * Example Sigma workbook URLs
 * These are placeholder URLs - replace with your actual Sigma workbook URLs
 */
export const DEMO_WORKBOOKS = {
  adherence: 'https://app.sigmacomputing.com/embed/1-xxxxx',
  executive: 'https://app.sigmacomputing.com/embed/1-xxxxx',
  memberAnalytics: 'https://app.sigmacomputing.com/embed/1-xxxxx'
}
