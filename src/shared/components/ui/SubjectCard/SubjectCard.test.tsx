import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SubjectCard } from './SubjectCard';

describe('SubjectCard', () => {
  it('renders subject name and is accessible', () => {
    render(
      <SubjectCard name="Matemáticas" colorClass="border-subject-math" onSelect={() => undefined} />,
    );

    expect(screen.getByRole('button', { name: /matemáticas/i })).toBeInTheDocument();
    expect(screen.getByText('Empezar →')).toBeInTheDocument();
  });
});
