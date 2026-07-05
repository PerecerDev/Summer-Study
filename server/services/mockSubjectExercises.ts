import type { GeneratedExercise } from '../schemas/rounds.js';
import { generateMockMathExercises } from './mockExerciseGenerator.js';

type SubjectCode = 'math' | 'language' | 'english' | 'valencian' | 'medi';

export type { SubjectCode };

const LANGUAGE_TOPICS = [
  'ortografia',
  'gramatica_basica',
  'comprension_lectora',
  'vocabulario',
  'escritura',
] as const;

const ENGLISH_TOPICS = [
  'vocabulary',
  'grammar_basics',
  'reading_comprehension',
  'spelling',
  'everyday_phrases',
] as const;

const VALENCIAN_TOPICS = [
  'ortografia',
  'gramatica_basica',
  'comprensio_lectora',
  'vocabulari',
  'escriptura',
] as const;

const MEDI_TOPICS = [
  'cuerpo_humano',
  'plantas_animales',
  'mapas_espana',
  'medio_ambiente',
  'historia_cercana',
] as const;

function difficultyForIndex(index: number): 'easy' | 'medium' | 'hard' {
  if (index % 5 === 4) return 'hard';
  if (index % 2 === 0) return 'easy';
  return 'medium';
}

function buildLanguageExercise(index: number): GeneratedExercise {
  const topicTag = LANGUAGE_TOPICS[index % LANGUAGE_TOPICS.length];
  const words = ['casa', 'perro', 'árbol', 'libro', 'escuela', 'mar', 'sol', 'nube'];
  const word = words[index % words.length];

  return {
    orderIndex: index,
    type: index % 2 === 0 ? 'multiple_choice' : 'fill_blank',
    question: `¿Cuántas sílabas tiene la palabra "${word}"?`,
    options: index % 2 === 0 ? ['1', '2', '3', '4'] : undefined,
    correctAnswer: index % 2 === 0 ? '2' : '2',
    explanation: `Cuenta las vocales separadas para hallar las sílabas.`,
    topicTag,
    difficulty: difficultyForIndex(index),
  };
}

function buildEnglishExercise(index: number): GeneratedExercise {
  const topicTag = ENGLISH_TOPICS[index % ENGLISH_TOPICS.length];
  const pairs = [
    { en: 'cat', es: 'gato' },
    { en: 'house', es: 'casa' },
    { en: 'book', es: 'libro' },
    { en: 'water', es: 'agua' },
  ];
  const pair = pairs[index % pairs.length];

  return {
    orderIndex: index,
    type: 'multiple_choice',
    question: `What is "${pair.en}" in Spanish?`,
    options: [pair.es, 'perro', 'coche', 'mesa'],
    correctAnswer: pair.es,
    explanation: `"${pair.en}" means "${pair.es}" in Spanish.`,
    topicTag,
    difficulty: difficultyForIndex(index),
  };
}

function buildValencianExercise(index: number): GeneratedExercise {
  const topicTag = VALENCIAN_TOPICS[index % VALENCIAN_TOPICS.length];
  const words = ['casa', 'gos', 'arbre', 'llibre', 'escola'];
  const word = words[index % words.length];

  return {
    orderIndex: index,
    type: 'true_false',
    question: `La paraula "${word}" és un substantiu.`,
    correctAnswer: 'true',
    explanation: 'Els noms de coses, animals o llocs són substantius.',
    topicTag,
    difficulty: difficultyForIndex(index),
  };
}

function buildMediExercise(index: number): GeneratedExercise {
  const topicTag = MEDI_TOPICS[index % MEDI_TOPICS.length];
  const questions = [
    {
      q: '¿Cuántos continentes hay en la Tierra?',
      a: '7',
      options: ['5', '6', '7', '8'],
    },
    {
      q: '¿Qué órgano bombea la sangre?',
      a: 'corazón',
      options: ['pulmón', 'corazón', 'hígado', 'riñón'],
    },
    {
      q: '¿Las plantas producen oxígeno?',
      a: 'true',
    },
    {
      q: 'La capital de España es ___',
      a: 'Madrid',
    },
  ];
  const item = questions[index % questions.length];

  if (item.options) {
    return {
      orderIndex: index,
      type: 'multiple_choice',
      question: item.q,
      options: item.options,
      correctAnswer: item.a,
      explanation: 'Repasa el tema en tu libro de Medi.',
      topicTag,
      difficulty: difficultyForIndex(index),
    };
  }

  if (item.a === 'true' || item.a === 'false') {
    return {
      orderIndex: index,
      type: 'true_false',
      question: item.q,
      correctAnswer: item.a,
      explanation: 'Las plantas realizan la fotosíntesis.',
      topicTag,
      difficulty: difficultyForIndex(index),
    };
  }

  return {
    orderIndex: index,
    type: 'fill_blank',
    question: item.q,
    correctAnswer: item.a,
    explanation: 'Madrid es la capital de España.',
    topicTag,
    difficulty: difficultyForIndex(index),
  };
}

export function generateMockExercises(subjectCode: SubjectCode, count: number): GeneratedExercise[] {
  if (subjectCode === 'math') {
    return generateMockMathExercises(count);
  }

  const builders: Record<Exclude<SubjectCode, 'math'>, (index: number) => GeneratedExercise> = {
    language: buildLanguageExercise,
    english: buildEnglishExercise,
    valencian: buildValencianExercise,
    medi: buildMediExercise,
  };

  const build = builders[subjectCode];
  return Array.from({ length: count }, (_, index) => build(index));
}
