/// <reference types="vite/client" />
/// <reference types="unplugin-vue-router/client" />

declare module '*.json' {
  const value: unknown
  export default value
}
