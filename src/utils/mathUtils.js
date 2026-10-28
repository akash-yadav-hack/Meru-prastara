// Sanskrit Prosody and Mathematical utilities for Meru Prastara (Pingala Chhandas-shastra)

// Memoized factorial and combinations C(n, k)
const factCache = {};
export function factorial(n) {
  if (n <= 1) return 1;
  if (factCache[n]) return factCache[n];
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  factCache[n] = res;
  return res;
}

export function nCr(n, r) {
  if (r < 0 || r > n) return 0;
  if (r === 0 || r === n) return 1;
  if (r > n / 2) r = n - r;
  let res = 1;
  for (let i = 1; i <= r; i++) {
    res = (res * (n - i + 1)) / i;
  }
  return Math.round(res);
}

// Generate all combinations of length n with exactly k Laghus ('L') and (n - k) Gurus ('G')
// Pingala's Prastara convention:
// L = Laghu (short syllable, 1 matra)
// G = Guru (long syllable, 2 matras)
export function generateProsodyCombinations(n, k) {
  if (n === 0) return ['-'];
  const results = [];

  function backtrack(currentStr, laghuRemaining, guruRemaining) {
    if (laghuRemaining === 0 && guruRemaining === 0) {
      results.push(currentStr);
      return;
    }
    // Pingala convention often prioritizes Laghu (L) then Guru (G)
    if (laghuRemaining > 0) {
      backtrack(currentStr + 'L', laghuRemaining - 1, guruRemaining);
    }
    if (guruRemaining > 0) {
      backtrack(currentStr + 'G', laghuRemaining, guruRemaining - 1);
    }
  }

  backtrack('', k, n - k);
  return results;
}

// Virahanka-Fibonacci sequence generator for Matra Meru
// F(1)=1, F(2)=1, F(3)=2, F(4)=3, F(5)=5, F(6)=8, F(7)=13, F(8)=21, F(9)=34, F(10)=55
export function getFibonacciSequence(length = 12) {
  const fib = [1, 1];
  while (fib.length < length) {
    fib.push(fib[fib.length - 1] + fib[fib.length - 2]);
  }
  return fib;
}

// Check which shallow diagonal a block (n, k) belongs to:
// In Pascal's triangle, the sum along shallow diagonals n - k = d (or n + k) yields Fibonacci.
// Specifically: for diagonal index m (starting at m = 0):
// elements are (n, k) where n + k is fixed OR standard formulation:
// F(m+1) = sum over k of C(m - k, k) where m >= 2k.
// So block (row, col) belongs to diagonal d = row + col.
export function getDiagonalIndex(row, col) {
  return row + col;
}

// Color palette for shallow Fibonacci diagonals
export const FIB_DIAGONAL_COLORS = [
  '#f43f5e', // rose
  '#f97316', // orange
  '#eab308', // amber
  '#10b981', // emerald
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#14b8a6', // teal
  '#a855f7', // purple
  '#f59e0b', // gold
  '#6366f1', // indigo
];
