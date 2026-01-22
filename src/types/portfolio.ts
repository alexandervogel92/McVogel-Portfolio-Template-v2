export type Locale = 'de' | 'en'
export type SkillFocus = 'skills' | 'tools' | 'process'
export type CategoryId = 'all' | 'personal' | 'client' | 'learning'

export interface AccentOption {
  id: string
  hex: string
  label: Record<Locale, string>
}

export interface ExpertiseGroup {
  title: string
  entries: string[]
}

export interface ExpertiseTab {
  label: string
  copy: string
  groups: ExpertiseGroup[]
}

export interface HighlightMetric {
  label: string
  value: string
}

export interface HighlightSlide {
  id: string
  label: string
  headline: string
  description: string
  focusLabel: string
  points: string[]
  icon: string
  accent: {
    from: string
    to: string
  }
  metrics?: HighlightMetric[]
}

export interface ProjectItem {
  name: string
  year: string
  description: string
  impact: string
  stack: string[]
  categories: CategoryId[]
  link?: string
  linkLabel?: string
  inactive?: boolean
  inactiveLabel?: string
}

export interface ResumeEntry {
  title: string
  company: string
  location: string
  period: string
  description: string
  highlights: string[]
}

export interface ResumeContent {
  heading: string
  subtitle: string
  timelineLabel: string
  timeline: ResumeEntry[]
  dailyLabel: string
  dailyHeadline: string
  dailyCopy: string
  dailyHighlights: string[]
  dailyStackLabel: string
  dailyStack: string[]
}

export interface LocaleContent {
  nav: Array<{ label: string, target: string }>
  hero: {
    badge: string
    location: string
    title: string
    subtitle: string
    ctaPrimary: string
    ctaPrimaryLink: string
    ctaSecondary: string
    ctaSecondaryLink: string
    availability: string
    status: string
  }
  highlightsHeading: string
  highlights: HighlightSlide[]
  expertise: {
    heading: string
    description: string
    tabs: Record<SkillFocus, ExpertiseTab>
  }
  projects: {
    heading: string
    description: string
    filterLabel: string
    categories: Array<{ id: CategoryId, label: string }>
    empty: string
    linkLabelFallback: string
    items: ProjectItem[]
  }
  settings: {
    heading: string
    themeLabel: string
    languageLabel: string
    accentLabel: string
    accentHint: string
  }
  resume: ResumeContent
  contact: {
    heading: string
    copy: string
  }
}
