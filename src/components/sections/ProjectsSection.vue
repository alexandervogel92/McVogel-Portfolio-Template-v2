<template>
  <section :id="sectionId" class="projects-section">
    <v-container>
      <div class="section-heading">
        <h2>{{ heading }}</h2>
        <p>{{ description }}</p>
      </div>

      <div class="d-flex flex-column flex-sm-row justify-space-between align-sm-center ga-4 mb-6">
        <div class="d-flex align-center ga-3">
          <v-icon class="accent-icon" icon="mdi-view-grid-plus" />
          <span class="control-label">{{ filterLabel }}</span>
        </div>

        <v-chip-group
          v-model="categoryModel"
          class="project-chip-group"
          column
          mandatory
        >
          <v-chip
            v-for="category in categoryOptions"
            :key="category.id"
            class="text-none"
            :value="category.id"
            variant="outlined"
          >
            {{ category.label }}
          </v-chip>
        </v-chip-group>
      </div>

      <v-row class="ga-4">
        <v-col
          v-for="project in projects"
          :key="project.name"
          cols="12"
          md="4"
        >
          <v-card
            :class="[
              'project-card',
              { 'project-card--inactive': project.inactive },
            ]"
          >
            <div class="d-flex justify-space-between align-center mb-3">
              <v-chip class="text-none year-chip" size="small" variant="flat">
                {{ project.year }}
              </v-chip>
              <v-icon class="accent-icon" icon="mdi-bezier" />
            </div>

            <h3 class="project-title">{{ project.name }}</h3>
            <p class="project-description">{{ project.description }}</p>
            <p class="project-impact">{{ project.impact }}</p>
            <div
              v-if="project.inactiveLabel"
              class="project-offline-note"
              role="status"
            >
              <v-icon class="me-1" icon="mdi-power-plug-off-outline" size="18" />
              <span>{{ project.inactiveLabel }}</span>
            </div>

            <div class="project-stack d-flex flex-wrap ga-2">
              <v-chip
                v-for="tech in project.stack"
                :key="tech"
                class="text-none"
                size="small"
                variant="tonal"
              >
                {{ tech }}
              </v-chip>
            </div>

            <div
              v-if="project.link"
              class="mt-5"
            >
              <v-btn
                class="text-none project-link"
                :href="project.link"
                rel="noopener"
                size="small"
                target="_blank"
                variant="text"
              >
                {{ project.linkLabel ?? linkLabelFallback }}
                <v-icon class="ms-2" icon="mdi-open-in-new" size="16" />
              </v-btn>
            </div>
          </v-card>
        </v-col>

        <v-col
          v-if="projects.length === 0"
          cols="12"
        >
          <v-sheet border class="empty-state py-10 px-6">
            <v-icon class="mb-3 accent-icon" icon="mdi-compass-off-outline" />
            <p class="mb-0">{{ emptyState }}</p>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  type CategoryId = 'all' | 'personal' | 'client' | 'learning'

  interface CategoryOption {
    id: CategoryId
    label: string
  }

  interface ProjectItem {
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

  const props = defineProps<{
    sectionId: string
    heading: string
    description: string
    filterLabel: string
    categoryOptions: CategoryOption[]
    selectedCategory: CategoryId
    projects: ProjectItem[]
    emptyState: string
    linkLabelFallback: string
  }>()

  const emit = defineEmits<{
    (e: 'update:selectedCategory', value: CategoryId): void
  }>()

  const categoryModel = computed({
    get: () => props.selectedCategory,
    set: value => emit('update:selectedCategory', value),
  })
</script>

<style scoped src="@/styles/components/projects-section.scss" lang="scss"></style>
