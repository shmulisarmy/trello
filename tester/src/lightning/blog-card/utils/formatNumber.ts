// Helper function to format numbers (e.g., 3000 -> 3k)
export function formatNumber(num: number): string {
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'k';
    }
    return num.toString();
  }
  