import {
  countSharedTitleTokens,
  getCurrentProfileCompanies,
  getOverlap,
  getProfileCompanies,
  getProfileFields,
  getProfileSchools,
  getProfileSkills,
  getProfileTitles,
  normalizeText,
  parseJsonArray,
  parseProfile,
  uniqueNormalizedList,
} from '../utils/profile.js'

export const buildNetworkSuggestions = ({
  userId,
  currentProfile,
  currentConnections,
  followRows,
  allUsersRows,
  allConnectionRows,
}) => {
  const pendingIds = new Set(parseJsonArray(currentConnections.pending))
  const connectedIds = new Set(parseJsonArray(currentConnections.connected))
  const invitedIds = new Set(parseJsonArray(currentConnections.invited))

  const connectionsByUserId = new Map(
    allConnectionRows.map((row) => [
      row.id,
      {
        pending: parseJsonArray(row.pending),
        connected: parseJsonArray(row.connected),
        invited: parseJsonArray(row.invited),
      },
    ]),
  )

  const currentCompanies = getProfileCompanies(currentProfile)
  const currentTitles = getProfileTitles(currentProfile)
  const currentSchools = getProfileSchools(currentProfile)
  const currentFields = getProfileFields(currentProfile)
  const currentSkills = getProfileSkills(currentProfile)
  const followedCompanyNames = uniqueNormalizedList(followRows.map((row) => row.name))
  const followedCompanyLabelByNormalized = new Map(
    followRows.map((row) => [normalizeText(row.name), row.name]),
  )

  return allUsersRows
    .filter((candidate) => candidate.id !== userId)
    .map((candidate) => {
      const candidateProfile = parseProfile(candidate.profile)
      const candidateConnections = connectionsByUserId.get(candidate.id) || {
        pending: [],
        connected: [],
        invited: [],
      }

      if (
        connectedIds.has(candidate.id) ||
        pendingIds.has(candidate.id) ||
        invitedIds.has(candidate.id) ||
        candidateConnections.pending.includes(userId) ||
        candidateConnections.invited.includes(userId) ||
        candidateConnections.connected.includes(userId)
      ) {
        return null
      }

      const candidateCompanies = getProfileCompanies(candidateProfile)
      const candidateCurrentCompanies = getCurrentProfileCompanies(candidateProfile)
      const candidateTitles = getProfileTitles(candidateProfile)
      const candidateSchools = getProfileSchools(candidateProfile)
      const candidateFields = getProfileFields(candidateProfile)
      const candidateSkills = getProfileSkills(candidateProfile)
      const mutualConnectionIds = candidateConnections.connected.filter((id) => connectedIds.has(id))
      const sharedCompanies = getOverlap(currentCompanies, candidateCompanies)
      const sharedSchools = getOverlap(currentSchools, candidateSchools)
      const sharedFields = getOverlap(currentFields, candidateFields)
      const sharedSkills = getOverlap(currentSkills, candidateSkills)
      const sharedTitleTokens = countSharedTitleTokens(currentTitles, candidateTitles)
      const followedCompanyMatches = getOverlap(
        followedCompanyNames,
        candidateCurrentCompanies.length ? candidateCurrentCompanies : candidateCompanies,
      )

      let score = 0
      const reasons = []

      if (mutualConnectionIds.length) {
        score += 35 + mutualConnectionIds.length * 10
        reasons.push(
          mutualConnectionIds.length === 1
            ? '1 mutual connection'
            : `${mutualConnectionIds.length} mutual connections`,
        )
      }

      if (sharedCompanies.length) {
        score += 24 + Math.min(sharedCompanies.length - 1, 2) * 6
        reasons.push(`Worked at ${sharedCompanies[0]}`)
      }

      if (sharedSchools.length) {
        score += 20 + Math.min(sharedSchools.length - 1, 1) * 5
        reasons.push(`Studied at ${sharedSchools[0]}`)
      }

      if (sharedSkills.length) {
        score += Math.min(sharedSkills.length, 4) * 7
        reasons.push(
          sharedSkills.length === 1
            ? `Shared skill: ${sharedSkills[0]}`
            : `${sharedSkills.length} shared skills`,
        )
      }

      if (sharedFields.length) {
        score += Math.min(sharedFields.length, 2) * 5
        reasons.push(`Similar field: ${sharedFields[0]}`)
      }

      if (sharedTitleTokens > 0) {
        score += Math.min(sharedTitleTokens, 3) * 6
        reasons.push('Similar job background')
      }

      if (followedCompanyMatches.length) {
        score += 18 + Math.min(followedCompanyMatches.length, 2) * 7
        const matchedCompany =
          followedCompanyLabelByNormalized.get(followedCompanyMatches[0]) ||
          followedCompanyMatches[0]
        reasons.push(`Associated with ${matchedCompany} you follow`)
      }

      if (!score) {
        return null
      }

      return {
        id: candidate.id,
        fullName: candidate.fullName,
        headline: candidate.headline,
        email: candidate.email,
        profile: candidateProfile,
        score,
        mutualConnectionCount: mutualConnectionIds.length,
        sharedSkills: sharedSkills.slice(0, 3),
        sharedCompanies: sharedCompanies.slice(0, 2),
        sharedSchools: sharedSchools.slice(0, 2),
        reasons: [...new Set(reasons)].slice(0, 3),
      }
    })
    .filter(Boolean)
    .sort((left, right) => right.score - left.score || left.fullName.localeCompare(right.fullName))
    .slice(0, 8)
}
