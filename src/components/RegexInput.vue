<script setup>
import { regex } from '../stores/regex.js'
regex.setRegex(
  '(.*)'
)
</script>
<template>
  <!-- Regex Chooser -->
  <div class="field">
    <label class="label">Regex</label>
    <div class="select">
      <select v-model="regex.regex">
        <option
          disabled
          value=""
        >
          Please select
        </option>

        <option
          value="(.*)"
          :selected="true"
        >
          Whole page
        </option>
        <option
          value="Klasse: ([0-9][a-z])\s+(.+])\s+SBNR: (\d+)\s+([A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4})"
        >
          E-Book-Codes
        </option>
        <option
          value=""
        >
          Other
        </option>
      </select>
    </div>
  </div>

  <div class="field">
    <label class="label">Regex (only capturing groups will be included in the table)</label>
    <div class="control">
      <input
        v-model="regex.regex"
        class="input is-family-monospace"
        type="text"
        placeholder="Text input"
      >
    </div>
  </div>
</template>
