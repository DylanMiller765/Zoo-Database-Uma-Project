"use client";
import { UnifiedTransaction } from "@/types/transaction.types";
import apiClient from "@/lib/api";


export const transactionService = {
    getAll: async (): Promise<UnifiedTransaction[]> => {
        const response = await apiClient.get<UnifiedTransaction[]>('/transactions');
        return response.data;
    }
};
