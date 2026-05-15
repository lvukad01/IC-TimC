import { useProfile } from '@api/profile';
import profileIcon from '@assets/media/client_profile_icon.svg';
import InlineEdit from '@components/InlineEdit';
import useAuth from '@hooks/useAuth';
import useUpdateProfile from '@hooks/useUpdateProfile';
import toast from 'react-hot-toast';
import { FaArrowRight } from 'react-icons/fa';
import styles from './ClientProfilePage.module.scss';

const ClientProfilePage = () => {
  const { data: profile } = useProfile();

  const updateProfileMutation = useUpdateProfile();
  const { logout } = useAuth();

  const updateProfile = (field: string, value: string) => {
    updateProfileMutation.mutate(
      { field, value },
      {
        onSuccess: () => {
          toast.success('Profil uspješno ažuriran');
        },
        onError: (err: any) => {
          toast.error('Greška pri ažuriranju profila');
        },
      },
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.infoWrapper}>
        <img className={styles.profileIcon} src={profileIcon} alt="Profilna ikona" />
        <div className={styles.profileInfo}>
          <div className={styles.editContainer}>
            <InlineEdit
              value={profile?.firstName ?? ''}
              className={styles.name}
              onSave={(val) => updateProfile('firstName', val)}
            />

            <InlineEdit
              value={profile?.lastName ?? ''}
              className={styles.name}
              onSave={(val) => updateProfile('lastName', val)}
            />
          </div>
          <div className={styles.editContainer}>
            <InlineEdit
              value={profile?.email ?? ''}
              className={styles.email}
              onSave={(val) => updateProfile('email', val)}
            />
          </div>
          <div className={styles.editContainer}>
            <InlineEdit
              value={profile?.phone ?? ''}
              className={styles.phone}
              onSave={(val) => updateProfile('phone', val)}
            />
          </div>

          <span className={styles.logoutButton} onClick={() => logout()}>
            <span>Odjavi se</span> <FaArrowRight className={styles.arrow} size={12} />
          </span>
        </div>
      </div>
    </div>
  );
};

export default ClientProfilePage;
