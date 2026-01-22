<template>
  <div :class="['portfolio-view', themeName === 'portfolioDark' ? 'is-dark' : 'is-light']">
    <PortfolioAppBar
      v-model:accent-id="accentId"
      :accent-activator-label="accentActivatorLabel"
      :accent-menu-heading="accentMenuHeading"
      :accent-menu-hint="accentMenuHint"
      :accent-options="accentOptions"
      :active-section="activeSection"
      :brand-initials="branding.initials"
      :brand-name="branding.name"
      :brand-role="brandRole"
      :language-aria-label="languageAriaLabel"
      :locale-code="locale"
      :mobile-visible="showMobileHeader"
      :nav-items="current.nav"
      :nav-menu-label="navMenuLabel"
      :theme-aria-label="themeAriaLabel"
      :theme-icon="themeIcon"
      @toggle-locale="toggleLocale"
      @toggle-theme="toggleTheme"
    />
    <TechStackDialog
      v-model:open="stackDialog"
      :is-dark="themeName === 'portfolioDark'"
      :sections="techStackSections"
      :subtitle="techDialogSubtitle"
      :title="techDialogTitle"
    />
    <main>
      <HeroSection
        :hero="current.hero"
        :metrics="heroMetrics"
        section-id="intro"
        :typed-title="typedTitle"
        @metric-action="handleMetricAction"
      />
      <HighlightsSection
        v-model:skill-focus="skillFocus"
        :description="current.expertise.description"
        :expertise-heading="current.expertise.heading"
        :focus-content="focusContent"
        :heading="current.highlightsHeading"
        :highlights="current.highlights"
        section-id="expertise"
        :tab-entries="tabEntries"
      />
      <ProjectsSection
        v-model:selected-category="selectedCategory"
        :category-options="categoryOptions"
        :description="current.projects.description"
        :empty-state="current.projects.empty"
        :filter-label="current.projects.filterLabel"
        :heading="current.projects.heading"
        :link-label-fallback="current.projects.linkLabelFallback"
        :projects="filteredProjects"
        section-id="projects"
      />
      <ResumeSection
        :resume="current.resume"
        section-id="resume"
      />
      <ContactSection
        :contact="current.contact"
        :language="locale"
        section-id="contact"
      />
    </main>
    <PortfolioFooter />
  </div>
</template>

<script setup lang="ts">
  import ContactSection from '@/components/sections/ContactSection.vue'
  import HeroSection from '@/components/sections/HeroSection.vue'
  import HighlightsSection from '@/components/sections/HighlightsSection.vue'
  import ProjectsSection from '@/components/sections/ProjectsSection.vue'
  import ResumeSection from '@/components/sections/ResumeSection.vue'
  import PortfolioAppBar from '@/components/ui/PortfolioAppBar.vue'
  import PortfolioFooter from '@/components/ui/PortfolioFooter.vue'
  import TechStackDialog from '@/components/ui/TechStackDialog.vue'
  import { usePortfolioHome } from '@/composables/usePortfolioHome'

  const {
    accentActivatorLabel,
    accentId,
    accentMenuHeading,
    accentMenuHint,
    accentOptions,
    activeSection,
    brandRole,
    branding,
    categoryOptions,
    current,
    filteredProjects,
    focusContent,
    handleMetricAction,
    heroMetrics,
    languageAriaLabel,
    locale,
    navMenuLabel,
    selectedCategory,
    showMobileHeader,
    skillFocus,
    stackDialog,
    tabEntries,
    techDialogSubtitle,
    techDialogTitle,
    techStackSections,
    themeAriaLabel,
    themeIcon,
    themeName,
    toggleLocale,
    toggleTheme,
    typedTitle,
  } = usePortfolioHome()
</script>

<style scoped src="@/styles/components/portfolio-page.scss" lang="scss"></style>
