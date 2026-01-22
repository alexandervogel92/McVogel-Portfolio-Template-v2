<template>
  <v-dialog
    v-model="openModel"
    :class="['stack-dialog-overlay', isDark ? 'is-dark' : 'is-light']"
    max-width="720"
  >
    <v-card class="stack-dialog pa-4 pa-md-6" elevation="8">
      <div class="d-flex align-center justify-space-between mb-4">
        <div>
          <h2 class="stack-dialog-title mb-1">{{ title }}</h2>
          <p class="stack-dialog-subtitle mb-0">{{ subtitle }}</p>
        </div>
        <v-btn
          density="comfortable"
          icon
          variant="text"
          @click="openModel = false"
        >
          <v-icon icon="mdi-close" />
        </v-btn>
      </div>
      <v-divider class="mb-4" />
      <div class="stack-sections d-flex flex-column ga-6">
        <section
          v-for="section in sections"
          :key="section.key"
          class="stack-section"
        >
          <div class="stack-section-header d-flex align-center mb-3">
            <v-icon
              class="me-3 accent-icon"
              :icon="section.icon"
              size="28"
            />
            <h3 class="stack-section-title mb-0">{{ section.title }}</h3>
          </div>
          <div class="stack-chips d-flex flex-wrap ga-2">
            <v-chip
              v-for="item in section.items"
              :key="item"
              class="stack-chip text-none"
              size="large"
              variant="flat"
            >
              {{ item }}
            </v-chip>
          </div>
        </section>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  interface TechStackSection {
    key: string
    icon: string
    title: string
    items: readonly string[]
  }

  const props = defineProps<{
    open: boolean
    isDark: boolean
    sections: TechStackSection[]
    subtitle: string
    title: string
  }>()

  const emit = defineEmits<{
    (e: 'update:open', value: boolean): void
  }>()

  const openModel = computed({
    get: () => props.open,
    set: value => emit('update:open', value),
  })
</script>

<style scoped src="@/styles/components/tech-stack-dialog.scss" lang="scss"></style>
