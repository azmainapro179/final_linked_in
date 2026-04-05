import {
  getCurrentWorkHistory,
  getOverlap,
  getProfileInterests,
  getProfileSkills,
  normalizeText,
  parseJsonArray,
  parseProfile,
  uniqueNormalizedList,
} from '../utils/profile.js'

export const buildCompanyFollowSuggestions = ({
  currentProfile,
  currentConnections,
  followedCompanies,
  allCompaniesRows,
  allUsersRows,
}) => {
  const followedCompanyIds = new Set(followedCompanies.map((company) => company.id))
  const allCompanies = allCompaniesRows.map((company) => ({
    ...company,
    specialties: company.specialties
      ? (typeof company.specialties === 'string' ? JSON.parse(company.specialties) : company.specialties)
      : [],
  }))
  const companyByNormalizedName = new Map(
    allCompanies.map((company) => [normalizeText(company.name), company]),
  )

  const followedIndustries = uniqueNormalizedList(followedCompanies.map((company) => company.industry))
  const followedSpecialties = uniqueNormalizedList(
    followedCompanies.flatMap((company) => company.specialties || []),
  )
  const userSkillsAndInterests = uniqueNormalizedList([
    ...getProfileSkills(currentProfile),
    ...getProfileInterests(currentProfile),
  ])

  const relationWeights = new Map()
  parseJsonArray(currentConnections.connected).forEach((id) => relationWeights.set(id, 28))
  parseJsonArray(currentConnections.invited).forEach((id) =>
    relationWeights.set(id, Math.max(relationWeights.get(id) || 0, 18)),
  )
  parseJsonArray(currentConnections.pending).forEach((id) =>
    relationWeights.set(id, Math.max(relationWeights.get(id) || 0, 14)),
  )

  const networkCompanySignals = new Map()
  const addCompanySignal = (companyName, weight, userName, label) => {
    const company = companyByNormalizedName.get(normalizeText(companyName))
    if (!company || followedCompanyIds.has(company.id)) return
    const current = networkCompanySignals.get(company.id) || { score: 0, reasons: [] }
    current.score += weight
    current.reasons.push(`${userName} ${label} ${company.name}`)
    networkCompanySignals.set(company.id, current)
  }

  allUsersRows.forEach((user) => {
    const relationWeight = relationWeights.get(user.id)
    if (!relationWeight) return
    const profile = parseProfile(user.profile)
    getCurrentWorkHistory(profile).forEach((workItem) => {
      addCompanySignal(workItem?.company, relationWeight, user.fullName, 'is associated with')
    })
    ;(Array.isArray(profile.workHistory) ? profile.workHistory : []).forEach((workItem) => {
      if (workItem?.current || !workItem?.company) return
      addCompanySignal(workItem.company, Math.max(8, relationWeight - 10), user.fullName, 'previously worked at')
    })
  })

  return allCompanies
    .filter((company) => !followedCompanyIds.has(company.id))
    .map((company) => {
      const specialties = uniqueNormalizedList(company.specialties)
      const industry = normalizeText(company.industry)
      const followedIndustryMatch = followedIndustries.includes(industry)
      const specialtyMatches = getOverlap(followedSpecialties, specialties)
      const userFitMatches = getOverlap(userSkillsAndInterests, specialties)
      const networkSignal = networkCompanySignals.get(company.id)

      let score = 0
      const reasons = []

      if (networkSignal) {
        score += networkSignal.score
        reasons.push(...networkSignal.reasons.slice(0, 2))
      }

      if (followedIndustryMatch) {
        score += 18
        reasons.push('Same industry as companies you follow')
      }

      if (specialtyMatches.length) {
        score += Math.min(specialtyMatches.length, 3) * 8
        reasons.push(
          specialtyMatches.length === 1
            ? `Similar specialty: ${specialtyMatches[0]}`
            : `${specialtyMatches.length} specialties overlap with your follows`,
        )
      }

      if (userFitMatches.length) {
        score += Math.min(userFitMatches.length, 3) * 6
        reasons.push(
          userFitMatches.length === 1
            ? `Matches your interests: ${userFitMatches[0]}`
            : `Matches ${userFitMatches.length} of your skills/interests`,
        )
      }

      if (!score) {
        return null
      }

      return {
        ...company,
        score,
        reasons: [...new Set(reasons)].slice(0, 3),
      }
    })
    .filter(Boolean)
    .sort((left, right) => right.score - left.score || left.name.localeCompare(right.name))
    .slice(0, 8)
}
