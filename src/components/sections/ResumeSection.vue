<template>
  <section :id="sectionId" class="resume-section">
    <v-container>
      <div class="section-heading">
        <h2>{{ resume.heading }}</h2>
        <p>{{ resume.subtitle }}</p>
      </div>

      <div class="resume-grid">
        <div class="resume-column timeline-column">
          <v-card border class="resume-card timeline-card pa-6" elevation="0">
            <p class="control-label">{{ resume.timelineLabel }}</p>
            <div class="timeline">
              <article
                v-for="(entry, index) in resume.timeline"
                :key="entry.title"
                :class="['timeline-entry', { 'is-last': index === resume.timeline.length - 1 }]"
              >
                <div class="timeline-marker">
                  <span class="timeline-dot" />
                </div>
                <div class="timeline-content">
                  <header class="timeline-header">
                    <div>
                      <h3>{{ entry.title }}</h3>
                      <p class="timeline-company">{{ entry.company }} · {{ entry.location }}</p>
                    </div>
                    <span class="timeline-period">{{ entry.period }}</span>
                  </header>
                  <p class="timeline-description">
                    {{ entry.description }}
                  </p>
                  <ul class="timeline-highlights">
                    <li v-for="highlight in entry.highlights" :key="highlight">
                      <span class="highlight-bullet" />
                      <span>{{ highlight }}</span>
                    </li>
                  </ul>
                </div>
              </article>
            </div>
          </v-card>
        </div>

        <div class="resume-column summary-column">
          <v-card border class="resume-card summary-card pa-6" elevation="0">
            <div class="summary-section">
              <p class="control-label mb-2">{{ resume.dailyLabel }}</p>
              <h3 class="summary-heading">{{ resume.dailyHeadline }}</h3>
              <p class="summary-copy">{{ resume.dailyCopy }}</p>
              <ul class="summary-list">
                <li v-for="item in resume.dailyHighlights" :key="item">
                  <span class="list-marker" />
                  <span>{{ item }}</span>
                </li>
              </ul>
            </div>
            <div class="summary-divider" />
            <div class="summary-section">
              <p class="control-label mb-2">{{ resume.dailyStackLabel }}</p>
              <div class="stack-grid">
                <v-chip
                  v-for="tool in resume.dailyStack"
                  :key="tool"
                  class="text-none stack-chip"
                  size="small"
                  variant="flat"
                >
                  {{ tool }}
                </v-chip>
              </div>
            </div>
          </v-card>
        </div>
      </div>
    </v-container>
  </section>
</template>

<script setup lang="ts">
  interface ResumeEntry {
    title: string
    company: string
    location: string
    period: string
    description: string
    highlights: string[]
  }

  interface ResumeContent {
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

  defineProps<{
    sectionId: string
    resume: ResumeContent
  }>()
</script>

<style scoped src="@/styles/components/resume-section.scss" lang="scss"></style>
