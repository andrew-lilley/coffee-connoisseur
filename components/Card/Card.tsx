import { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import styles from './Card.module.scss';

type Props = {
  href: string;
  name: string;
  neighbourhood: string;
  imgUrl: string;
};

export const Card: FC<Props> = (props) => {
  return (
    <Link href={props.href}>
      <a className={styles.cardLink}>
        <div className={`glass ${styles.container}`}>
          <div className={styles.cardHeaderWrapper}>
            <h2 className={styles.cardHeader}>
              {props.name}
              {(props.neighbourhood) ? `, ${props.neighbourhood}` : ''}
            </h2>
          </div>
          <div className={styles.cardImageWrapper}>
            <Image
              alt={props.name}
              className={styles.cardImage}
              src={props.imgUrl}
              width={260}
              height={160}
            />
          </div>
        </div>
      </a>
    </Link>
  );
};

export default Card;
