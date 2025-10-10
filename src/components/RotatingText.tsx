"use client";

import React from 'react';
import styles from './RotatingText.module.css';

type RotatingTextProps = {
  phrases: string[];
  baseText: string;
};

export const RotatingText: React.FC<RotatingTextProps> = ({ phrases, baseText }) => {
  const animationDuration = phrases.length * 3; // 3s per phrase

  return (
    <h1 className={styles.title}>
      {baseText}{' '}
      <span className={styles.rotatingWrapper}>
        <span 
          className={styles.rotatingPhrases} 
          style={{ animationDuration: `${animationDuration}s` }}
        >
          {phrases.map((phrase, index) => (
            <span key={index} className={styles.phrase}>
              {phrase}
            </span>
          ))}
        </span>
      </span>
    </h1>
  );
}; 