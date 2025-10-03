import dayjs from "dayjs";

export const generateDates = (): LiveProps.DateItem[] => {
    const today = dayjs();
    const dates: LiveProps.DateItem[] = [];
    for (let i = -15; i <= 15; i++) {
      const currentDate = today.add(i, 'day');
      dates.push({
        date: currentDate.format('YYYY-MM-DD'),
        dayLabel: currentDate.format('MM-DD'),
        dayOfWeek: today.isSame(currentDate, 'day')
          ? '今天'
          : ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][
              currentDate.day()
            ],
        isToday: today.isSame(currentDate, 'day'),
      });
    }
    return dates;
  };