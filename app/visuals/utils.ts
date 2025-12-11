import visualsData from './visuals.json'

export type VisualMetadata = {
  slug: string
  title: string
  description: string
  createdAt: string
  componentPath: string
  modifiedAt?: string
}

export function getAllVisuals(): VisualMetadata[] {
  return visualsData
}

export function getVisualBySlug(slug: string): VisualMetadata | undefined {
  return visualsData.find((visual) => visual.slug === slug)
}

export function formatDate(date: string, includeRelative = false) {
  let currentDate = new Date()
  if (!date.includes('T')) {
    date = `${date}T00:00:00`
  }
  let targetDate = new Date(date)

  let yearsAgo = currentDate.getFullYear() - targetDate.getFullYear()
  let monthsAgo = currentDate.getMonth() - targetDate.getMonth()
  let daysAgo = currentDate.getDate() - targetDate.getDate()

  let formattedDate = ''

  if (yearsAgo > 0) {
    formattedDate = `${yearsAgo}y ago`
  } else if (monthsAgo > 0) {
    formattedDate = `${monthsAgo}mo ago`
  } else if (daysAgo > 0) {
    formattedDate = `${daysAgo}d ago`
  } else {
    formattedDate = 'Today'
  }

  let fullDate = `${targetDate.getFullYear()} ${targetDate.toLocaleString('en-us', {
    month: 'long',
  })} ${targetDate.getDate()}`

  if (!includeRelative) {
    return fullDate
  }

  return `${fullDate} (${formattedDate})`
}
