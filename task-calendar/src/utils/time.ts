export function time_to_string(time: number) {
    const hours_since_zero = Math.floor(time / 60);
    const minutes = time % 60;
    const hour = hours_since_zero > 12 ? hours_since_zero - 12 : hours_since_zero;
    const minutes_display = minutes < 10 ? `0${minutes}` : minutes;
    const am_or_pm = hours_since_zero > 12 ? 'PM' : 'AM';
    return `${hour}:${minutes_display}: ${am_or_pm}`;
}