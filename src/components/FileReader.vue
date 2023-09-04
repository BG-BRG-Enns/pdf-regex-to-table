<script setup>
import { ref } from 'vue'
import { fileContent } from '../stores/fileContent'

import('pdfjs-dist').then(async (pdfjs) => {
  import('pdfjs-dist/build/pdf.worker.entry').then(async (workerSrc) => {
    pdfjs.GlobalWorkerOptions.workerSrc = workerSrc.default
  })
})
const fileURL = ref('')
const fileURLPreview = ref('')
const handleDrop = (ev) => {
  ev.preventDefault()
  fileContent.clearFileContentText()
  if (ev.dataTransfer.items) {
    // Use DataTransferItemList interface to access the file(s)
    [...ev.dataTransfer.items].forEach((item, i) => {
      // If dropped items aren't files, reject them
      if (item.kind === 'file') {
        const file = item.getAsFile()
        fileURL.value = URL.createObjectURL(file)
        fileURLPreview.value = fileURL.value + '#view=FitH'
        // eslint-disable-next-line no-undef
        const loadingTask = pdfjsLib.getDocument(fileURL.value)
        loadingTask.promise.then(function (doc) {
          const numPages = doc.numPages
          // Get Text Content of all pages in the PDF
          for (let i = 1; i <= numPages; i++) {
            // Required to prevent that i is always the total number of pages
            (function (pageNumber) {
              doc.getPage(pageNumber).then(function (page) {
                page.getTextContent().then(function (textContent) {
                  const textItems = textContent.items
                  let finalString = ''
                  for (let i = 0; i < textItems.length; i++) {
                    const item = textItems[i]
                    finalString += item.str + ' '
                  }
                  fileContent.addFileContentText(pageNumber, finalString)
                })
              })
            })(i)
          }
        })
        // after first file
      }
    })
  } else {
    // Use DataTransfer interface to access the file(s)
    [...ev.dataTransfer.files].forEach((file, i) => {
      console.log(`… file[${i}].name = ${file.name}`)
    })
  }
}
const handleDragOver = (ev) => {
  ev.preventDefault()
}
</script>
<template>
  <div class="columns">
    <div class="column column is-half">
      <div
        class="dropzone"
        @drop.prevent="handleDrop"
        @dragover.prevent="handleDragOver"
      >
        <p>Drop your file here</p>
      </div>
      <div
        v-if="fileContent.text[1]"
        class="field"
      >
        <label
          class="label"
          for="pdfTextContent"
        >Extracted text:</label>
        <div class="control">
          <textarea
            id="pdfTextContent"
            v-model="fileContent.text"
            name="pdfTextContent"
            class="textarea is-family-monospace is-size-7"
            readonly
          />
        </div>
      </div>
    </div>
    <!-- <canvas id="the-canvas"></canvas> -->
    <embed
      v-if="fileURLPreview"
      class="column is-half"
      :src="fileURLPreview"
    >
  </div>
</template>
<style scoped>
.dropzone {
  border: 2px dashed #ccc;
  border-radius: 5px;
  padding: 25px;
  text-align: center;
  font-size: 1.5em;
  color: #ccc;
  margin-bottom: 25px;
}
</style>
