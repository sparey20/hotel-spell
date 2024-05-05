import { useEffect } from 'react';
import Table from '../../components/table/table';
import { useAppSelector } from '../../lib/hooks';
import styles from './index.module.scss';
import axios from 'axios';
import { GUEST_COLUMNS } from './constants';
import { IHotel } from '@hotel-spell/api-interfaces';

export default function Guests() {
  const { hotel } = useAppSelector<{ hotel: IHotel | null }>(
    (state) => state.hotel
  );

  useEffect(() => {
    axios.get(`api/guests`, {
      params: {
        hotel: hotel?.id,
        isActive: true,
      },
    });
  }, []);

  return (
    <div className={styles.guests}>
      <section>
        <section className={styles.header}>
          <h1 className={styles.title}>Guests</h1>
        </section>

        <Table items={[]} idKey="id" columns={GUEST_COLUMNS}></Table>
      </section>
    </div>
  );
}
