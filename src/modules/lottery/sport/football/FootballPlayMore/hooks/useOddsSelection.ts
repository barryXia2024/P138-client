import {useState, useCallback} from 'react';

export const useOddsSelection = (initialSelection: string[] = []) => {
  const [selectedOdds, setSelectedOdds] = useState<string[]>(initialSelection);

  const toggleOddsSelection = useCallback((oddsCellKey: string) => {
    setSelectedOdds(prev =>
      prev.includes(oddsCellKey)
        ? prev.filter(key => key !== oddsCellKey)
        : [...prev, oddsCellKey],
    );
  }, []);

  const isOddsSelected = useCallback((oddsCellKey: string) => {
    return selectedOdds.includes(oddsCellKey);
  }, [selectedOdds]);

  const resetSelection = useCallback(() => {
    setSelectedOdds([]);
  }, []);

  const setSelection = useCallback((selection: string[]) => {
    setSelectedOdds(selection);
  }, []);

  return {
    selectedOdds,
    toggleOddsSelection,
    isOddsSelected,
    resetSelection,
    setSelection,
  };
}; 