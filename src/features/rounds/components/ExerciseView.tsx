import { Button } from '@/shared/components/ui/Button';
import type { ExerciseDto } from '@/shared/types/api/rounds';

interface FeedbackPanelProps {
  isCorrect: boolean;
  explanation?: string;
  correctAnswer?: string | string[];
  onContinue: () => void;
}

export function FeedbackPanel({
  isCorrect,
  explanation,
  correctAnswer,
  onContinue,
}: FeedbackPanelProps) {
  return (
    <div
      className={[
        'space-y-4 rounded-2xl border-2 p-6',
        isCorrect ? 'border-success bg-success/10' : 'border-correction bg-correction/10',
      ].join(' ')}
      role="status"
    >
      <p className="text-xl font-bold text-text-primary">
        {isCorrect ? '¡Correcto! 🎉' : 'Casi — sigue practicando'}
      </p>
      {!isCorrect && correctAnswer !== undefined && (
        <p className="text-lg text-text-muted">
          La respuesta correcta es:{' '}
          <strong className="text-text-primary">
            {Array.isArray(correctAnswer) ? correctAnswer.join(', ') : correctAnswer}
          </strong>
        </p>
      )}
      {explanation && <p className="text-lg text-text-muted">{explanation}</p>}
      <Button type="button" onClick={onContinue} className="w-full">
        Siguiente ejercicio
      </Button>
    </div>
  );
}

interface ExerciseViewProps {
  exercise: ExerciseDto;
  selectedAnswer: string;
  onSelectAnswer: (answer: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  disabled: boolean;
}

export function ExerciseView({
  exercise,
  selectedAnswer,
  onSelectAnswer,
  onSubmit,
  isSubmitting,
  disabled,
}: ExerciseViewProps) {
  const canSubmit =
    !disabled &&
    (exercise.type === 'true_false' || exercise.type === 'multiple_choice'
      ? selectedAnswer.length > 0
      : selectedAnswer.trim().length > 0);

  return (
    <div className="space-y-6">
      <p className="text-2xl font-bold leading-snug text-text-primary">{exercise.question}</p>

      {exercise.type === 'multiple_choice' && exercise.options && (
        <div className="grid gap-3" role="listbox" aria-label="Opciones">
          {exercise.options.map((option) => (
            <button
              key={option}
              type="button"
              role="option"
              aria-selected={selectedAnswer === option}
              disabled={disabled}
              onClick={() => {
                onSelectAnswer(option);
              }}
              className={[
                'min-h-touch-lg rounded-xl border-2 px-4 py-3 text-left text-lg font-semibold transition-colors',
                selectedAnswer === option
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-black/10 bg-surface text-text-primary',
              ].join(' ')}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {exercise.type === 'true_false' && (
        <div className="grid grid-cols-2 gap-3">
          {['true', 'false'].map((value) => (
            <button
              key={value}
              type="button"
              disabled={disabled}
              onClick={() => {
                onSelectAnswer(value);
              }}
              className={[
                'min-h-touch-lg rounded-xl border-2 text-lg font-bold',
                selectedAnswer === value
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-black/10 bg-surface text-text-primary',
              ].join(' ')}
            >
              {value === 'true' ? 'Verdadero' : 'Falso'}
            </button>
          ))}
        </div>
      )}

      {(exercise.type === 'fill_blank' || exercise.type === 'short_answer') && (
        <input
          type="text"
          value={selectedAnswer}
          disabled={disabled}
          onChange={(event) => {
            onSelectAnswer(event.target.value);
          }}
          placeholder="Escribe tu respuesta"
          className="min-h-touch-lg w-full rounded-xl border-2 border-black/10 bg-surface px-4 text-lg text-text-primary outline-none focus:border-primary"
          aria-label="Tu respuesta"
        />
      )}

      <Button
        type="button"
        onClick={onSubmit}
        disabled={!canSubmit || isSubmitting}
        className="w-full"
      >
        {isSubmitting ? 'Comprobando…' : 'Comprobar'}
      </Button>
    </div>
  );
}
