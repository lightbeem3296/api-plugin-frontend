import { faEdit, faPlus, faSave, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

interface ButtonProps {
  disabled?: boolean,
  onClick: () => void,
  children?: React.ReactNode,
}

export function NewButton({ onClick, children }: ButtonProps) {
  return (
    <button
      className="btn btn-primary btn-sm text-gray-100"
      onClick={onClick}
    >
      <FontAwesomeIcon icon={faPlus} width={12} />{children}
    </button>
  );
}

export function SaveButton({ disabled = false, onClick }: ButtonProps) {
  return (
    <button
      className="btn btn-primary btn-sm btn-outline"
      disabled={disabled}
      onClick={onClick}
    >
      <FontAwesomeIcon icon={faSave} />
    </button >
  );
}

export function EditButton({ onClick }: ButtonProps) {
  return (
    <button
      className="btn btn-primary btn-sm btn-outline"
      onClick={onClick}
    >
      <FontAwesomeIcon icon={faEdit} />
    </button >
  );
}

export function DeleteButton({ disabled = false, onClick }: ButtonProps) {
  return (
    <button
      className="btn btn-error btn-sm btn-outline"
      disabled={disabled}
      onClick={onClick}
    >
      <FontAwesomeIcon icon={faTrash} />
    </button >
  );
}
