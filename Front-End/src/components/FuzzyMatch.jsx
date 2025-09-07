export function norm(s = '') {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
}

function levenshtein(a = '', b = '') {
  const m = a.length, n = b.length;
  if (!m) return n; if (!n) return m;
  const dp = Array.from({ length: m + 1 }, (_, i) => [i]);
  for (let j = 1; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,                  
        dp[i][j - 1] + 1,                  
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1) 
      );
    }
  }
  return dp[m][n];
}

export function fuzzyMatch(term, text) {
  const t = norm(term);
  const s = norm(text);
  if (!t) return true;
  if (s.includes(t)) return true; 
  const limiar = t.length <= 4 ? 1 : t.length <= 7 ? 2 : 3;
  for (let i = 0; i <= Math.max(0, s.length - t.length); i++) {
    const janela = s.slice(i, i + t.length);
    if (levenshtein(t, janela) <= limiar) return true;
  }
  return false;
}