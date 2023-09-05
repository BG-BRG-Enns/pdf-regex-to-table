import { reactive } from 'vue'
export const fileContent = reactive({
  text: { },
  name: 'extracted-data',
  addFileContentText (fileName, page, text) {
    if (!this.text[fileName]) {
      this.text[fileName] = { }
    }
    this.text[fileName][page] = text
  },
  clearFileContentText () {
    this.text = { }
  }

})
