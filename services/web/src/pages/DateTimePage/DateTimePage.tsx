import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './DateTimePage.module.scss';
import arrowUp from '@assets/media/chevronup.svg';
import arrowDown from '@assets/media/chevrondown.svg';

const monthNames = [
  'SIJEČANJ',
  'VELJAČA',
  'OŽUJAK',
  'TRAVANJ',
  'SVIBANJ',
  'LIPANJ',
  'SRPANJ',
  'KOLOVOZ',
  'RUJAN',
  'LISTOPAD',
  'STUDENI',
  'PROSINAC',
];

const DateTimePage = () => {
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);

  const increaseHour = () => setHour((prev) => (prev + 1) % 24);
  const decreaseHour = () => setHour((prev) => (prev === 0 ? 23 : prev - 1));

  const increaseMinute = () => setMinute((prev) => (prev + 15) % 60);
  const decreaseMinute = () => setMinute((prev) => (prev === 0 ? 45 : prev - 15));

  const formatTime = (value: number) => value.toString().padStart(2, '0');
  const navigate = useNavigate();
  const { state } = useLocation();

  const today = new Date();
  today.setSeconds(0, 0);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(new Date().getDate());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = useMemo(() => {
    return new Date(year, month + 1, 0).getDate();
  }, [year, month]);

  const days = Array.from({ length: daysInMonth }, (_, index) => index + 1);
  const isPastDay = (day: number) => {
    const date = new Date(year, month, day);
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    return date < todayDate;
  };

  const isCurrentMonth = year === new Date().getFullYear() && month === new Date().getMonth();

  const isPastSelectedTime = () => {
    if (!selectedDay) return true;

    const selectedDateTime = new Date(year, month, selectedDay, hour, minute);
    return selectedDateTime < new Date();
  };
  const goPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDay(null);
  };

  const goNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDay(null);
  };

  const handleSubmit = () => {
    if (!selectedDay) return;

    const selectedDate = new Date(year, month, selectedDay, hour, minute);

    if (selectedDate < new Date()) {
      return;
    }

    const formattedDate = selectedDate.toISOString();

    navigate(state?.returnTo ?? '/search/results', {
      state: {
        ...state,
        date: formattedDate,
        dateLabel: selectedDate.toLocaleString('hr-HR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      },
    });
  };

  return (
    <section className={styles.page}>
      <button className={styles.backButton} onClick={() => navigate(-1)}>
        ←
      </button>

      <h1 className={styles.title}>Datum i vrijeme</h1>

      <div className={styles.monthRow}>
        <button onClick={goPrevMonth} disabled={isCurrentMonth}>
          ←
        </button>{' '}
        <div>
          <p>{monthNames[month]}</p>
          <span>{year}</span>
        </div>
        <button onClick={goNextMonth}>→</button>
      </div>

      <div className={styles.calendar}>
        {days.map((day) => (
          <button
            key={day}
            disabled={isPastDay(day)}
            className={
              isPastDay(day)
                ? styles.disabledDay
                : day === selectedDay
                  ? styles.selectedDay
                  : styles.day
            }
            onClick={() => setSelectedDay(day)}
          >
            {day}
          </button>
        ))}
      </div>

      <div className={styles.timePicker}>
        <div className={styles.timeColumn}>
          <button className={styles.arrowButton} onClick={increaseHour}>
            <img src={arrowUp} alt="" />
          </button>

          <span>{formatTime(hour)}</span>

          <button className={styles.arrowButton} onClick={decreaseHour}>
            <img src={arrowDown} alt="" />
          </button>
        </div>

        <span className={styles.separator}>-</span>

        <div className={styles.timeColumn}>
          <button className={styles.arrowButton} onClick={increaseMinute}>
            <img src={arrowUp} alt="" />
          </button>

          <span>{formatTime(minute)}</span>

          <button className={styles.arrowButton} onClick={decreaseMinute}>
            <img src={arrowDown} alt="" />
          </button>
        </div>
      </div>
      <button
        className={styles.submitButton}
        onClick={handleSubmit}
        disabled={isPastSelectedTime()}
      >
        Odaberi
      </button>
    </section>
  );
};

export default DateTimePage;
