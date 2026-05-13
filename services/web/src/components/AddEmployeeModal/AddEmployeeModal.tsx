import FormInput from '@components/FormInput';
import Modal from '@components/Modal';
import { zodResolver } from '@hookform/resolvers/zod';
import { EmployeeRole } from '@lumii/types';
import {
  employeeAdditionSchema,
  type EmployeeAdditionFormSchemaProps,
} from '@validation/employeeAddition';
import { Controller, useForm } from 'react-hook-form';
import Select from 'react-select';
import styles from './AddEmployeeModal.module.scss';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (employee: EmployeeAdditionFormSchemaProps) => void;
}

const categories = [
  { value: EmployeeRole.HAIRDRESSER, label: 'Hairdresser' },
  { value: EmployeeRole.NAIL_TECH, label: 'Nail Tech' },
  { value: EmployeeRole.MAKEUP_ARTIST, label: 'Makeup Artist' },
  { value: EmployeeRole.BARBER, label: 'Barber' },
];

const AddEmployeeModal = ({ isOpen, onClose, onAdd }: AddEmployeeModalProps) => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmployeeAdditionFormSchemaProps>({
    resolver: zodResolver(employeeAdditionSchema),
    defaultValues: {
      isActive: true,
    },
  });

  if (!isOpen) return null;

  const onSubmit = (data: EmployeeAdditionFormSchemaProps) => {
    console.log('Add data: ', data);
    onAdd(data);
    onClose();
    reset();
  };

  return (
    <Modal>
      <div className={styles.modal}>
        <h2>Dodaj zaposlenika</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FormInput
            label="Ime zaposlenika"
            fullWidth
            margin="normal"
            {...register('name')}
            error={!!errors?.name}
            helperText={errors.name?.message}
          />

          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Select
                options={categories}
                onChange={(option) => field.onChange(option?.value)}
                value={categories.find((c) => c.value === field.value)}
                placeholder="Odaberi ulogu zaposlenika"
              ></Select>
            )}
          />
          <label>
            <input type="checkbox" {...register('isActive')} />
            <span>Active</span>
          </label>

          <button className={styles.modalButton} type="submit">
            Dodaj
          </button>

          <button className={styles.modalButton} type="button" onClick={onClose}>
            Odustani
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default AddEmployeeModal;
