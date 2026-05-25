import { defineStore } from 'pinia';
import { ref } from 'vue';
import { balanceApi } from '@/api/balance';
import type { Balance, BalanceList } from '@/types/api';

export const useBalanceStore = defineStore('balance', () => {
  const balances = ref<BalanceList[]>([]);
  const selectedBalance = ref<Balance | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchBalances() {
    loading.value = true;
    error.value = null;
    try {
      balances.value = await balanceApi.getAll();
    } catch (e) {
      error.value = 'Ошибка при загрузке балансов';
      console.error(e);
    } finally {
      loading.value = false;
    }
  }

  async function fetchBalanceById(id: string) {
    loading.value = true;
    error.value = null;
    try {
      selectedBalance.value = await balanceApi.getById(id);
    } catch (e) {
      error.value = 'Ошибка при загрузке баланса';
      console.error(e);
    } finally {
      loading.value = false;
    }
  }

  async function createBalance(initialAmount: number | null) {
    loading.value = true;
    error.value = null;
    try {
      const id = await balanceApi.create({ initialAmount });
      await fetchBalances();
      return id;
    } catch (e) {
      error.value = 'Ошибка при создании баланса';
      console.error(e);
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function deposit(id: string, amount: number) {
    loading.value = true;
    error.value = null;
    try {
      await balanceApi.deposit(id, { amount });
      await fetchBalanceById(id);
      await fetchBalances();
    } catch (e) {
      error.value = 'Ошибка при внесении средств';
      console.error(e);
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function expense(id: string, amount: number) {
    loading.value = true;
    error.value = null;
    try {
      await balanceApi.expense(id, { amount });
      await fetchBalanceById(id);
      await fetchBalances();
    } catch (e) {
      error.value = 'Ошибка при списании средств';
      console.error(e);
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function trim(id: string) {
    loading.value = true;
    error.value = null;
    try {
      await balanceApi.trim(id);
      await fetchBalanceById(id);
      await fetchBalances();
    } catch (e) {
      error.value = 'Ошибка при обрезке баланса';
      console.error(e);
      throw e;
    } finally {
      loading.value = false;
    }
  }

  function clearSelectedBalance() {
    selectedBalance.value = null;
  }

  return {
    balances,
    selectedBalance,
    loading,
    error,
    fetchBalances,
    fetchBalanceById,
    createBalance,
    deposit,
    expense,
    trim,
    clearSelectedBalance
  };
});
