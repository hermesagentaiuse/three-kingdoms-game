// ============================================
// UI Slice — UI 狀態（結果訊息、changeLog）
// ============================================
export type ResultType = 'success' | 'failure' | 'partial' | 'neutral';

export interface UISlice {
  resultMessage: string | null;
  resultType: ResultType | null;
  showResult: boolean;
  changeLog: string[] | null;
  setResult: (message: string, type: ResultType, log?: string[] | null) => void;
  clearResult: () => void;
}

export const createUISlice = (set: any, get: any): UISlice => ({
  resultMessage: null,
  resultType: null,
  showResult: false,
  changeLog: null,

  setResult: (message: string, type: ResultType, log: string[] | null = null) => {
    set({
      resultMessage: message,
      resultType: type,
      showResult: true,
      changeLog: log,
    });
  },

  clearResult: () => {
    set({
      resultMessage: null,
      resultType: null,
      showResult: false,
      changeLog: null,
    });
  },
});
