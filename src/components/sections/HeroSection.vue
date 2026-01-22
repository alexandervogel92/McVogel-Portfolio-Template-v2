<template>
  <section :id="sectionId" class="hero-section">
    <v-container>
      <v-row align="center" class="ga-10">
        <v-col class="hero-copy" cols="12" lg="8" md="10">
          <div class="hero-overline">
            <v-chip class="text-uppercase hero-chip" label size="small">
              {{ hero.badge }}
            </v-chip>
            <span class="hero-location">{{ hero.location }}</span>
          </div>

          <h1 aria-live="polite" class="hero-title">
            <span class="hero-title-text">{{ typedTitle }}</span>
            <span aria-hidden="true" class="hero-cursor" />
          </h1>

          <p class="hero-subtitle">
            {{ hero.subtitle }}
          </p>

          <div class="hero-meta">
            <v-icon class="me-2 pulse-icon" icon="mdi-pulse" size="20" />
            <span>{{ hero.status }}</span>
          </div>

          <div class="cta-group d-flex flex-wrap ga-3">
            <v-btn
              class="accent-btn"
              :href="hero.ctaPrimaryLink"
              size="large"
            >
              {{ hero.ctaPrimary }}
            </v-btn>

            <v-btn
              class="ghost-btn"
              :href="hero.ctaSecondaryLink"
              size="large"
              variant="outlined"
            >
              {{ hero.ctaSecondary }}
            </v-btn>
          </div>

          <p
            v-if="hero.availability"
            class="hero-availability"
          >
            {{ hero.availability }}
          </p>

          <v-row class="mt-8 metric-grid" dense>
            <v-col
              v-for="metric in metrics"
              :key="metric.label"
              cols="12"
              sm="4"
            >
              <v-sheet
                border
                class="metric-card pa-5"
                elevation="0"
                role="button"
                tabindex="0"
                @click="handleMetricClick(metric)"
                @keydown.enter.prevent="handleMetricClick(metric)"
                @keydown.space.prevent="handleMetricClick(metric)"
              >
                <p class="metric-value mb-1">{{ metric.value }}</p>
                <p class="metric-label mb-0">{{ metric.label }}</p>
                <p
                  v-if="metric.detail"
                  class="metric-detail mb-0"
                >
                  {{ metric.detail }}
                </p>
              </v-sheet>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup lang="ts">
  interface Metric {
    label: string
    value: string
    detail?: string
    action?: 'experience' | 'projects' | 'stack'
  }

  interface HeroContent {
    badge: string
    location: string
    subtitle: string
    status: string
    ctaPrimary: string
    ctaPrimaryLink: string
    ctaSecondary: string
    ctaSecondaryLink: string
    availability: string
  }

  defineProps<{
    sectionId: string
    hero: HeroContent
    metrics: Metric[]
    typedTitle: string
  }>()

  const emit = defineEmits<{
    (e: 'metric-action', action: 'experience' | 'projects' | 'stack'): void
  }>()

  function handleMetricClick (metric: Metric) {
    if (!metric.action) return
    emit('metric-action', metric.action)
  }
</script>

<style scoped src="@/styles/components/hero-section.scss" lang="scss"></style>
