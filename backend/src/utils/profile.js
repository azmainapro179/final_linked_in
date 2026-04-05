export const parseProfile = (value) => {
  if (!value) {
    return { workHistory: [], education: [], skills: [], interests: [] }
  }
  if (typeof value === 'string') {
    try {
      return JSON.parse(value)
    } catch {
      return { workHistory: [], education: [], skills: [], interests: [] }
    }
  }
  return value
}

export const parseJsonArray = (value) => {
  if (!value) return []
  if (Array.isArray(value)) return value
  try {
    return JSON.parse(value)
  } catch {
    return []
  }
}

export const normalizeText = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')

export const uniqueNormalizedList = (values = []) =>
  [...new Set((Array.isArray(values) ? values : []).map(normalizeText).filter(Boolean))]

export const getProfileCompanies = (profile = {}) =>
  uniqueNormalizedList(profile.workHistory?.map((item) => item?.company))

export const getProfileTitles = (profile = {}) =>
  uniqueNormalizedList(profile.workHistory?.map((item) => item?.title))

export const getProfileSchools = (profile = {}) =>
  uniqueNormalizedList(profile.education?.map((item) => item?.school))

export const getProfileFields = (profile = {}) =>
  uniqueNormalizedList(profile.education?.map((item) => item?.field))

export const getProfileSkills = (profile = {}) =>
  uniqueNormalizedList(profile.skills)

export const getProfileInterests = (profile = {}) =>
  uniqueNormalizedList(profile.interests)

export const getCurrentWorkHistory = (profile = {}) => {
  const workHistory = Array.isArray(profile.workHistory) ? profile.workHistory : []
  const currentItems = workHistory.filter((item) => item?.current || !item?.end)
  return currentItems.length ? currentItems : workHistory.slice(0, 1)
}

export const getCurrentProfileCompanies = (profile = {}) =>
  uniqueNormalizedList(getCurrentWorkHistory(profile).map((item) => item?.company))

export const getOverlap = (left = [], right = []) => {
  const rightSet = new Set(right)
  return left.filter((value) => rightSet.has(value))
}

export const countSharedTitleTokens = (left = [], right = []) => {
  const tokenize = (value) =>
    normalizeText(value)
      .split(/[^a-z0-9]+/)
      .filter((token) => token && token.length > 2)

  const leftTokens = new Set(left.flatMap(tokenize))
  const rightTokens = new Set(right.flatMap(tokenize))
  let shared = 0
  leftTokens.forEach((token) => {
    if (rightTokens.has(token)) shared += 1
  })
  return shared
}
