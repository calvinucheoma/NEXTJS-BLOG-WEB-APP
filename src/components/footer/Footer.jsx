import Image from 'next/image';
import styles from './Footer.module.css';
import Link from 'next/link';

const Footer = () => {
  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <div className={styles.logo}>
          <Image src="/logo.jpeg" alt="chuks blog" width={50} height={50} />
          <h1 className={styles.logoText}>ChuksBlog</h1>
        </div>
        <p className={styles.desc}>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Itaque, a
          at! Tempora, illo non magni veritatis quisquam eveniet ea? Facilis,
          illum? Illo similique amet, voluptatibus debitis itaque dolore
          provident ab.
        </p>
        <div className={styles.icons}>
          <Image src="/facebook.png" alt="facebook" width={18} height={18} />
          <Image src="/instagram.png" alt="instagram" width={18} height={18} />
          <Image src="/tiktok.png" alt="tiktok" width={18} height={18} />
          <Image src="/youtube.png" alt="youtube" width={18} height={18} />
        </div>
      </div>
      <div className={styles.links}>
        <div className={styles.list}>
          <span className={styles.listTitle}>Links</span>
          <Link href="/">Home</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <div className={styles.list}>
          <span className={styles.listTitle}>Tags</span>
          <Link href="/">Styles</Link>
          <Link href="/">Fashion</Link>
          <Link href="/">Coding</Link>
          <Link href="/">Travel</Link>
        </div>
        <div className={styles.list}>
          <span className={styles.listTitle}>Social</span>
          <Link href="www.facebook.com">Facebook</Link>
          <Link href="www.instagram.com">Instagram</Link>
          <Link href="www.tiktok.com">TikTok</Link>
          <Link href="www.youtube.com">Youtube</Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
