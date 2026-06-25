export type Verdict = 'FAKE' | 'SUSPICIOUS' | 'UNCERTAIN' | 'CREDIBLE';

export interface Signal {
  type: 'warning' | 'positive' | 'neutral';
  label: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
}

export interface KeyWord {
  word: string;
  weight: number;
}

export interface TextFeatures {
  word_count: number;
  sentence_count: number;
  avg_sentence_length: number;
  sensational_words: number;
  credible_indicators: number;
  exclamation_marks: number;
  caps_ratio: number;
  question_marks: number;
}

export interface AnalysisResult {
  id: string;
  title: string;
  source: string | null;
  url: string | null;
  verdict: Verdict;
  fake_score: number;
  real_score: number;
  confidence: number;
  features: TextFeatures;
  signals: Signal[];
  important_words: KeyWord[];
  preprocessed_length: number;
  timestamp: string;
}

export interface StatsData {
  total_analyzed: number;
  verdict_distribution: Record<string, number>;
  avg_confidence: number;
  avg_fake_score: number;
  recent_trend: Array<{
    title: string;
    verdict: Verdict;
    fake_score: number;
    timestamp: string;
  }>;
  signal_frequency: Record<string, number>;
  fake_count: number;
  credible_count: number;
  suspicious_count: number;
}

export interface HistoryResponse {
  total: number;
  items: AnalysisResult[];
  limit: number;
  skip: number;
}
