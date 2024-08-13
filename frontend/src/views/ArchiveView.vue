<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

const route = useRoute();
const router = useRouter()
const fileHash = ref(route.params.hash)
const mode = ref('dom')
const metaData = ref({})
const headersData = ref({})

const changeMode = (v) => {
    mode.value = v
}

const getMeta = async () => {
    try {
        const res = await fetch('http://localhost:3000/read/metadata?hash=' + route.params.hash)
        metaData.value = await res.json()
    }
    catch (err) {
        console.error(err)
    }
}

const getHeaders = async () => {
    try {
        const res = await fetch('http://localhost:3000/read/headers?hash=' + route.params.hash)
        headersData.value = await res.json()
    }
    catch (err) {
        console.error(err)
    }
}

const deleteEntry = async () => {
    try {
        const res = await fetch('http://localhost:3000/delete?hash=' + route.params.hash)
        if (res.ok || res.status === 204) {
            router.push({path: '/'})
        }
    }
    catch (err) {
        console.error(err)
    }
}

onMounted(getMeta)
onMounted(getHeaders)
</script>

<template>
    {{ previewUrl }}
    <div>
        <h1 class="subtitle">Archive: {{ fileHash }}</h1>
        <div>
            <b>Title:</b> {{ metaData.title }} / <b>Cached:</b> {{ new Date(metaData.timestamp * 1000).toLocaleString() }}
        </div>
        <hr>
        <div class="mb-4">
            <button class="button is-small mr-4" @click="changeMode('dom')">DOM View</button>
            <button class="button is-small mr-4" @click="changeMode('readability')">Reader View</button>
            <button class="button is-small" @click="deleteEntry()">Delete</button>
        </div>
        <div class="frame">
            <iframe frameborder="0" height="800" scrolling="yes" :src="'http://localhost:3000/read/' + mode + '?hash=' + route.params.hash"></iframe>
        </div>
        <table class="table is-fullwidth mt-4">
            <tr>
                <th>Header</th>
                <th>Value</th>
            </tr>
            <tr v-for="(v, h) in headersData">
                <td>{{ h }}</td>
                <td><code>{{ v }}</code></td>
            </tr>
        </table>
    </div>
</template>
<style scoped>
h1.subtitle {
    margin-bottom: 0 ;
}
div.frame {
    background-color: #777;
}

iframe {
    padding: 1rem;
    width: 100%;
}

th, td {
    font-size: .85rem;
}
</style>