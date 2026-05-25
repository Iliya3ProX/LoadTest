<template>
  <div class="container">
    <div class="card">
      <div v-if="balanceStore.error" class="error">
        {{ balanceStore.error }}
      </div>

      <div v-if="balanceStore.loading" class="loading">
        Загрузка...
      </div>

      <div v-else class="table-wrapper">
        <table class="table">
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
      </div>

      <div v-if="!balanceStore.loading && balanceStore.balances.length === 0" class="loading">
        Балансов пока нет. Создайте первый!
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBalanceStore } from '@/stores/balance';

const balanceStore = useBalanceStore();

function formatAmount(amount: number): string {
  return amount.toFixed(2);
}
</script>
