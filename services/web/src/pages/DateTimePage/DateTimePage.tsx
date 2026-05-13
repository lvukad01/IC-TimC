import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './DateTimePage.module.css';

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
  const navigate = useNavigate();
  const { state } = useLocation();

  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 1));
  const [selectedDay, setSelectedDay] = useState<number | null>(12);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = useMemo(() => {
    return new Date(year, month + 1, 0).getDate();
  }, [year, month]);

  const days = Array.from({ length: daysInMonth }, (_, index) => index + 1);

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

    const selectedDate = new Date(year, month, selectedDay);
    const formattedDate = selectedDate.toISOString();

    navigate(state?.returnTo ?? '/search/results', {
      state: {
        ...state,
        date: formattedDate,
        dateLabel: `${selectedDay}.${month + 1}.${year}`,
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
        <button onClick={goPrevMonth}>←</button>
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
            className={day === selectedDay ? styles.selectedDay : styles.day}
            onClick={() => setSelectedDay(day)}
          >
            {day}
          </button>
        ))}
      </div>

      <div className={styles.time}>00 - 00</div>

      <button className={styles.submitButton} onClick={handleSubmit}>
        Odaberi
      </button>
    </section>
  );
};

export default DateTimePage;
