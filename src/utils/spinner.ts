import { createSpinner as createNanospinner } from 'nanospinner';

export function createSpinner(text: string) {
  return createNanospinner(text);
}