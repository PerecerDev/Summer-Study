import type { GeneratedExercise } from '../schemas/rounds.js';

const TOPICS = [
  'numeros_operaciones',
  'fracciones_basicas',
  'geometria_plana',
  'medidas',
  'problemas_aritmeticos',
] as const;

function difficultyForIndex(index: number): 'easy' | 'medium' | 'hard' {
  if (index % 5 === 4) return 'hard';
  if (index % 2 === 0) return 'easy';
  return 'medium';
}

function buildExercise(index: number): GeneratedExercise {
  const difficulty = difficultyForIndex(index);
  const topicTag = TOPICS[index % TOPICS.length];
  const a = 2 + (index % 8);
  const b = 3 + ((index * 2) % 6);

  switch (index % 4) {
    case 0: {
      const sum = a + b;
      const wrong1 = String(sum + 1);
      const wrong2 = String(sum - 1);
      const wrong3 = String(sum + 2);
      const correct = String(sum);
      const options = [correct, wrong1, wrong2, wrong3].sort(() => (index % 2 === 0 ? -1 : 1));

      return {
        orderIndex: index,
        type: 'multiple_choice',
        question: `Ejercicio ${index + 1}: ¿Cuánto es ${a} + ${b}?`,
        options,
        correctAnswer: correct,
        explanation: `${a} + ${b} = ${sum}.`,
        topicTag,
        difficulty,
      };
    }
    case 1:
      return {
        orderIndex: index,
        type: 'true_false',
        question: `Ejercicio ${index + 1}: ¿Es cierto que ${a} × 2 = ${a * 2}?`,
        correctAnswer: 'true',
        explanation: `Multiplicar por 2 duplica el número.`,
        topicTag,
        difficulty,
      };
    case 2:
      return {
        orderIndex: index,
        type: 'fill_blank',
        question: `Ejercicio ${index + 1}: Completa: ${a} × ${b} = ___`,
        correctAnswer: String(a * b),
        explanation: `${a} × ${b} = ${a * b}.`,
        topicTag,
        difficulty,
      };
    default:
      return {
        orderIndex: index,
        type: 'short_answer',
        question: `Ejercicio ${index + 1}: ¿Cuánto es ${a * b} ÷ ${a}?`,
        correctAnswer: String(b),
        explanation: `Dividir el producto por un factor da el otro.`,
        topicTag,
        difficulty,
      };
  }
}

export function generateMockMathExercises(count: number): GeneratedExercise[] {
  return Array.from({ length: count }, (_, index) => buildExercise(index));
}
