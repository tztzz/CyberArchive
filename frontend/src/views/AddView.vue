<script setup>
import { ref } from 'vue'

const url = ref()
const submitted = ref(false)

const addUrl = async () => {
  console.log(url.value)

  try {
    const res = await fetch('http://localhost:3000/archive?url=' + url.value)

    if (!res.ok) {
      throw new Error(`error: ${res.status}`);
    }
    data.value = await res.json();
  }
  catch (err) {
    error.value = err.message;
  }
  finally {
    submitted.value = true
  }
}
</script>
<template>
  <div>
    <h1 class="subtitle">Add URL </h1>
    <hr>
    <input type="text" class="input" placeholder="Enter an URL .." v-model="url" />
    <button class="button mt-4" @click="addUrl()">Submit</button>
    <article class="message is-primary" v-if="submitted">
      <div class="message-body mt-4">
        [!] Request submitted.
      </div>
    </article>
  </div>
</template>