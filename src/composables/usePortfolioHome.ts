import type { CategoryId, ExpertiseTab, ProjectItem, SkillFocus } from '@/types/portfolio'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { usePortfolioShell } from '@/composables/usePortfolioShell'

interface HeroMetric {
  value: string
  label: string
  detail?: string
  action: 'experience' | 'projects' | 'stack'
}

export function usePortfolioHome () {
  const shell = usePortfolioShell()

  const experienceStart = new Date('2022-01-01T00:00:00Z')
  const apprenticeshipDurationYears = 2
  const typingSpeed = 55
  const bodyBlurClass = 'modal-blur-active'

  const selectedCategory = ref<CategoryId>('all')
  const skillFocus = ref<SkillFocus>('skills')
  const activeSection = ref<string>('')
  const stackDialog = ref(false)
  const showMobileHeader = ref(true)
  const isMobileViewport = ref(false)
  const lastScrollY = ref(0)
  const scrollAccumulator = ref(0)
  const lastScrollDirection = ref<'up' | 'down'>('up')
  const typedTitle = ref('')
  const typingTimeout = ref<number | null>(null)

  let scrollRafId: number | null = null
  let resizeRafId: number | null = null

  const current = shell.current
  const sectionTargets = computed(() => current.value.nav.map(item => item.target))
  const tabEntries = computed(() =>
    Object.entries(current.value.expertise.tabs) as Array<[SkillFocus, ExpertiseTab]>,
  )
  const focusContent = computed(() => current.value.expertise.tabs[skillFocus.value])
  const categoryOptions = computed(() => current.value.projects.categories)
  const filteredProjects = computed<ProjectItem[]>(() => {
    if (selectedCategory.value === 'all') {
      return current.value.projects.items
    }
    return current.value.projects.items.filter(project =>
      project.categories.includes(selectedCategory.value),
    )
  })
  const heroMetrics = computed<HeroMetric[]>(() => {
    const now = new Date()
    const totalYearsRaw = Math.max(0, (now.getTime() - experienceStart.getTime()) / (1000 * 60 * 60 * 24 * 365.25))
    const apprenticeshipYears = Math.min(totalYearsRaw, apprenticeshipDurationYears)
    const developerYears = Math.max(totalYearsRaw - apprenticeshipYears, 0)

    const formatYears = (value: number) => Number(value.toFixed(1))
    const formatNumber = (value: number) =>
      new Intl.NumberFormat(shell.locale.value === 'de' ? 'de-DE' : 'en-US', { maximumFractionDigits: 1 })
        .format(formatYears(value))

    const totalYears = formatNumber(totalYearsRaw)
    const apprenticeshipYearsText = formatNumber(apprenticeshipYears)
    const developerYearsText = formatNumber(developerYears)
    const linkedProjects = current.value.projects.items.filter(project => typeof project.link === 'string' && project.link.length > 0).length
    const dailyToolCount = current.value.resume.dailyStack.length

    if (shell.locale.value === 'de') {
      return [
        {
          value: `${totalYears}+`,
          label: 'Jahre Erfahrung gesamt',
          detail: `${apprenticeshipYearsText} Jahre Ausbildung · ${developerYearsText} Jahre Softwareentwicklung`,
          action: 'experience',
        },
        {
          value: `${linkedProjects}`,
          label: 'Projekte mit Link',
          detail: 'Ausgewählte Projekte mit weiterführenden Details',
          action: 'projects',
        },
        {
          value: `${dailyToolCount}`,
          label: 'Tools im täglichen Einsatz',
          detail: 'Frameworks, Plattformen und Automationen im aktuellen Stack',
          action: 'stack',
        },
      ]
    }

    return [
      {
        value: `${totalYears}+`,
        label: 'Years of experience',
        detail: `${apprenticeshipYearsText} yrs apprenticeship · ${developerYearsText} yrs software development`,
        action: 'experience',
      },
      {
        value: `${linkedProjects}`,
        label: 'Projects with links',
        detail: 'Selected work with supporting details',
        action: 'projects',
      },
      {
        value: `${dailyToolCount}`,
        label: 'Tools in daily use',
        detail: 'Frameworks, platforms, and automations across my stack',
        action: 'stack',
      },
    ]
  })

  const techSectionBase = [
    {
      key: 'frontend',
      icon: 'mdi-monitor-dashboard',
      title: { de: 'Frontend', en: 'Frontend' },
      items: ['Vue.js', 'Vuetify', 'Naive UI', 'JavaScript', 'TypeScript'],
    },
    {
      key: 'backend',
      icon: 'mdi-server',
      title: { de: 'Backend', en: 'Backend' },
      items: ['PHP', 'Python', 'Node.js', 'Express.js', 'C#', 'RESTful APIs'],
    },
    {
      key: 'databases',
      icon: 'mdi-database-cog',
      title: { de: 'Datenbanken', en: 'Databases' },
      items: ['MySQL', 'PostgreSQL', 'Firebase'],
    },
    {
      key: 'devops',
      icon: 'mdi-cog-outline',
      title: { de: 'DevOps & Tools', en: 'DevOps & Tools' },
      items: ['Docker', 'CI/CD', 'Git', 'Automation'],
    },
  ] as const

  const techStackSections = computed(() =>
    techSectionBase.map(section => ({
      key: section.key,
      icon: section.icon,
      title: section.title[shell.locale.value],
      items: section.items,
    })),
  )
  const techDialogTitle = computed(() =>
    shell.locale.value === 'de' ? 'Technologien, mit denen ich arbeite' : 'Technologies I work with',
  )
  const techDialogSubtitle = computed(() =>
    shell.locale.value === 'de'
      ? 'Ein Werkzeugkasten für skalierbare Produkte und automatisierte Abläufe.'
      : 'A toolkit built for scalable products and automated delivery.',
  )

  const scrollToSection = (selector: string) => {
    if (typeof document === 'undefined') {
      return
    }
    const element = document.querySelector(selector)
    if (!element) {
      return
    }
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleMetricAction = (action: HeroMetric['action']) => {
    switch (action) {
      case 'experience': {
        scrollToSection('#resume')
        break
      }
      case 'projects': {
        scrollToSection('#projects')
        break
      }
      case 'stack': {
        stackDialog.value = true
        break
      }
      default: {
        break
      }
    }
  }

  const updateActiveSection = () => {
    if (typeof window === 'undefined') {
      return
    }
    const viewportCenter = window.scrollY + window.innerHeight / 2
    let currentId = sectionTargets.value[0] ?? ''
    for (const target of sectionTargets.value) {
      const element = document.querySelector(target) as HTMLElement | null
      if (!element) {
        continue
      }
      if (element.offsetTop <= viewportCenter) {
        currentId = target
      }
    }
    const pageBottom = window.scrollY + window.innerHeight
    const maxScroll = Math.ceil(document.documentElement.scrollHeight)
    if (Math.ceil(pageBottom) >= maxScroll - 2) {
      const lastIndex = sectionTargets.value.length - 1
      if (lastIndex >= 0) {
        const lastTarget = sectionTargets.value[lastIndex]
        currentId = lastTarget ?? currentId
      }
    }
    activeSection.value = currentId
  }

  const updateViewportMatch = () => {
    if (typeof window === 'undefined') {
      return
    }
    isMobileViewport.value = window.matchMedia('(max-width: 960px)').matches
  }

  const syncAppBarHeight = () => {
    if (typeof document === 'undefined') {
      return
    }
    const appBar = document.querySelector('.portfolio-app-bar') as HTMLElement | null
    if (!appBar) {
      return
    }
    const height = Math.round(appBar.getBoundingClientRect().height)
    if (height > 0) {
      appBar.style.setProperty('--app-bar-height', `${height}px`)
    }
  }

  const updateMobileHeaderVisibility = () => {
    if (typeof window === 'undefined') {
      return
    }
    if (!isMobileViewport.value) {
      showMobileHeader.value = true
      lastScrollY.value = window.scrollY
      scrollAccumulator.value = 0
      lastScrollDirection.value = 'up'
      return
    }
    const currentScroll = Math.max(window.scrollY, 0)
    const delta = currentScroll - lastScrollY.value
    const nearTop = currentScroll < 64
    const direction: 'up' | 'down' = delta >= 0 ? 'down' : 'up'
    const hideThreshold = 60
    const showThreshold = -40

    if (nearTop) {
      showMobileHeader.value = true
      scrollAccumulator.value = 0
      lastScrollDirection.value = 'up'
      lastScrollY.value = currentScroll
      return
    }

    if (direction === lastScrollDirection.value) {
      scrollAccumulator.value += delta
    } else {
      scrollAccumulator.value = delta
    }
    lastScrollDirection.value = direction

    if (scrollAccumulator.value > hideThreshold) {
      showMobileHeader.value = false
      scrollAccumulator.value = 0
    } else if (scrollAccumulator.value < showThreshold) {
      showMobileHeader.value = true
      scrollAccumulator.value = 0
    }

    lastScrollY.value = currentScroll
  }

  const handleScroll = () => {
    if (typeof window === 'undefined') {
      return
    }
    updateMobileHeaderVisibility()
    if (scrollRafId !== null) {
      return
    }
    scrollRafId = window.requestAnimationFrame(() => {
      updateActiveSection()
      scrollRafId = null
    })
  }

  const handleResize = () => {
    if (typeof window === 'undefined') {
      return
    }
    if (resizeRafId !== null) {
      return
    }
    resizeRafId = window.requestAnimationFrame(() => {
      updateViewportMatch()
      syncAppBarHeight()
      updateActiveSection()
      updateMobileHeaderVisibility()
      resizeRafId = null
    })
  }

  const clearTypingTimeout = () => {
    if (typingTimeout.value !== null && typeof window !== 'undefined') {
      window.clearTimeout(typingTimeout.value)
      typingTimeout.value = null
    }
  }

  const startTyping = (text: string) => {
    if (typeof window === 'undefined') {
      typedTitle.value = text
      return
    }
    clearTypingTimeout()
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      typedTitle.value = text
      return
    }
    typedTitle.value = ''
    if (!text) {
      return
    }
    const characters = Array.from(text)
    const typeNext = () => {
      const index = typedTitle.value.length
      if (index >= characters.length) {
        typedTitle.value = text
        clearTypingTimeout()
        return
      }
      typedTitle.value += characters[index] ?? ''
      typingTimeout.value = window.setTimeout(typeNext, typingSpeed)
    }
    typeNext()
  }

  watch(
    sectionTargets,
    targets => {
      activeSection.value = targets[0] ?? ''
      if (typeof window !== 'undefined') {
        window.requestAnimationFrame(updateActiveSection)
      }
    },
    { immediate: true },
  )

  watch(
    () => current.value.hero.title,
    title => {
      startTyping(title)
    },
    { immediate: true },
  )

  watch(
    stackDialog,
    value => {
      if (typeof document === 'undefined') {
        return
      }
      document.body.classList.toggle(bodyBlurClass, value)
    },
    { immediate: true },
  )

  onMounted(() => {
    if (typeof window !== 'undefined') {
      updateViewportMatch()
      syncAppBarHeight()
      const initialScroll = Math.max(window.scrollY, 0)
      lastScrollY.value = initialScroll
      scrollAccumulator.value = 0
      lastScrollDirection.value = 'up'
      updateMobileHeaderVisibility()
      window.addEventListener('scroll', handleScroll, { passive: true })
      window.addEventListener('resize', handleResize)
      updateActiveSection()
    }
  })

  onBeforeUnmount(() => {
    clearTypingTimeout()
    if (typeof window !== 'undefined') {
      if (scrollRafId !== null) {
        window.cancelAnimationFrame(scrollRafId)
        scrollRafId = null
      }
      if (resizeRafId !== null) {
        window.cancelAnimationFrame(resizeRafId)
        resizeRafId = null
      }
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
    if (typeof document !== 'undefined') {
      document.body.classList.remove(bodyBlurClass)
    }
  })

  return {
    accentActivatorLabel: shell.accentActivatorLabel,
    accentId: shell.accentId,
    accentMenuHeading: shell.accentMenuHeading,
    accentMenuHint: shell.accentMenuHint,
    accentOptions: shell.accentOptions,
    activeSection,
    brandRole: shell.brandRole,
    branding: shell.branding,
    categoryOptions,
    current,
    filteredProjects,
    focusContent,
    handleMetricAction,
    heroMetrics,
    languageAriaLabel: shell.languageAriaLabel,
    locale: shell.locale,
    navMenuLabel: shell.navMenuLabel,
    selectedCategory,
    showMobileHeader,
    skillFocus,
    stackDialog,
    tabEntries,
    techDialogSubtitle,
    techDialogTitle,
    techStackSections,
    themeAriaLabel: shell.themeAriaLabel,
    themeIcon: shell.themeIcon,
    themeName: shell.themeName,
    toggleLocale: shell.toggleLocale,
    toggleTheme: shell.toggleTheme,
    typedTitle,
  }
}
