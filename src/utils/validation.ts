const emailPattern = /.+@.+\..+/
const unsafeContentPattern = /<\s*\/?\s*script|javascript:|<[!/?]?\s*\w+/i

const isValidEmail = (value: string) => emailPattern.test(value)
const hasUnsafeContent = (value: string) => unsafeContentPattern.test(value)

export { hasUnsafeContent, isValidEmail }
