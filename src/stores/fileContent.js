import { reactive } from 'vue'
export const fileContent = reactive({
  text: {},
  addFileContentText (page, text) {
    this.text[page] = text
  },
  clearFileContentText () {
    this.text = {}
  }
})
