import { Modal } from '@/shared/components/ui/Modal';
import { Button } from '@/shared/components/ui/Button';

interface SkipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function SkipModal({ isOpen, onClose, onConfirm }: SkipModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="¿Saltar este ejercicio?">
      <p className="mb-6 text-lg text-text-muted">
        Lo contaremos como no acertado. Podrás seguir con el siguiente.
      </p>
      <div className="flex flex-col gap-3">
        <Button type="button" variant="secondary" onClick={onConfirm}>
          Sí, saltar
        </Button>
        <Button type="button" onClick={onClose}>
          Seguir intentando
        </Button>
      </div>
    </Modal>
  );
}

interface DeferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeferModal({ isOpen, onClose, onConfirm }: DeferModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="¿Dejar la ronda para más tarde?">
      <p className="mb-6 text-lg text-text-muted">
        Guardaremos tu progreso y podrás continuar cuando quieras.
      </p>
      <div className="flex flex-col gap-3">
        <Button type="button" variant="secondary" onClick={onConfirm}>
          Sí, salir
        </Button>
        <Button type="button" onClick={onClose}>
          Seguir practicando
        </Button>
      </div>
    </Modal>
  );
}
