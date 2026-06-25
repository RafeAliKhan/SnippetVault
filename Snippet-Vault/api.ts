import axios from 'axios';
import type { AnalysisResult, StatsData, HistoryResponse } from '../types';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

export const analyzeArticle = async (
  title: string,
  content: string,
  source?: string,
  url?: string
): Promise<AnalysisResult> => {
  const { data } = await api.post<AnalysisResult>('/analyze', { title, content, source, url });
  return data;
};

export const getHistory = async (limit = 20, skip = 0): Promise<HistoryResponse> => {
  const { data } = await api.get<HistoryResponse>('/history', { params: { limit, skip } });
  return data;
};

export const getStats = async (): Promise<StatsData> => {
  const { data } = await api.get<StatsData>('/stats');
  return data;
};

export const clearHistory = async (): Promise<void> => {
  await api.delete('/history');
};
