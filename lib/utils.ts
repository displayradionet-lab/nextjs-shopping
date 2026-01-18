import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatNumberWithDecimal = (num: number): string => {
  const [int, decimal] = num.toString().split('.');
  return decimal ? `${int}.${decimal.padEnd(2, '0')}` : int;
};

// PROMPT: [ChatGTP] create toSlug ts arrow function that convert text to lowercase, remove  non-word,
// non-whitespace, non-hyphen characters, and replace all sequences of multiple hyphens with a single hyphen

export const toSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]+/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');
};

const CURRENCY_FORMATTER = Intl.NumberFormat('en-US', {
  currency: 'USD',
  style: 'currency',
  minimumFractionDigits: 2,
});

export function formatCurrency(amount: number) {
  return CURRENCY_FORMATTER.format(amount);
}

const NUMBER_FORMATTER = new Intl.NumberFormat('en-US');
export function formatNumber(number: number) {
  return NUMBER_FORMATTER.format(number);
}

export const round2 = (num: number) =>
  Math.round((num + Number.EPSILON) * 100) / 100;

export const generateId = () =>
  Array.from({ length: 24 }, () => Math.floor(Math.random() * 10)).join('');

export const formatError = (error: any): string => {
  if (error.name === 'ZodError' && error.errors) {
    console.log('ZodError details:', error.errors);
    const fieldErrors = Object.keys(error.errors).map((field) => {
      const errorMessage = error.errors[field].message;
      return `${error.errors[field].path}: ${errorMessage}`;
    });
    return fieldErrors.join('. ');
  } else if (error.name === 'ValidationError' && error.errors) {
    console.log('ValidationError details:', error.errors);
    const fieldErrors = Object.keys(error.errors).map((field) => {
      const errorMessage = error.errors[field].message;
      return errorMessage;
    });
    return fieldErrors.join('. ');
  } else if (error.code === 11000) {
    const duplicateField = Object.keys(error.keyValue)[0];
    return `${duplicateField} already exists`;
  } else {
    console.log('Generic error:', error);
    return error.message || 'An unknown error occurred';
  }
};

export function calculateFutureDate(days: number) {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + days);
  return currentDate;
}

export function getMonthName(yearAndMonth: string) {
  const [year, monthNumber] = yearAndMonth.split('-');
  const date = new Date();
  date.setMonth(parseInt(monthNumber) - 1);
  return new Date().getMonth() === parseInt(monthNumber) - 1
    ? `${date.toLocaleString('default', { month: 'long' })} (ongoing)`
    : date.toLocaleString('default', { month: 'long' });
}

export function calculatePastDate(days: number) {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - days);
  return currentDate;
}

export function timeUntilMidnight(): { hours: number; minutes: number } {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);

  const diff = midnight.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return { hours, minutes };
}

export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    year: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };
  const dateOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    year: 'numeric',
    day: 'numeric',
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };
  const formatterDateTime: string = new Date(dateString).toLocaleString(
    'en-US',
    dateTimeOptions
  );
  const formatterDate: string = new Date(dateString).toLocaleString(
    'en-US',
    dateOptions
  );
  const formatterTime: string = new Date(dateString).toLocaleString(
    'en-US',
    timeOptions
  );
  return {
    dateTime: formatterDateTime,
    dateOnly: formatterDate,
    timeOnly: formatterTime,
  };
};
