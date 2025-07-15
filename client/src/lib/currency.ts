// Using direct API calls instead of package due to import issues

export interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
}

export const supportedCurrencies: CurrencyInfo[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
];

export async function getExchangeRate(fromCurrency: string, toCurrency: string): Promise<number> {
  try {
    // Use fetch directly to avoid import issues
    const response = await fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${fromCurrency.toLowerCase()}.json`);
    const data = await response.json();
    const rate = data[fromCurrency.toLowerCase()][toCurrency.toLowerCase()];
    return rate || 1;
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    // Fallback rates (approximate)
    const fallbackRates: Record<string, Record<string, number>> = {
      'USD': { 'INR': 86, 'EUR': 0.85, 'GBP': 0.75, 'JPY': 110, 'CAD': 1.25, 'AUD': 1.35 },
      'INR': { 'USD': 0.012, 'EUR': 0.01, 'GBP': 0.009, 'JPY': 1.28, 'CAD': 0.015, 'AUD': 0.016 },
    };
    
    return fallbackRates[fromCurrency.toUpperCase()]?.[toCurrency.toUpperCase()] || 1;
  }
}

export function formatCurrency(amount: number, currency: string): string {
  const currencyInfo = supportedCurrencies.find(c => c.code === currency);
  const symbol = currencyInfo?.symbol || currency;
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: currency === 'JPY' ? 0 : 2,
    maximumFractionDigits: currency === 'JPY' ? 0 : 2,
  }).format(amount).replace(/^[A-Z]{3}/, symbol);
}

export function detectUserCurrency(): string {
  try {
    const userLocale = navigator.language || 'en-US';
    const localeMap: Record<string, string> = {
      'en-US': 'USD',
      'en-GB': 'GBP', 
      'en-CA': 'CAD',
      'en-AU': 'AUD',
      'en-IN': 'INR',
      'hi-IN': 'INR',
      'ja-JP': 'JPY',
      'de-DE': 'EUR',
      'fr-FR': 'EUR',
      'es-ES': 'EUR',
      'it-IT': 'EUR',
    };
    
    return localeMap[userLocale] || 'USD';
  } catch (error) {
    return 'USD';
  }
}