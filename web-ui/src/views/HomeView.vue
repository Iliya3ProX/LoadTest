<template>
  <div class="container">
    <div class="card">
      <h2>Список балансов</h2>

      <div v-if="balanceStore.error" class="error">
        {{ balanceStore.error }}
      </div>

      <button class="btn btn-primary" @click="showCreateModal = true">
        Создать баланс
      </button>

      <div v-if="balanceStore.loading" class="loading">
        Загрузка...
      </div>

      <table v-else class="table">
        <thead>
          <tr>
            <th>Баланс</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="balance in balanceStore.balances" :key="balance.id">
            <td :class="balance.amount >= 0 ? 'balance-positive' : 'balance-negative'">
              {{ formatAmount(balance.amount) }}
            </td>
            <td>
              <div class="actions-cell">
                <router-link 
                  :to="`/balance/${balance.id}`" 
                  class="btn btn-primary"
                >
                  Открыть
                </router-link>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="!balanceStore.loading && balanceStore.balances.length === 0" class="loading">
        Балансов пока нет. Создайте первый!
      </div>
    </div>

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
          <button class="btn btn-success" @click="createBalance" :disabled="balanceStore.loading">
            Создать
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useBalanceStore } from '@/stores/balance';

const router = useRouter();
const balanceStore = useBalanceStore();

const showCreateModal = ref(false);
const newBalanceAmount = ref<number | null>(null);

function formatAmount(amount: number): string {
  return amount.toFixed(2);
}

async function createBalance() {
  try {
    const id = await balanceStore.createBalance(newBalanceAmount.value);
    showCreateModal.value = false;
    newBalanceAmount.value = null;
    router.push(`/balance/${id}`);
  } catch (e) {
    // Ошибка уже обработана в store
  }
}
</script>
