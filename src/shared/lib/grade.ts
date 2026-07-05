const GRADE_LABELS: Record<string, string> = {
  '4_primaria': '4º Primaria',
};

export function formatGradeLevel(gradeLevel: string): string {
  return GRADE_LABELS[gradeLevel] ?? gradeLevel.replaceAll('_', ' ');
}
