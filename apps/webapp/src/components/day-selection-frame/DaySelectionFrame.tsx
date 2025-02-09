import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import styles from './DaySelectionFrame.module.scss';
import {
  addDays,
  addWeeks,
  eachDayOfInterval,
  format,
  getUnixTime,
  isSameDay,
  isWithinInterval,
  startOfWeek,
  subDays,
} from 'date-fns';
import { useEffect, useRef, useState } from 'react';

type DaySelectionFrameProps = {
  initialSelectedDay: Date;
  onSelectDayHandler: (day: Date) => void;
};

const frame = 14;

export default function DaySelectionFrame({
  initialSelectedDay,
  onSelectDayHandler,
}: DaySelectionFrameProps) {
  let selectionFrameRef = useRef<Date[]>([]);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [daySelectionFrame, setDaySelectionFrame] = useState<Date[]>([]);

  useEffect(() => {
    setSelectedDay(initialSelectedDay);

    if (
      !isWithinInterval(initialSelectedDay, {
        start: selectionFrameRef.current[0],
        end: selectionFrameRef.current[selectionFrameRef.current.length - 1],
      })
    ) {
      const startOfFrame = startOfWeek(initialSelectedDay);

      selectionFrameRef.current = eachDayOfInterval({
        start: startOfFrame,
        end: addWeeks(startOfFrame, 2),
      });
      setDaySelectionFrame(selectionFrameRef.current);
    }
  }, [initialSelectedDay]);

  const goToNextDaySelectionFrame = () => {
    const newSelectionFrame = [
      ...daySelectionFrame,
      ...Array.from({ length: frame }, (_, index) =>
        addDays(daySelectionFrame[daySelectionFrame.length - 1], index + 1)
      ),
    ];

    newSelectionFrame.splice(0, frame);

    selectionFrameRef.current = newSelectionFrame;
    setDaySelectionFrame(selectionFrameRef.current);
  };

  const goToPreviousDaySelectionFrame = () => {
    let newSelectionFrame = [
      ...Array.from({ length: frame }, (_, index) =>
        subDays(daySelectionFrame[0], index + 1)
      ).reverse(),
      ...daySelectionFrame,
    ];

    newSelectionFrame = newSelectionFrame.slice(0, -frame);

    selectionFrameRef.current = newSelectionFrame;
    setDaySelectionFrame(selectionFrameRef.current);
  };

  const onSelectDay = (date: Date) => {
    setSelectedDay(date);
    onSelectDayHandler(date);
  };

  return (
    <section className={styles.daySelection}>
      <button
        className={`${styles.navigationButton} iconButton`}
        onClick={goToPreviousDaySelectionFrame}
      >
        <LuChevronLeft></LuChevronLeft>
      </button>
      {daySelectionFrame.map((day) => (
        <button
          key={getUnixTime(day)}
          onClick={() => onSelectDay(day)}
          className={
            isSameDay(selectedDay ?? '', day)
              ? `${styles.dayButton} ${styles.selected}`
              : styles.dayButton
          }
        >
          <p className={styles.weekDay}>{format(day, 'EEEEEE')}</p>
          <h4 className={styles.dayNumber}>{format(day, 'd')}</h4>
        </button>
      ))}
      <button
        className={`${styles.navigationButton} iconButton`}
        onClick={goToNextDaySelectionFrame}
      >
        <LuChevronRight></LuChevronRight>
      </button>
    </section>
  );
}
