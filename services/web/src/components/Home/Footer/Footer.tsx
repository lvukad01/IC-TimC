import styles from './Footer.module.scss';

import footerBg from '@assets/media/Rectangle 24.svg';

import instagramIcon from '@assets/media/instagram.svg';
import facebookIcon from '@assets/media/facebook.svg';
import twitterIcon from '@assets/media/twitter.svg';

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <img src={footerBg} alt="" className={styles.background} />

      <div className={styles.content}>
        <h2 className={styles.logo}>Lumii</h2>

        <nav className={styles.links}>
          <a href="#">O nama</a>
          <a href="#">FAQ</a>
          <a href="#">FAQ za vlasnike salona</a>
          <a href="#">Prijavi svoj salon</a>
          <a href="#">Pretraživanje</a>
        </nav>

        <div className={styles.socials}>
          <a href="#">
            <img src={twitterIcon} alt="Twitter" />
          </a>

          <a href="#">
            <img src={facebookIcon} alt="Facebook" />
          </a>

          <a href="#">
            <img src={instagramIcon} alt="Instagram" />
          </a>
        </div>
      </div>
    </footer>
  );
};
