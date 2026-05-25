<template>
  <div id="app">
    <nav class="navbar">
      <div class="navbar-container">
        <h1>Сервис балансов</h1>
        <div class="navbar-menu">
          <router-link to="/" class="nav-link">Список балансов</router-link>
          <button class="btn btn-primary" @click="showCreateModal = true">
            Создать баланс
          </button>
        </div>
      </div>
    </nav>
    <router-view />

    <!-- Modal для создания баланса -->
    <div v-if="showCreateModal" class="modal-overlay" @click.self="showCreateModal = false">
      <div class="modal">
        <h2>Создать новый баланс</h2>
        <div class="form-group">
          <label for="initialAmount">Начальная сумма</label>
          <input 
            id="initialAmount"
            type="number" 
            v-model.number="newBalanceAmount" 
            placeholder="0"
          />
        </div>
        <div class="modal-actions">
          <button class="btn" @click="showCreateModal = false">Отмена</button>
          <button class="btn btn-success" @click="createBalance" :disabled="loading">
            Создать
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useBalanceStore } from '@/stores/balance';

const router = useRouter();
const balanceStore = useBalanceStore();

const showCreateModal = ref(false);
const newBalanceAmount = ref<number | null>(null);
const loading = ref(false);

onMounted(() => {
  balanceStore.fetchBalances();
});

async function createBalance() {
  loading.value = true;
  try {
    const id = await balanceStore.createBalance(newBalanceAmount.value);
    showCreateModal.value = false;
    newBalanceAmount.value = null;
    router.push(`/balance/${id}`);
  } catch (e) {
    // Ошибка уже обработана в store
  } finally {
    loading.value = false;
  }
}
</script>

<style>
@import '@/assets/main.css';
</style>
