import styles from './NumberStatisticsCard.module.scss';

type NumberStatisticsCardProps = {
  title: string;
  value: number;
  isPercentage?: boolean;
  icon?: any;
};

export default function NumberStatisticsCard({
  title,
  value,
  isPercentage = false,
  icon,
}: NumberStatisticsCardProps) {
  return (
    <div className={styles.numberStatisticsCard}>
      <div className="flex flex-row gap-3">
        {icon}
        <div className={styles.title}>{title}</div>
      </div>
      <div className={styles.number}>{isPercentage ? `${value}%` : value}</div>
    </div>
  );
}
