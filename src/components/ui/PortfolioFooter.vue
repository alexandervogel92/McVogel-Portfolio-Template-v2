<template>
  <footer class="portfolio-footer">
    <v-container class="portfolio-footer__container">
      <p class="portfolio-footer__copy">
        © 2026 Portfolio Template · Built with
        <a
          v-if="templateUrl"
          class="portfolio-footer__link"
          :href="templateUrl"
          rel="noopener"
          target="_blank"
        >
          {{ templateLabel }}
        </a>
        <span v-else>{{ templateLabel }}</span>
      </p>
    </v-container>
  </footer>
</template>

<script setup lang="ts">
  import { env } from '@/config/env'

  const templateLabel = 'McVogel-Portfolio-Template'
  const templateUrl = env.portfolioTemplateUrl
</script>

<style scoped src="@/styles/components/portfolio-footer.scss" lang="scss"></style>
