import { FC } from 'react';
import styles from './Banner.module.scss';

type Props = {
  buttonText: string;
  handleOnClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export const Banner: FC<Props> = (props) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <span className={styles.title1}>Coffee</span>
        <span className={styles.title2}>Connoisseur</span>
      </h1>
      <p className={styles.subTitle}>Discover your local coffee shops!</p>
      <div className={styles.buttonWrapper}>
        <button className={styles.button} onClick={props.handleOnClick}>
          {props.buttonText}
        </button>
      </div>
    </div>
  );
};

export default Banner;
