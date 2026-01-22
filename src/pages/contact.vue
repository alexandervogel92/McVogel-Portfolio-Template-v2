<template>
  <div class="contact-page">
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
      :nav-items="current.nav"
      :nav-menu-label="navMenuLabel"
      :theme-aria-label="themeAriaLabel"
      :theme-icon="themeIcon"
      @toggle-locale="toggleLocale"
      @toggle-theme="toggleTheme"
    />

    <main>
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
  import PortfolioAppBar from '@/components/ui/PortfolioAppBar.vue'
  import PortfolioFooter from '@/components/ui/PortfolioFooter.vue'
  import { usePortfolioShell } from '@/composables/usePortfolioShell'

  const {
    accentActivatorLabel,
    accentId,
    accentMenuHeading,
    accentMenuHint,
    accentOptions,
    brandRole,
    branding,
    current,
    languageAriaLabel,
    locale,
    navMenuLabel,
    themeAriaLabel,
    themeIcon,
    toggleLocale,
    toggleTheme,
  } = usePortfolioShell()

  const activeSection = '#contact'
</script>

<style scoped src="@/styles/components/contact-page.scss" lang="scss"></style>
