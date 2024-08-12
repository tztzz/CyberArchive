<script setup>
import { RouterLink } from 'vue-router'
</script>
<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <RouterLink to="/" class="navbar-item">CyberArchive</RouterLink>
      <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>
    <div class="navbar-menu">
      <div class="navbar-start">
        <RouterLink to="/add" class="navbar-item">Add URL</RouterLink>
      </div>
      <div class="navbar-end">
        <span>v.0.1</span>
      </div>
    </div>
  </nav>
</template>
