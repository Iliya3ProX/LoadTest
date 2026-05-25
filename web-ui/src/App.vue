<template>
  <div id="app">
    <nav class="navbar">
      <div class="container">
        <h1>Balance Service</h1>
      </div>
    </nav>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useBalanceStore } from '@/stores/balance';

const balanceStore = useBalanceStore();

onMounted(() => {
  balanceStore.fetchBalances();
});
</script>

<style>
@import '@/assets/main.css';
</style>
