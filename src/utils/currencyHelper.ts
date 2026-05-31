/**
 * Currency configuration and formatting utilities
 * Supports different currencies based on country selection
 */

export interface CurrencyConfig {
  code: string;
  symbol: string;
  decimals: number;
  thousandsSeparator: string;
  decimalSeparator: string;
}

/**
 * Currency configurations by country
 */
const CURRENCY_CONFIG: Record<string, CurrencyConfig> = {
  // North America
  'United States': { code: 'USD', symbol: '$', decimals: 2, thousandsSeparator: ',', decimalSeparator: '.' },
  'Canada': { code: 'CAD', symbol: 'C$', decimals: 2, thousandsSeparator: ',', decimalSeparator: '.' },
  'Mexico': { code: 'MXN', symbol: '$', decimals: 2, thousandsSeparator: ',', decimalSeparator: '.' },

  // Europe
  'United Kingdom': { code: 'GBP', symbol: '£', decimals: 2, thousandsSeparator: ',', decimalSeparator: '.' },
  'Germany': { code: 'EUR', symbol: '€', decimals: 2, thousandsSeparator: '.', decimalSeparator: ',' },
  'France': { code: 'EUR', symbol: '€', decimals: 2, thousandsSeparator: ' ', decimalSeparator: ',' },
  'Spain': { code: 'EUR', symbol: '€', decimals: 2, thousandsSeparator: '.', decimalSeparator: ',' },
  'Italy': { code: 'EUR', symbol: '€', decimals: 2, thousandsSeparator: '.', decimalSeparator: ',' },
  'Netherlands': { code: 'EUR', symbol: '€', decimals: 2, thousandsSeparator: '.', decimalSeparator: ',' },
  'Belgium': { code: 'EUR', symbol: '€', decimals: 2, thousandsSeparator: '.', decimalSeparator: ',' },
  'Switzerland': { code: 'CHF', symbol: 'CHF', decimals: 2, thousandsSeparator: "'", decimalSeparator: '.' },
  'Austria': { code: 'EUR', symbol: '€', decimals: 2, thousandsSeparator: '.', decimalSeparator: ',' },
  'Turkey': { code: 'TRY', symbol: '₺', decimals: 2, thousandsSeparator: '.', decimalSeparator: ',' },

  // Asia Pacific
  'Japan': { code: 'JPY', symbol: '¥', decimals: 0, thousandsSeparator: ',', decimalSeparator: '.' },
  'India': { code: 'INR', symbol: '₹', decimals: 2, thousandsSeparator: ',', decimalSeparator: '.' },
  'China': { code: 'CNY', symbol: '¥', decimals: 2, thousandsSeparator: ',', decimalSeparator: '.' },
  'South Korea': { code: 'KRW', symbol: '₩', decimals: 0, thousandsSeparator: ',', decimalSeparator: '.' },
  'Singapore': { code: 'SGD', symbol: 'S$', decimals: 2, thousandsSeparator: ',', decimalSeparator: '.' },
  'Hong Kong': { code: 'HKD', symbol: 'HK$', decimals: 2, thousandsSeparator: ',', decimalSeparator: '.' },
  'Indonesia': { code: 'IDR', symbol: 'Rp', decimals: 0, thousandsSeparator: '.', decimalSeparator: ',' },
  'Malaysia': { code: 'MYR', symbol: 'RM', decimals: 2, thousandsSeparator: ',', decimalSeparator: '.' },
  'Thailand': { code: 'THB', symbol: '฿', decimals: 2, thousandsSeparator: ',', decimalSeparator: '.' },
  'Philippines': { code: 'PHP', symbol: '₱', decimals: 2, thousandsSeparator: ',', decimalSeparator: '.' },
  'Vietnam': { code: 'VND', symbol: '₫', decimals: 0, thousandsSeparator: '.', decimalSeparator: ',' },
  'Australia': { code: 'AUD', symbol: 'A$', decimals: 2, thousandsSeparator: ',', decimalSeparator: '.' },
  'New Zealand': { code: 'NZD', symbol: 'NZ$', decimals: 2, thousandsSeparator: ',', decimalSeparator: '.' },

  // South America
  'Brazil': { code: 'BRL', symbol: 'R$', decimals: 2, thousandsSeparator: '.', decimalSeparator: ',' },
  'Argentina': { code: 'ARS', symbol: '$', decimals: 2, thousandsSeparator: '.', decimalSeparator: ',' },

  // Middle East
  'Saudi Arabia': { code: 'SAR', symbol: 'ر.س', decimals: 2, thousandsSeparator: ',', decimalSeparator: '.' },
  'United Arab Emirates': { code: 'AED', symbol: 'د.إ', decimals: 2, thousandsSeparator: ',', decimalSeparator: '.' },
  'Qatar': { code: 'QAR', symbol: 'ر.ق', decimals: 2, thousandsSeparator: ',', decimalSeparator: '.' },
  'Kuwait': { code: 'KWD', symbol: 'د.ك', decimals: 3, thousandsSeparator: ',', decimalSeparator: '.' },
  'Bahrain': { code: 'BHD', symbol: '.د.ب', decimals: 3, thousandsSeparator: ',', decimalSeparator: '.' },
  'Oman': { code: 'OMR', symbol: 'ر.ع.', decimals: 3, thousandsSeparator: ',', decimalSeparator: '.' },
  'Israel': { code: 'ILS', symbol: '₪', decimals: 2, thousandsSeparator: ',', decimalSeparator: '.' },
  'Iraq': { code: 'IQD', symbol: 'ع.د', decimals: 0, thousandsSeparator: ',', decimalSeparator: '.' },
  'Iran': { code: 'IRR', symbol: 'ریال', decimals: 0, thousandsSeparator: ',', decimalSeparator: '.' },

  // Africa
  'Egypt': { code: 'EGP', symbol: '£', decimals: 2, thousandsSeparator: ',', decimalSeparator: '.' },
  'South Africa': { code: 'ZAR', symbol: 'R', decimals: 2, thousandsSeparator: ',', decimalSeparator: '.' },
  'Nigeria': { code: 'NGN', symbol: '₦', decimals: 2, thousandsSeparator: ',', decimalSeparator: '.' },
  'Kenya': { code: 'KES', symbol: 'KSh', decimals: 2, thousandsSeparator: ',', decimalSeparator: '.' },
  'Ghana': { code: 'GHS', symbol: '₵', decimals: 2, thousandsSeparator: ',', decimalSeparator: '.' },
  'Ethiopia': { code: 'ETB', symbol: 'Br', decimals: 2, thousandsSeparator: ',', decimalSeparator: '.' },
  'Tanzania': { code: 'TZS', symbol: 'TSh', decimals: 0, thousandsSeparator: ',', decimalSeparator: '.' },
  'Uganda': { code: 'UGX', symbol: 'USh', decimals: 0, thousandsSeparator: ',', decimalSeparator: '.' },
  'Rwanda': { code: 'RWF', symbol: 'FRw', decimals: 0, thousandsSeparator: ',', decimalSeparator: '.' },
  'Senegal': { code: 'XOF', symbol: 'CFA', decimals: 0, thousandsSeparator: ' ', decimalSeparator: ',' },
  'Ivory Coast': { code: 'XOF', symbol: 'CFA', decimals: 0, thousandsSeparator: ' ', decimalSeparator: ',' },
  'Cameroon': { code: 'XAF', symbol: 'FCFA', decimals: 0, thousandsSeparator: ' ', decimalSeparator: ',' },
  'Morocco': { code: 'MAD', symbol: 'د.م.', decimals: 2, thousandsSeparator: ' ', decimalSeparator: ',' },
  'Algeria': { code: 'DZD', symbol: 'د.ج', decimals: 2, thousandsSeparator: ' ', decimalSeparator: ',' },
  'Tunisia': { code: 'TND', symbol: 'د.ت', decimals: 3, thousandsSeparator: ' ', decimalSeparator: ',' },
  'Libya': { code: 'LYD', symbol: 'ل.د', decimals: 3, thousandsSeparator: ',', decimalSeparator: '.' },
  'Sudan': { code: 'SDG', symbol: 'ج.س.', decimals: 2, thousandsSeparator: ',', decimalSeparator: '.' },
  'Jordan': { code: 'JOD', symbol: 'د.ا', decimals: 3, thousandsSeparator: ',', decimalSeparator: '.' },
  'Lebanon': { code: 'LBP', symbol: 'ل.ل', decimals: 0, thousandsSeparator: ',', decimalSeparator: '.' },

  // South Asia
  'Pakistan': { code: 'PKR', symbol: '₨', decimals: 0, thousandsSeparator: ',', decimalSeparator: '.' },
  'Bangladesh': { code: 'BDT', symbol: '৳', decimals: 2, thousandsSeparator: ',', decimalSeparator: '.' },
  'Sri Lanka': { code: 'LKR', symbol: 'Rs', decimals: 2, thousandsSeparator: ',', decimalSeparator: '.' },
  'Nepal': { code: 'NPR', symbol: '₨', decimals: 2, thousandsSeparator: ',', decimalSeparator: '.' },
  'Afghanistan': { code: 'AFN', symbol: '؋', decimals: 2, thousandsSeparator: ',', decimalSeparator: '.' },

  // Default
  'Other': { code: 'USD', symbol: '$', decimals: 2, thousandsSeparator: ',', decimalSeparator: '.' },
};

