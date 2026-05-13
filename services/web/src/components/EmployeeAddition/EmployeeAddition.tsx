import plus from '@assets/media/plus.svg';
import profileIcon from '@assets/media/profile_icon.svg';
import AddEmployeeModal from '@components/AddEmployeeModal';
import type { OwnerRegistrationFormSchemaProps } from '@validation/ownerRegistrationForm';
import { useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { FaTimes } from 'react-icons/fa';
import styles from './EmployeeAddition.module.scss';

const EmployeeAddition = () => {
  const { getValues } = useFormContext<OwnerRegistrationFormSchemaProps>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { control } = useFormContext<OwnerRegistrationFormSchemaProps>();

  const { fields, append, remove } = useFieldArray<OwnerRegistrationFormSchemaProps>({
    control,
    name: 'employeesAddition.employees',
  });

  const owner = getValues('ownerPersonalInformation');
  return (
    <>
      <h1 className={styles.title}>Unesi zaposlenike</h1>
      <h2 className={styles.subtitle}>Unesi jednog ili više zaposlenika ako radiš u timu</h2>
      <div className={styles.additionWrapper}>
        <div className={styles.ownerInfo}>
          <img className={styles.icon} src={profileIcon} alt="profil ikona" />
          <div className={styles.ownerInfoWrapper}>
            <span className={styles.ownerName}>
              {owner.firstName} {owner.lastName}
            </span>
            <span className={styles.role}>vlasnik</span>
          </div>
        </div>
        <button type="button" className={styles.plusIcon} onClick={() => setIsModalOpen(true)}>
          <img src={plus} alt="plus" />
        </button>

        <div className={styles.employeeList}>
          {fields.map((employee, index) => (
            <div key={employee.id} className={styles.card}>
              <img className={styles.icon} src={profileIcon} alt="profil ikona" />
              <div className={styles.info}>
                <span className={styles.name}>{employee.name}</span>
                <span className={styles.role}>{employee.role}</span>
                <span className={styles.status}>
                  {employee.isActive ? 'Aktivan' : 'Nije aktivan'}
                </span>
              </div>
              <button type="button" className={styles.removeButton} onClick={() => remove(index)}>
                <FaTimes color="red" size={20} />
              </button>
            </div>
          ))}
        </div>

        <AddEmployeeModal
          onAdd={(employee) => {
            append(employee);
          }}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </>
  );
};

export default EmployeeAddition;
