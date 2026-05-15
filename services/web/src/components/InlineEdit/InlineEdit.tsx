import editIconGray from '@assets/media/edit_gray.svg';
import { useEffect, useState } from 'react';
import styles from './InlineEdit.module.scss';

interface InlineEditProps {
  value: string;
  className?: string;
  onSave: (value: string) => void;
}

const InlineEdit = ({ value, className, onSave }: InlineEditProps) => {
  const [editingValue, setEditingValue] = useState(value);
  const [isEditing, setIsEditing] = useState(false);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setEditingValue(event.target.value);

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === 'Escape') {
      event.currentTarget.blur();
    }
  };

  useEffect(() => {
    setEditingValue(value);
  }, [value]);

  const onBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const newValue = event.currentTarget.value.trim();

    if (newValue === '') {
      setEditingValue(value);
      setIsEditing(false);
      return;
    } else if (newValue === value) {
      setIsEditing(false);
      return;
    }
    onSave?.(newValue);

    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <input
        autoFocus
        type="text"
        aria-label="Field name"
        value={editingValue}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
      />
    );
  }

  return (
    <div className={styles.editContainer}>
      <span className={className} onClick={() => setIsEditing(true)}>
        {value}
      </span>

      <button type="button" onClick={() => setIsEditing(true)}>
        <img src={editIconGray} alt="Uredi" />
      </button>
    </div>
  );
};

export default InlineEdit;
