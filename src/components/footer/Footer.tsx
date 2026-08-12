import React from 'react';
import styles from './Footer.module.css';

type FooterProps = {
  theme?: 'light' | 'dark';
};

export const Footer: React.FC<FooterProps> = ({ theme = 'light' }) => {
  return (
    <footer className={`${styles.footer} ${theme === 'dark' ? styles.dark : ''}`}>

    </footer>
  );
};