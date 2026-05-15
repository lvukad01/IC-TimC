import { useProfile } from '@api/profile';
import profileIcon from '@assets/media/client_profile_icon.svg';
import InlineEdit from '@components/InlineEdit';
import useAuth from '@hooks/useAuth';
import useUpdateProfile from '@hooks/useUpdateProfile';
import toast from 'react-hot-toast';
import { FaArrowRight } from 'react-icons/fa';
import styles from './ClientProfilePage.module.scss';
import { useEffect, useState } from 'react';
import { getFavorites } from '@api/favorites';
import { getSignedFiles } from '@api/files';
import { mapSalonForCard } from '@helpers/salonMapper';
import { SalonCard } from '@components/Home/SalonCard/SalonCard';
import type { SalonCardData } from '@tstypes/SalonCard';
import { api } from '@api/index';

const ClientProfilePage = () => {
  const [favorites, setFavorites] = useState<SalonCardData[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
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
  const formatDateLabel = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('hr-HR', {
      day: 'numeric',
      month: 'long',
    });
  };

  const groupBookingsByDate = (bookings: any[]) => {
    return bookings.reduce<Record<string, any[]>>((groups, booking) => {
      const label = formatDateLabel(booking.startTime);

      if (!groups[label]) groups[label] = [];
      groups[label].push(booking);

      return groups;
    }, {});
  };

  const isPastBooking = (booking: any) => {
    return new Date(booking.startTime) < new Date();
  };

  useEffect(() => {
    const fetchFavorites = async () => {
      const data = await getFavorites();
      const results = data?.results ?? data ?? [];

      const keys = results.map((salon: any) => salon.profileImageKey).filter(Boolean);
      const signedData = keys.length > 0 ? await getSignedFiles(keys) : { files: [] };

      const urlMap = new Map<string, string>(
        signedData.files.map((file: any) => [file.key, file.url]),
      );

      setFavorites(results.map((salon: any) => mapSalonForCard(salon, urlMap)));
    };

    const fetchBookings = async () => {
      const data = await api.get('/bookings');
      setBookings(data ?? []);
    };

    fetchFavorites();
    fetchBookings();
  }, []);

  const upcomingBookings = bookings.filter((booking) => !isPastBooking(booking));
  const pastBookings = bookings.filter(isPastBooking);

  const upcomingGrouped = groupBookingsByDate(upcomingBookings);
  const pastGrouped = groupBookingsByDate(pastBookings);

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
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>♡ Favoriti</h2>
          <button>Vidi sve →</button>
        </div>

        <div className={styles.favoritesList}>
          {favorites.slice(0, 3).map((salon) => (
            <SalonCard key={salon.id} {...salon} borderColor="#A59DBD" />
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2>Rezervacije</h2>

        <h3>U tijeku</h3>

        {Object.entries(upcomingGrouped).map(([date, dateBookings]) => (
          <div key={date}>
            <p className={styles.dateLabel}>{date}</p>

            <div className={styles.bookingList}>
              {dateBookings.map((booking) => (
                <div key={booking.id} className={styles.bookingCard}>
                  <div>
                    <strong>{booking.service?.name ?? 'Usluga'}</strong>
                    <p>{booking.salon?.name}</p>
                    <p>
                      {booking.salon?.street}, {booking.salon?.city}
                    </p>
                  </div>

                  <span>
                    {new Date(booking.startTime).toLocaleTimeString('hr-HR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}

        <h3>Prošle</h3>

        {Object.entries(pastGrouped).map(([date, dateBookings]) => (
          <div key={date}>
            <p className={styles.dateLabel}>{date}</p>

            <div className={styles.bookingList}>
              {dateBookings.map((booking) => (
                <div key={booking.id} className={styles.bookingCardPast}>
                  <div>
                    <strong>{booking.salon?.name}</strong>
                    <p>{booking.service?.name ?? 'Usluga'}</p>
                    <p>plaćanje u salonu 25€</p>
                  </div>

                  <span>
                    {new Date(booking.startTime).toLocaleTimeString('hr-HR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default ClientProfilePage;
