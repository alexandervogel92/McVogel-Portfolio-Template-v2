<template>
  <section :id="sectionId" class="highlights-section">
    <v-container>
      <div class="section-heading">
        <h2>{{ heading }}</h2>
        <p>{{ description }}</p>
      </div>

      <v-row class="ga-4 highlight-grid">
        <v-col cols="12">
          <v-card
            v-if="slideCount > 0"
            class="highlight-slider pa-6 pa-md-8"
            elevation="0"
          >
            <div
              class="slider-controls"
              :class="{ 'is-mobile': isMobile }"
            >
              <v-btn
                v-if="!isMobile"
                class="slider-nav-btn prev-btn"
                density="comfortable"
                :disabled="slideCount <= 1"
                icon="mdi-chevron-left"
                rounded="xl"
                variant="tonal"
                @click="goToPrevious"
              />
              <v-slide-group
                v-model="slideNavModel"
                center-active
                class="slider-tabs flex-grow-1"
                :show-arrows="!isMobile && slideCount > 1"
              >
                <v-slide-group-item
                  v-for="(slide, index) in slides"
                  :key="slide.id"
                  :value="index"
                >
                  <v-chip
                    class="slider-tab text-none"
                    :prepend-icon="slide.icon"
                    rounded="xl"
                    variant="outlined"
                    @click="activeSlide = index"
                  >
                    {{ slide.label }}
                  </v-chip>
                </v-slide-group-item>
              </v-slide-group>
              <v-btn
                v-if="!isMobile"
                class="slider-nav-btn next-btn"
                density="comfortable"
                :disabled="slideCount <= 1"
                icon="mdi-chevron-right"
                rounded="xl"
                variant="tonal"
                @click="goToNext"
              />
            </div>

            <v-window v-model="activeSlide" class="highlight-window mt-6">
              <v-window-item
                v-for="(slide, index) in slides"
                :key="slide.id"
                :value="index"
              >
                <div
                  class="slider-stage"
                  :class="[`slider-stage--${slide.id}`, { 'is-compact': isMobile }]"
                >
                  <div class="stage-background" />
                  <div class="stage-gradient" />
                  <div class="stage-content">
                    <div
                      class="stage-content-card"
                      :class="{ 'is-compact': isMobile }"
                    >
                      <div class="stage-header">
                        <v-icon
                          class="stage-icon"
                          :icon="slide.icon"
                          size="36"
                        />
                        <div>
                          <p class="stage-label mb-1">{{ slide.label }}</p>
                          <h3 class="stage-headline mb-0">{{ slide.headline }}</h3>
                        </div>
                      </div>
                      <p
                        class="stage-description"
                        :class="{ 'is-compact': isMobile }"
                      >
                        {{ slide.description }}
                      </p>
                      <div
                        class="stage-body"
                        :class="{ 'is-compact': isMobile }"
                      >
                        <div class="stage-points">
                          <p class="stage-subheading">{{ slide.focusLabel }}</p>
                          <ul class="stage-list">
                            <li
                              v-for="point in getVisiblePoints(slide)"
                              :key="point"
                            >
                              <span class="list-bullet" />
                              <span>{{ point }}</span>
                            </li>
                          </ul>
                        </div>
                        <div
                          v-if="!isMobile && slide.metrics?.length"
                          class="stage-metrics"
                        >
                          <div
                            v-for="metric in slide.metrics"
                            :key="metric.label"
                            class="stage-metric"
                          >
                            <span class="metric-value">{{ metric.value }}</span>
                            <span class="metric-label">{{ metric.label }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-if="!isMobile" class="stage-visual">
                    <div class="orb orb-primary" />
                    <div class="orb orb-secondary" />
                    <div class="grid-lines" />
                  </div>
                </div>
              </v-window-item>
            </v-window>

            <div class="slider-progress mt-6">
              <v-progress-linear
                class="progress-track"
                height="6"
                :model-value="progress"
                rounded
              />
              <p class="progress-label">
                {{ slideCount > 0 ? activeSlide + 1 : 0 }} / {{ slideCount }}
              </p>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <v-card border class="expertise-card pa-6 mt-8" elevation="0">
        <div class="d-flex flex-column flex-sm-row justify-space-between ga-6">
          <div class="expertise-header">
            <h3>{{ expertiseHeading }}</h3>
            <p>{{ focusContent.copy }}</p>
          </div>
          <div class="expertise-controls">
            <v-btn-toggle
              v-model="focusModel"
              class="focus-toggle"
              color="primary"
              mandatory
              rounded="xl"
            >
              <v-btn
                v-for="[value, entry] in tabEntries"
                :key="value"
                class="text-none"
                :value="value"
              >
                {{ entry.label }}
              </v-btn>
            </v-btn-toggle>
          </div>
        </div>

        <v-expand-transition>
          <div :key="skillFocus" class="expertise-groups mt-6">
            <div class="expertise-grid">
              <div
                v-for="group in focusContent.groups"
                :key="group.title"
                class="expertise-grid-item"
              >
                <v-sheet class="expertise-group pa-5" elevation="0">
                  <p class="group-title mb-3">{{ group.title }}</p>
                  <ul class="group-list">
                    <li v-for="entry in group.entries" :key="entry">
                      <span class="bullet" />
                      <span>{{ entry }}</span>
                    </li>
                  </ul>
                </v-sheet>
              </div>
            </div>
          </div>
        </v-expand-transition>
      </v-card>
    </v-container>
  </section>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { useDisplay } from 'vuetify'

  type SkillFocus = 'skills' | 'tools' | 'process'

  interface HighlightMetric {
    label: string
    value: string
  }

  interface HighlightAccent {
    from: string
    to: string
  }

  interface HighlightSlide {
    id: string
    label: string
    headline: string
    description: string
    focusLabel: string
    points: string[]
    icon: string
    accent: HighlightAccent
    metrics?: HighlightMetric[]
  }

  interface ExpertiseGroup {
    title: string
    entries: string[]
  }

  interface ExpertiseTab {
    label: string
    copy: string
    groups: ExpertiseGroup[]
  }

  const props = defineProps<{
    sectionId: string
    heading: string
    description: string
    highlights: HighlightSlide[]
    expertiseHeading: string
    skillFocus: SkillFocus
    tabEntries: Array<[SkillFocus, ExpertiseTab]>
    focusContent: ExpertiseTab
  }>()

  const emit = defineEmits<{
    (e: 'update:skillFocus', value: SkillFocus): void
  }>()

  const slides = computed(() => props.highlights)

  const focusModel = computed({
    get: () => props.skillFocus,
    set: value => emit('update:skillFocus', value),
  })

  const activeSlide = ref(0)

  const slideCount = computed(() => slides.value.length)
  const { smAndDown } = useDisplay()
  const isMobile = computed(() => smAndDown.value)

  watch(
    slides,
    value => {
      if (value.length === 0) {
        activeSlide.value = 0
        return
      }
      if (activeSlide.value >= value.length) {
        activeSlide.value = value.length - 1
      }
    },
    { immediate: true, deep: true },
  )

  const slideNavModel = computed({
    get: () => (slideCount.value > 0 ? activeSlide.value : 0),
    set: value => {
      const normalized = typeof value === 'string' ? Number(value) : value
      if (Number.isInteger(normalized) && normalized >= 0 && normalized < slideCount.value) {
        activeSlide.value = normalized
      }
    },
  })

  const progress = computed(() => {
    if (slideCount.value === 0) return 0
    return ((activeSlide.value + 1) / slideCount.value) * 100
  })

  function goToPrevious () {
    if (slideCount.value <= 1) return
    activeSlide.value = (activeSlide.value - 1 + slideCount.value) % slideCount.value
  }

  function goToNext () {
    if (slideCount.value <= 1) return
    activeSlide.value = (activeSlide.value + 1) % slideCount.value
  }

  function getVisiblePoints (slide: HighlightSlide) {
    return isMobile.value ? slide.points.slice(0, 2) : slide.points
  }

  defineExpose({
    activeSlide,
    goToNext,
    goToPrevious,
    slideCount,
    slides,
  })
</script>

<style scoped src="@/styles/components/highlights-section.scss" lang="scss"></style>
