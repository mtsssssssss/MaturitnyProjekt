export type ChartSubjectItem = { name: string; uspesnost: number };

type WithSubjectAndScore = { subjectName?: string; totalScorePercentage: number };

export function aggregateBySubject<T extends WithSubjectAndScore>(
  data: T[]
): ChartSubjectItem[] {
  if (!data?.length) return [];
  const names = [...new Set(data.map((a) => a.subjectName || "–"))];
  return names.map((name) => {
    const items = data.filter((a) => (a.subjectName || "–") === name);
    const sum = items.reduce((s, a) => s + Number(a.totalScorePercentage.toFixed(1)), 0);
    const uspesnost = Math.round((sum / items.length) * 10) / 10;
    return { name, uspesnost };
  });
}