/**
 * Get currency configuration for a country
 */
export function getCurrencyConfig(country: string): CurrencyConfig {
  return CURRENCY_CONFIG[country] || CURRENCY_CONFIG['United States'];
}

/**
 * Get currency symbol for a country
 */
export function getCurrencySymbol(country: string): string {
  return getCurrencyConfig(country).symbol;
}

/**
 * Get decimal places for a country
 */
export function getCurrencyDecimals(country: string): number {
  return getCurrencyConfig(country).decimals;
}

/**
 * Format a number for display in the input field
 * Only applies formatting when the value is being displayed (not for editing)
 */
export function formatCurrencyInput(value: number | undefined, currencyCode: string): string {
  if (value === undefined || value === null || value === 0) return '';

  const config = Object.values(CURRENCY_CONFIG).find(c => c.code === currencyCode) || CURRENCY_CONFIG['USD'];

  const parts = value.toFixed(config.decimals).split('.');
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, config.thousandsSeparator);

  if (config.decimals === 0) {
    return integerPart;
  }

  return `${integerPart}${config.decimalSeparator}${parts[1]}`;
}

/**
 * Parse user input by removing formatting characters
 * Returns the raw numeric value
 */
export function parseCurrencyInput(input: string, currencyCode: string): number {
  if (!input || input.trim() === '') return 0;

  const config = Object.values(CURRENCY_CONFIG).find(c => c.code === currencyCode) || CURRENCY_CONFIG['USD'];

  // Remove all non-numeric characters except decimal separator
  let numericString = input.replace(/[^\d.-]/g, '');

  // Handle negative values
  const isNegative = numericString.startsWith('-');
  numericString = numericString.replace(/-/g, '');

  if (numericString === '') return 0;

  let value = parseFloat(numericString);

  if (isNaN(value)) return 0;

  return isNegative ? -value : value;
}
