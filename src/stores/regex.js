import { reactive } from 'vue'
export const regex = reactive({
  regex: '',
  setRegex (regex) {
    this.regex = regex
  }
})
