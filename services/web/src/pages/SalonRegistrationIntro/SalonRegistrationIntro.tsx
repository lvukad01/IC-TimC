import { AppPaths } from 'common/routes/paths';
import { FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import styles from './SalonRegistrationIntro.module.scss';

const SalonRegistrationIntro = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <span className={styles.blackTitle}>Bez pretplate</span>
        <span className={styles.purpleTitle}>Plaćaš samo kada zaradiš</span>
      </h1>

      <div className={styles.cardContainer}>
        <div className={styles.infoCard}>
          <h2 className={styles.cardTitle}>Provizija</h2>
          <p className={styles.info}>
            Provizija se obračunava jednom mjesečno na temelju uspješno realiziranih rezervacija.
            <b>(Lumii uzima 10%)</b>
          </p>
          <br />
          <p className={styles.info}>Plaćaš samo kada klijent stvarno dođe na termin.</p>
        </div>
        <div className={styles.infoCard}>
          <h2 className={styles.cardTitle}>No-show zaštita</h2>
          <p className={styles.info}>
            Korisnici plaćaju polog prilikom rezervacije kako bi se smanjili otkazani i prazni
            termini.
          </p>
        </div>
        <div className={styles.infoCard}>
          <h2 className={styles.cardTitle}>Spotlight</h2>
          <p className={styles.info}>
            Istakni salon korisnicima koji aktivno traže termine u tvojoj blizini.
          </p>
          <ul className={styles.spotlightList}>
            <li className={styles.listItem}>
              <span>Dnevni</span> <span>3 €</span>
            </li>
            <li className={styles.listItem}>
              <span>Tjedni</span>
              <span>15 € </span>{' '}
            </li>
            <li className={styles.listItem}>
              <span>Mjesečni</span>
              <span>40 €</span>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.btnWrapper}>
        <button
          className={styles.registerButton}
          onClick={() => navigate(`${AppPaths.LOGIN}?mode=owner`)}
        >
          <span>Napravi račun</span>
          <FaArrowRight className={styles.arrow} size={12} />
        </button>
      </div>
    </div>
  );
};

export default SalonRegistrationIntro;
