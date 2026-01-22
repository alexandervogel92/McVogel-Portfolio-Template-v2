<template>
  <section :id="sectionId" class="contact-section">
    <v-container>
      <v-card border class="contact-card pa-8 pa-md-12" elevation="0">
        <div class="contact-header text-center mb-8">
          <div class="contact-title-wrapper">
            <v-icon
              class="contact-icon"
              icon="mdi-email-fast-outline"
              size="64"
            />
            <h2 class="contact-title mb-0">{{ contact.heading }}</h2>
          </div>
          <p class="contact-subtitle mb-0">{{ contact.copy }}</p>
        </div>

        <div class="contact-form-wrapper mx-auto">
          <ContactForm :language="language" />
        </div>
      </v-card>
    </v-container>
  </section>
</template>

<script setup lang="ts">
  import ContactForm from '@/components/ui/ContactForm.vue'

  interface ContactContent {
    heading: string
    copy: string
  }

  type SupportedLanguage = 'de' | 'en'

  defineProps<{
    sectionId: string
    contact: ContactContent
    language: SupportedLanguage
  }>()
</script>

<style scoped src="@/styles/components/contact-section.scss" lang="scss"></style>
