export const getPlannedDate = (createdDate: string, planDate: string): string => {
    if (!planDate || planDate?.trim() === '') {
        return 'N/A';
    }

    const createdDateTime = new Date(createdDate);

    // Check for hours to add
    const hoursMatch = planDate.match(/Hours -\s*(\d+)/i);
    if (hoursMatch) {
        const hoursToAdd = parseInt(hoursMatch[1], 10);
        if (!isNaN(hoursToAdd)) {
            createdDateTime.setHours(createdDateTime.getHours() + hoursToAdd);
            return formatDateWithAMPM(createdDateTime);
        }
    }

    // Check for weekday and time pattern
    const weekdayMatch = planDate.match(/WeekDay\s*-\s*(\w+)/i);
    const timeMatch = planDate.match(/time\s*-\s*([\d:]+)/i);
    if (weekdayMatch && timeMatch) {
        const weekday = weekdayMatch[1];
        const time = timeMatch[1];
        const nextWeekdayDate = getNextWeekdayDate(createdDate, weekday, time);
        return formatDateWithAMPM(nextWeekdayDate);
    }

    // Check for Days and time pattern
    const daysMatch = planDate.match(/Days\s*-\s*(\d+)/i);
    const timeWithDayMatch = planDate.match(/time\s*-\s*([\d:]+)/i);
    if (daysMatch) {
        const daysToAdd = parseInt(daysMatch[1], 10);
        const time = timeWithDayMatch ? timeWithDayMatch[1] : '00:00:00'; // Default time to 00:00:00 if not provided
        const nextDayDate = getNextDayDate(createdDate, daysToAdd, time);
        return formatDateWithAMPM(nextDayDate);
    }

    return 'N/A';
};

const getNextWeekdayDate = (createdDate: string, weekday: string, time: string): Date => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const createdDateTime = new Date(createdDate);
    const currentDay = createdDateTime.getDay();
    const targetDay = daysOfWeek.indexOf(weekday);

    const daysToAdd = (targetDay - currentDay + 7) % 7 || 7;

    createdDateTime.setDate(createdDateTime.getDate() + daysToAdd);
    const [hours, minutes, seconds] = time.split(':').map(Number);
    createdDateTime.setHours(hours, minutes, seconds || 0);

    return createdDateTime;
};

const getNextDayDate = (createdDate: string, daysToAdd: number, time: string): Date => {
    const createdDateTime = new Date(createdDate);

    // Add the number of days
    createdDateTime.setDate(createdDateTime.getDate() + daysToAdd);

    // Set the specified time, default to 00:00:00 if time is empty
    const [hours, minutes, seconds] = time.split(':').map(Number);
    createdDateTime.setHours(hours, minutes, seconds || 0);

    return createdDateTime;
};

const formatDateWithAMPM = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12 || 12; // Convert 0 to 12 for AM/PM format
    const formattedHours = hours.toString().padStart(2, '0'); // Ensure 2-digit hour format

    return `${day}-${month}-${year} ${formattedHours}:${minutes} ${ampm}`;
};
