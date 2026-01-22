<template>
  <v-form
    ref="formRef"
    class="contact-form"
    @submit.prevent="submitForm"
  >
    <input
      name="site"
      type="hidden"
      value="portfolio"
    >

    <v-container>
      <v-row>
        <v-col cols="12">
          <v-alert
            v-if="formStatus.message"
            closable
            density="compact"
            :model-value="!!formStatus.message"
            :text="formStatus.message"
            :type="formStatus.type"
            variant="tonal"
            @update:model-value="val => { if (!val) formStatus.message = '' }"
          />
        </v-col>

        <v-col
          cols="12"
          md="6"
        >
          <v-text-field
            v-model="formData.name"
            :label="labels.name"
            name="name"
            prepend-inner-icon="mdi-account"
            required
            :rules="[rules.required, rules.safeRequired]"
            variant="outlined"
          />
        </v-col>

        <v-col
          cols="12"
          md="6"
        >
          <v-text-field
            v-model="formData.email"
            :label="labels.email"
            name="email"
            prepend-inner-icon="mdi-email"
            required
            :rules="[rules.required, rules.email]"
            type="email"
            variant="outlined"
          />
        </v-col>

        <v-col cols="12">
          <v-text-field
            v-model="formData.subject"
            :label="labels.subject"
            name="subject"
            prepend-inner-icon="mdi-pencil"
            :rules="[rules.safeOptional]"
            variant="outlined"
          />
        </v-col>

        <v-col cols="12">
          <v-textarea
            v-model="formData.message"
            auto-grow
            :label="labels.message"
            name="message"
            prepend-inner-icon="mdi-message-text"
            required
            rows="5"
            :rules="[rules.required, rules.safeRequired]"
            variant="outlined"
          />
        </v-col>

        <v-col cols="12">
          <div class="text-caption mb-4">
            {{ labels.captchaInfo }}
          </div>
        </v-col>

        <v-col
          class="text-center"
          cols="12"
        >
          <v-btn
            class="contact-form__submit"
            :disabled="loading"
            :loading="loading"
            size="large"
            type="submit"
          >
            <v-icon
              icon="mdi-send"
              start
            />
            {{ labels.submit }}
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script setup lang="ts">
  import type { VForm } from 'vuetify/components'
  import { computed, reactive, ref } from 'vue'
  import { useReCaptcha } from 'vue-recaptcha-v3'
  import { apiUrl, env } from '@/config/env'
  import { hasUnsafeContent, isValidEmail } from '@/utils/validation'

  type SupportedLanguage = 'de' | 'en'

  interface FormStatus {
    type: 'success' | 'error' | 'info'
    message: string
  }

  const props = defineProps<{
    language: SupportedLanguage
  }>()

  const formRef = ref<VForm | null>(null)
  const loading = ref(false)
  const formStatus = reactive<FormStatus>({
    type: 'success',
    message: '',
  })
  const formData = reactive({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const rules = computed(() => ({
    required: (v: string) => !!v || (props.language === 'de'
      ? 'Dieses Feld ist erforderlich.'
      : 'This field is required.'),
    email: (v: string) => isValidEmail(v) || (props.language === 'de'
      ? 'Ungültige E-Mail-Adresse.'
      : 'Invalid e-mail address.'),
    safeRequired: (v: string) => !hasUnsafeContent(v) || (props.language === 'de'
      ? 'Bitte verwenden Sie keine HTML-Tags oder Skripte.'
      : 'Please avoid HTML tags or scripts.'),
    safeOptional: (v: string) => !v || !hasUnsafeContent(v) || (props.language === 'de'
      ? 'Bitte verwenden Sie keine HTML-Tags oder Skripte.'
      : 'Please avoid HTML tags or scripts.'),
  }))

  const labels = computed(() => ({
    name: props.language === 'de' ? 'Ihr Name' : 'Your Name',
    email: props.language === 'de' ? 'Ihre E-Mail' : 'Your Email',
    subject: props.language === 'de' ? 'Betreff (Optional)' : 'Subject (Optional)',
    message: props.language === 'de' ? 'Ihre Nachricht' : 'Your Message',
    submit: props.language === 'de' ? 'Nachricht senden' : 'Send Message',
    successMessage: props.language === 'de'
      ? 'Vielen Dank! Ihre Nachricht wurde gesendet.'
      : 'Thank you! Your message has been sent.',
    errorMessage: props.language === 'de'
      ? 'Fehler beim Senden. Bitte später erneut versuchen.'
      : 'Error sending message. Please try again later.',
    captchaInfo: props.language === 'de'
      ? 'Diese Seite ist durch reCAPTCHA geschützt.'
      : 'This site is protected by reCAPTCHA.',
  }))

  const recaptcha = useReCaptcha()

  function resetForm () {
    formRef.value?.reset()
  }

  async function submitForm () {
    const targetForm = formRef.value
    if (!targetForm) return

    formData.name = formData.name.trim()
    formData.email = formData.email.trim()
    formData.subject = formData.subject.trim()
    formData.message = formData.message.trim()

    const { valid } = await targetForm.validate()
    if (!valid) {
      formStatus.type = 'error'
      formStatus.message = props.language === 'de'
        ? 'Bitte füllen Sie alle Pflichtfelder korrekt aus.'
        : 'Please fill in all required fields correctly.'
      return
    }

    loading.value = true
    formStatus.message = ''

    try {
      if (!recaptcha) {
        throw new Error('reCAPTCHA not initialised')
      }

      const recaptchaToken = await recaptcha.executeRecaptcha('contact_form')

      const rawForm = targetForm.$el as HTMLFormElement | undefined
      if (!rawForm) {
        throw new Error('Form element missing')
      }

      const fd = new FormData(rawForm)
      fd.append('recaptcha', recaptchaToken)

      const resp = await fetch(apiUrl(env.contactPath), {
        method: 'POST',
        body: fd,
      })

      if (resp.ok) {
        formStatus.type = 'success'
        formStatus.message = labels.value.successMessage
        resetForm()
      } else {
        const err = await resp.json().catch(() => ({}))
        formStatus.type = 'error'
        formStatus.message = `${labels.value.errorMessage} (${err.detail ?? resp.statusText})`
      }
    } catch (error) {
      console.error(error)
      formStatus.type = 'error'
      formStatus.message = labels.value.errorMessage
    } finally {
      loading.value = false
    }
  }
</script>

<style scoped src="@/styles/components/contact-form.scss" lang="scss"></style>
