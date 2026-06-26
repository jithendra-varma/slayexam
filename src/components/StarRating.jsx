import { useState } from 'react';
import styles from './StarRating.module.css';

export default function StarRating({ value = 0, onChange, readonly = false, size = 'md' }) {
  const [hover, setHover] = useState(0);
  const display = hover || value;

  return (
    <div className={`${styles.stars} ${styles[size]} ${readonly ? styles.readonly : ''}`}>
      {[1, 2, 3, 4, 5].map(n => (
        <span
          key={n}
          className={`${styles.star} ${n <= display ? styles.filled : ''}`}
          onClick={() => !readonly && onChange?.(n)}
          onMouseEnter={() => !readonly && setHover(n)}
          onMouseLeave={() => !readonly && setHover(0)}
        >★</span>
      ))}
    </div>
  );
}
