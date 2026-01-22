<template>
  <header :class="['portfolio-app-bar', { 'is-mobile-hidden': !mobileVisible }]">
    <v-container class="d-flex align-center justify-space-between py-4">
      <div class="d-flex align-center ga-4">
        <div class="brand-mark d-flex align-center justify-center">
          <span class="brand-avatar-text">{{ brandInitials }}</span>
        </div>
        <div>
          <p class="brand-name mb-0">{{ brandName }}</p>
          <p class="brand-role mb-0">{{ brandRole }}</p>
        </div>
      </div>

      <nav class="d-none d-lg-flex align-center ga-3">
        <v-btn
          v-for="item in navItems"
          :key="item.target"
          :aria-current="item.target === activeSection ? 'page' : undefined"
          :class="['text-none nav-btn', { 'nav-btn--active': item.target === activeSection }]"
          :href="item.target"
          variant="text"
        >
          {{ item.label }}
        </v-btn>
      </nav>

      <div class="d-flex align-center ga-3">
        <v-menu
          v-if="navItems.length > 0"
          location="bottom end"
          offset="8"
        >
          <template #activator="{ props: navActivatorProps }">
            <v-btn
              v-bind="navActivatorProps"
              :aria-label="navMenuLabel"
              class="nav-menu-btn d-inline-flex d-lg-none"
              density="comfortable"
              icon
            >
              <v-icon icon="mdi-menu" />
            </v-btn>
          </template>

          <v-list class="nav-menu pa-2" density="comfortable" nav>
            <v-list-item
              v-for="item in navItems"
              :key="item.target"
              :aria-current="item.target === activeSection ? 'page' : undefined"
              :class="['nav-menu-item text-none', { 'nav-menu-item--active': item.target === activeSection }]"
              :href="item.target"
            >
              <v-list-item-title>{{ item.label }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <v-menu
          location="bottom end"
          offset="8"
        >
          <template #activator="{ props: activatorProps }">
            <v-btn
              v-bind="activatorProps"
              :aria-label="accentActivatorLabel"
              class="accent-menu-btn"
              density="comfortable"
              icon
            >
              <v-icon icon="mdi-palette" />
            </v-btn>
          </template>

          <v-card class="accent-menu pa-4" elevation="8" min-width="240">
            <p class="accent-menu-title mb-1">{{ accentMenuHeading }}</p>
            <p class="accent-menu-hint mb-4">{{ accentMenuHint }}</p>

            <v-chip-group
              v-model="accentModel"
              class="accent-group"
              column
              mandatory
            >
            <v-chip
              v-for="option in accentOptions"
              :key="option.id"
              class="accent-chip text-none"
              :aria-label="option.label"
              :value="option.id"
            >
              <span class="accent-dot" :class="`accent-dot--${option.id}`" />
            </v-chip>
            </v-chip-group>
          </v-card>
        </v-menu>

        <v-btn
          :aria-label="languageAriaLabel"
          class="language-btn"
          density="comfortable"
          icon
          @click="emit('toggle-locale')"
        >
          <span
            aria-hidden="true"
            class="locale-flag fi"
            :class="localeFlagClass"
          />
        </v-btn>

        <v-btn
          :aria-label="themeAriaLabel"
          class="theme-btn"
          density="comfortable"
          icon
          @click="emit('toggle-theme')"
        >
          <v-icon :icon="themeIcon" />
        </v-btn>
      </div>
    </v-container>
  </header>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  interface NavItem {
    label: string
    target: string
  }

  interface AccentOption {
    id: string
    hex: string
    label: string
  }

  type LocaleCode = 'de' | 'en'

  const props = withDefaults(defineProps<{
    brandName: string
    brandRole: string
    brandInitials: string
    navItems: NavItem[]
    accentOptions: AccentOption[]
    accentId: string
    accentActivatorLabel: string
    accentMenuHeading: string
    accentMenuHint: string
    languageAriaLabel: string
    themeAriaLabel: string
    localeCode: LocaleCode
    themeIcon: string
    navMenuLabel: string
    activeSection: string
    mobileVisible?: boolean
  }>(), {
    mobileVisible: true,
  })

  const emit = defineEmits<{
    (e: 'update:accentId', value: string): void
    (e: 'toggle-locale' | 'toggle-theme'): void
  }>()

  const accentModel = computed({
    get: () => props.accentId,
    set: value => emit('update:accentId', value),
  })

  const localeFlagClass = computed(() => (props.localeCode === 'de' ? 'fi-de' : 'fi-us'))

</script>

<style scoped src="@/styles/components/portfolio-app-bar.scss" lang="scss"></style>
