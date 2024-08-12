<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

const data = ref()

async function getEntries() {
  try {
    const res = await fetch('http://localhost:3000/entries')

    if (!res.ok) {
      throw new Error(`error: ${res.status}`);
    }
    data.value = await res.json();
  }
  catch (err) {
    error.value = err.message;
  }
}

onMounted(getEntries);
</script>
<template>
  <div>
    <h1 class="subtitle">Index</h1>
    <hr>
    <table class="table is-fullwidth is-bordered">
      <tr>
        <th></th>
        <th>URL</th>
        <th>Hash</th>
      </tr>
      <tr v-for="d in data">
        <td>
          <img :src="'http://localhost:3000/read/favicon?hash=' + d.hashident">
        </td>
        <td><RouterLink :to="'archive/' + d.hashident">{{ d.url }}</RouterLink></td>
        <td>
          <span class="tag">{{ d.hashident }}</span>
        </td>
      </tr>
    </table>
  </div>
</template>