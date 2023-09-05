<script setup>
import { fileContent } from '../stores/fileContent'
import { regex } from '../stores/regex.js'
import { ref } from 'vue'
import { utils, writeFileXLSX } from 'xlsx'

const csv = ref([])
const exportXLSX = () => {
  utils.table_to_book(document.getElementById('extracted-data'))
  writeFileXLSX(
    utils.table_to_book(document.getElementById('extracted-data')),
    `${fileContent.name}.xlsx`
  )
}
const exportCSV = () => {
  const rows = document.querySelectorAll('table tr')
  rows.forEach((row, index) => {
    const columns = row.querySelectorAll('td')
    const line = []
    columns.forEach((column, index2) => {
      line.push(column.innerText)
    })
    csv.value.push('"' + line.join('","') + '"')
  })
  const csvContent = 'data:text/csv;charset=utf-8,' + csv.value.join('\n')
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `${fileContent.name}.csv`)
  document.body.appendChild(link) // Required for FF
  link.click()
}
</script>
<template>
  <p class="has-text-weight-bold">
    Extrahierte Daten
  </p>
  <!-- Download Button -->
  <div class="columns">
    <div class="column is-narrow">
      <div class="field">
        <div class="control">
          <a
            class="button is-success"
            @click="exportCSV"
          > Download CSV </a>
        </div>
      </div>
    </div>
    <div class="column is-narrow">
      <div class="field">
        <div class="control">
          <a
            class="button is-success"
            @click="exportXLSX"
          > Download XLSX </a>
        </div>
      </div>
    </div>
    <div class="column">
      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label class="label">File name:</label>
        </div>
        <div class="field-body">
          <div class="field">
            <p class="control">
              <input
                v-model="fileContent.name"
                class="input is-family-monospace"
                type="text"
                placeholder="Filename"
              >
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="table-container">
    <table
      id="extracted-data"
      class="table is-striped is-bordered is-hoverable"
    >
      <tbody>
        <template v-for="(file, index) in fileContent.text">
          <template v-for="(line, index2) in file">
            <tr
              v-if="line.match(regex.regex)"
              :key="index2"
            >
              <td>{{ index }}</td><td>{{ index2 }}</td>
              <template v-for="(match, index3) in line.match(regex.regex)">
                <td
                  v-if="index3 > 0"
                  :key="index3"
                >
                  {{ match }}
                </td>
              </template>
            </tr>
          </template>
        </template>
      </tbody>
    </table>
  </div>
</template>
