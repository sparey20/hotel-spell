import styles from './numberStatisticsCard.module.scss';

type NumberStatisticsCardProps = {
  title: string;
  value: number;
  isPercentage?: boolean;
};

export default function NumberStatisticsCard({
  title,
value,
  isPercentage = false,
}: NumberStatisticsCardProps) {
  return (
    <div className={styles.numberStatisticsCard}>
      <div className={styles.title}>{title}</div>
      <div className={styles.number}>{isPercentage ? `${value}%` : value}</div>
    </div>
  );
}
