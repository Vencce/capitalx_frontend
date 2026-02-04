<script setup>
import { onMounted } from 'vue'
import { useConfigStore } from './stores/config'

const configStore = useConfigStore()

onMounted(() => {
  configStore.fetchConfig()
})
</script>

<template>
  <router-view />
</template>