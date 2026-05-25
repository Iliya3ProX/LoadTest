<template>
  <div class="container">
    <div v-if="balanceStore.error" class="error">
      {{ balanceStore.error }}
    </div>

    <div v-if="balanceStore.loading && !balanceStore.selectedBalance" class="loading">
      Загрузка...
    </div>

    <div v-if="!balanceStore.loading && balanceStore.selectedBalance" class="card">
      <h2>Детали баланса</h2>
      <p>
        <strong>Текущий баланс:</strong>
        <span :class="balanceStore.selectedBalance.amount >= 0 ? 'balance-positive' : 'balance-negative'">
          {{ formatAmount(balanceStore.selectedBalance.amount) }}
        </span>
      </p>

      <div class="actions" style="margin: 20px 0; display: flex; gap: 10px;">
        <button class="btn btn-success" @click="showDepositModal = true">Пополнить</button>
        <button class="btn btn-danger" @click="showExpenseModal = true">Списать</button>
        <button class="btn btn-primary" @click="trimBalance">Обрезать</button>
        <router-link to="/" class="btn">Назад к списку</router-link>
      </div>

      <h3>История операций</h3>
      <table class="table">
        <thead>
          <tr>
            <th>Тип</th>
            <th>Сумма</th>
            <th>Sequence</th>
            <th>Время</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="op in balanceStore.selectedBalance.operations" :key="op.id">
            <td>{{ op.type }}</td>
            <td :class="op.amount >= 0 ? 'balance-positive' : 'balance-negative'">
              {{ formatAmount(op.amount) }}
            </td>
            <td>{{ op.sequenceNumber }}</td>
            <td>{{ formatDate(op.created) }}</td>
          </tr>
        </tbody>
      </table>

      <div v-if="balanceStore.selectedBalance.operations.length === 0" class="loading">
        Операций пока нет
      </div>
    </div>

    <!-- Modal для депозита -->
    <div v-if="showDepositModal" class="modal-overlay" @click.self="showDepositModal = false">
      <div class="modal">
        <h2>Пополнить баланс</h2>
        <div class="form-group">
          <label for="depositAmount">Сумма пополнения</label>
          <input 
            id="depositAmount"
            type="number" 
            v-model.number="depositAmount" 
            placeholder="Введите сумму"
          />
        </div>
        <div class="modal-actions">
          <button class="btn" @click="showDepositModal = false">Отмена</button>
          <button class="btn btn-success" @click="doDeposit" :disabled="balanceStore.loading">
            Пополнить
          </button>
        </div>
      </div>
    </div>

    <!-- Modal для расхода -->
    <div v-if="showExpenseModal" class="modal-overlay" @click.self="showExpenseModal = false">
      <div class="modal">
        <h2>Списать средства</h2>
        <div class="form-group">
          <label for="expenseAmount">Сумма списания</label>
          <input 
            id="expenseAmount"
            type="number" 
            v-model.number="expenseAmount" 
            placeholder="Введите сумму"
          />
        </div>
        <div class="modal-actions">
          <button class="btn" @click="showExpenseModal = false">Отмена</button>
          <button class="btn btn-danger" @click="doExpense" :disabled="balanceStore.loading">
            Списать
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useBalanceStore } from '@/stores/balance';

const route = useRoute();
const balanceStore = useBalanceStore();

const showDepositModal = ref(false);
const showExpenseModal = ref(false);
const depositAmount = ref(0);
const expenseAmount = ref(0);

const balanceId = computed(() => route.params.id as string);

function formatAmount(amount: number): string {
  return amount.toFixed(2);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString('ru-RU');
}

async function loadBalance() {
  await balanceStore.fetchBalanceById(balanceId.value);
}

onMounted(() => {
  loadBalance();
});

watch(() => route.params.id, () => {
  loadBalance();
});

async function doDeposit() {
  try {
    await balanceStore.deposit(balanceId.value, depositAmount.value);
    showDepositModal.value = false;
    depositAmount.value = 0;
  } catch (e) {
    // Ошибка уже обработана в store
  }
}

async function doExpense() {
  try {
    await balanceStore.expense(balanceId.value, expenseAmount.value);
    showExpenseModal.value = false;
    expenseAmount.value = 0;
  } catch (e) {
    // Ошибка уже обработана в store
  }
}

async function trimBalance() {
  try {
    await balanceStore.trim(balanceId.value);
  } catch (e) {
    // Ошибка уже обработана в store
  }
}
</script>
