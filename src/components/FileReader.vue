<!-- eslint-disable vue/no-textarea-mustache -->
<script setup>
import { ref } from 'vue'
import { fileContent } from '../stores/fileContent'

let pdfjs = null

const loadPdfjs = async () => {
  if (pdfjs) return pdfjs
  pdfjs = await import('pdfjs-dist')
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.mjs',
    import.meta.url
  ).href
  return pdfjs
}

const fileURL = ref('')
const fileURLPreview = ref('')
const supportsFileSystemAccessAPI = 'getAsFileSystemHandle' in DataTransferItem.prototype
const supportsWebkitGetAsEntry = 'webkitGetAsEntry' in DataTransferItem.prototype

const handleDrop = async (ev) => {
  ev.preventDefault()

  fileContent.clearFileContentText()
  if (ev.dataTransfer && ev.dataTransfer.items) {
    const fileHandlesPromises = [...ev.dataTransfer.items]
    // …by including only files (where file misleadingly means actual file _or_
    // directory)…
      .filter((item) => item.kind === 'file')
    // …and, depending on previous feature detection…
      .map((item) =>
        supportsFileSystemAccessAPI
        // …either get a modern `FileSystemHandle`…
          ? item.getAsFileSystemHandle()
        // …or a classic `FileSystemFileEntry`.
          : supportsWebkitGetAsEntry ? item.webkitGetAsEntry() : item
      )
    // Loop over the array of promises.
    for await (const handle of fileHandlesPromises) {
      if (handle.kind === 'directory' || handle.isDirectory) {
        // get all files in directory
        // let fileHandles
        if (handle.constructor.name === 'FileSystemDirectoryEntry') {
          const dirReader = handle.createReader()
          dirReader.readEntries(async (fileHandles) => {
            if (fileHandles.length) {
              for await (const fileHandle of fileHandles) {
                if (fileHandle.isFile) {
                  fileHandle.file(handleFile)
                }
              }
            }
          })
        } else if (handle.constructor.name === 'FileSystemDirectoryHandle') {
          for await (const fileHandle of handle.values()) {
            if (fileHandle.kind === 'file' || fileHandle.isFile) {
              const file = await fileHandle.getFile()
              handleFile(file)
            }
          }
        }
      } else {
        if (handle.kind === 'file' || handle.isFile) {
          if (handle.constructor.name === 'FileSystemFileHandle') {
            const file = await handle.getFile()
            handleFile(file)
          } else if (handle.constructor.name === 'FileSystemFileEntry') {
            await handle.file(handleFile)
          } else {
            const file = await handle.getAsFile()
            handleFile(file)
          }
        }
      }
    }
  } else if (ev.dataTransfer && ev.dataTransfer.files) {
    [...ev.dataTransfer.files].forEach((file, i) => {
      handleFile(file)
    })
  } else if (ev.target.files) {
    [...ev.target.files].forEach((file, i) => {
      handleFile(file)
    })
  }

  function handleFile (file) {
    if (file.type === 'application/pdf' || file.name.split('.').pop() === 'pdf') {
      fileContent.name = file.name.split('.').slice(0, -1).join('.')
      fileURL.value = URL.createObjectURL(file)
      fileURLPreview.value = fileURL.value + '#view=FitH'
      extractContent(fileContent.name)
    }
  }
}
const extractContent = async (fileName) => {
  const pdf = await loadPdfjs()
  const loadingTask = pdf.getDocument(fileURL.value)
  loadingTask.promise.then(function (doc) {
    const numPages = doc.numPages
    // Get Text Content of all pages in the PDF
    for (let i = 1; i <= numPages; i++) {
      // Required to prevent that i is always the total number of pages
      (function (pageNumber) {
        doc.getPage(pageNumber).then((page) => {
          page.getTextContent().then((textContent) => {
            const textItems = textContent.items
            let finalString = ''
            for (let i = 0; i < textItems.length; i++) {
              const item = textItems[i]
              finalString += item.str + ' '
            }
            fileContent.addFileContentText(fileName, pageNumber, finalString)
          })
        })
      })(i)
    }
  })
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
        @click="$refs.fileInput.click()"
      >
        <p>
          Drop your file here
          <br>
          <span class="is-size-6">
            or click to choose (a) file(s)
          </span>
        </p>
        <input
          ref="fileInput"
          type="file"
          multiple
          hidden
          @change="handleDrop"
        >
      </div>
      <div
        v-if="Object.keys(fileContent.text).length > 0"
        class="field"
      >
        <label
          class="label"
          for="pdfTextContent"
        >Extracted text:</label>
        <div class="control">
          <textarea
            id="pdfTextContent"
            name="pdfTextContent"
            class="textarea is-family-monospace is-size-7"
            readonly
            :value="JSON.stringify(fileContent.text, null, 2)"
          />
        </div>
      </div>
    </div>
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
