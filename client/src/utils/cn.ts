/**
 * Class Name Utility (cn)
 * Combines class names with clsx for conditional styling
 */

import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
