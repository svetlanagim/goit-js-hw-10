import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const refs = {
    input: document.querySelector("#datetime-picker"),
    startBtn: document.querySelector("[data-start]"),
    days: document.querySelector("[data-days]"),
    hours: document.querySelector("[data-hours]"),
    minutes: document.querySelector("[data-minutes]"),
    seconds: document.querySelector("[data-seconds]"),
};

let userSelectedDate = null;
let intervalId = null;

refs.startBtn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
      const picked = selectedDates[0];
      if (!picked || picked <= new Date()) {
          refs.startBtn.disabled = true;
          iziToast.error({ message: "Please choose a date in the future" });
          return;
      }
      picked.setSeconds(0, 0);
      userSelectedDate = picked;
      refs.startBtn.disabled = false;
  },
};

flatpickr(refs.input, options);

refs.startBtn.addEventListener("click", () => {
    refs.startBtn.disabled = true;
    refs.input.disabled = true;

    const target = new Date(userSelectedDate.getTime());
    target.setSeconds(0, 0);

    const getRoundedDiff = () => {
        const diff = target.getTime() - Date.now();
        return Math.floor(diff / 1000) * 1000;
    };

    let diff = getRoundedDiff();
    if (diff <= 0) {
        updateTimerUI({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        refs.input.disabled = false;
        return;
    }
    updateTimerUI(convertMs(diff));
  

    intervalId = setInterval(() => {
        diff = getRoundedDiff();
        if (diff <= 0) {
            clearInterval(intervalId);
            updateTimerUI({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            refs.input.disabled = false;
            return;
        }
        updateTimerUI(convertMs(diff));
    }, 1000);
});

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


function addLeadingZero(value) { 
    return String(value).padStart(2, "0");
}

function updateTimerUI({ days, hours, minutes, seconds }) { 
    refs.days.textContent = addLeadingZero(days);
    refs.hours.textContent = addLeadingZero(hours);
    refs.minutes.textContent = addLeadingZero(minutes);
    refs.seconds.textContent = addLeadingZero(seconds);
}