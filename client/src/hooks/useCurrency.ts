import { useState, useEffect, useCallback } from 'react';
import { getExchangeRate, formatCurrency, detectUserCurrency } from '@/lib/currency';

export function useCurrency() {
  const [selectedCurrency, setSelectedCurrency] = useState<string>(() => detectUserCurrency());
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchExchangeRate = useCallback(async (currency: string) => {
    if (currency === 'USD') {
      setExchangeRates(prev => ({ ...prev, USD: 1 }));
      return;
    }

    setIsLoading(true);
    try {
      const rate = await getExchangeRate('USD', currency);
      setExchangeRates(prev => ({ ...prev, [currency]: rate }));
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExchangeRate(selectedCurrency);
  }, [selectedCurrency, fetchExchangeRate]);

  const convertPrice = (usdPrice: number, targetCurrency: string = selectedCurrency): number => {
    const rate = exchangeRates[targetCurrency] || 1;
    return usdPrice * rate;
  };

  const formatPrice = (usdPrice: number, targetCurrency: string = selectedCurrency): string => {
    const convertedPrice = convertPrice(usdPrice, targetCurrency);
    return formatCurrency(convertedPrice, targetCurrency);
  };

  return {
    selectedCurrency,
    setSelectedCurrency,
    exchangeRates,
    isLoading,
    convertPrice,
    formatPrice
  };
}