import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const inputTime = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('button[data-start]');

const daysEl = document.querySelector('span[data-days]');
const hoursEl = document.querySelector('span[data-hours]');
const minsEl = document.querySelector('span[data-minutes]');
const secsEl = document.querySelector('span[data-seconds]');

let userSelectedDate = null;
let timerId = null;

startBtn.disabled = true;

// flatpickr

flatpickr(inputTime, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onValueUpdate(selectedDates) {
    const selectedTimes = selectedDates[0];
    if (selectedTimes > new Date()) {
      startBtn.disabled = false;
      userSelectedDate = selectedTimes;
    } else {
      startBtn.disabled = true;
      userSelectedDate = null;

      iziToast.error({
        title: 'Invalid date',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
    }
    return;
  },
});

// start countdown

startBtn.addEventListener('click', start);

function start() {
  if (!userSelectedDate) {
    iziToast.warning({
      title: 'Warning',
      message: 'Please choose a date first!',
      position: 'topRight',
    });
    return;
  }

// stop if previous

  inputTime.disabled = true;
  startBtn.disabled = true;
  timerId = setInterval(() => {
    const startTime = new Date();
    const deltaTime = userSelectedDate - startTime;
    if (deltaTime <= 0) {
      clearInterval(timerId);
      updateTimerUI(0, 0, 0, 0);
      iziToast.info({
        title: 'Time is up!',
        message: 'The countdown has finished!',
        position: 'topRight',
      });
     inputTime.disabled = false;
      startBtn.disabled = false;
      return;
    }
    const time = convertMs(deltaTime);
    updateTimerUI(time);
  }, 1000);
}

// helpers

function formatTime(value) {
  return String(value).padStart(2, '0');
}

function updateTimerUI({ days = 0, hours = 0, minutes = 0, seconds = 0}) {
  daysEl.textContent = formatTime(days);
  hoursEl.textContent = formatTime(hours);
  minsEl.textContent = formatTime(minutes);
  secsEl.textContent = formatTime(seconds);
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}