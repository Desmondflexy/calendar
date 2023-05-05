const selectMonth = document.querySelector('select');
const yearInput = document.querySelector('input');
const timeNow = document.querySelector('footer');

const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];
months.forEach(month => {
    const option = document.createElement('option');
    option.innerHTML = option.value = month;
    selectMonth.append(option);
})

let now = new Date();
let month = months[now.getMonth()];
let year = now.getFullYear();
createCalendar();

selectMonth.addEventListener('change', () => yearInput.focus());
document.querySelector('form').addEventListener('submit', handleSubmit);

document.querySelector('.prev').addEventListener('click', () => {
    if (year.toString() === yearInput.getAttribute('min') && month === months[0]){
        return;
    }
    let m = months.indexOf(month) - 1;
    if (m < 0) {
        month = months[11];
        year -= 1;
    } else {
        month = months[m];
    }
    createCalendar();
})

document.querySelector('.next').addEventListener('click', () => {
    if (year.toString() === yearInput.getAttribute('max') && month === months[11]){
        return;
    }
    let m = months.indexOf(month) + 1;
    if (m > 11) {
        month = months[0];
        year += 1;
    } else {
        month = months[m];
    }
    createCalendar();
})

timeNow.addEventListener('click', () => {
    month = months[now.getMonth()];
    year = now.getFullYear();
    createCalendar();
})

// Changes the time display on the footer every second
setInterval(() => {
    now = new Date();
    timeNow.innerHTML = `${now.toDateString()}, ${now.toLocaleTimeString()}`;
}, 1000);

function createCalendar() {
    // Validates inputs entered from the browser console. Just for debugging sakes.
    if (!(months.includes(month)) || year < yearInput.getAttribute('min') || year > yearInput.getAttribute('max')) {
        throw ('Error in createCalendar: Invalid input.')
    }

    // Update the values on the form
    selectMonth.value = month;
    yearInput.value = year;
    document.querySelector('.month-year').innerHTML = `${month} ${year}`;

    const weekdays = document.querySelector('.weekdays');
    weekdays.innerHTML = '';
    ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'].forEach(name => {
        const weekday = document.createElement('li');
        weekday.innerHTML = name;
        weekdays.append(weekday);
    })

    let countdays = 0, daysOfMonth, flag = false;
    // This loop counts the days from 1 up to the month in the given year
    for (let yyyy = 1; yyyy <= year; yyyy++) {
        for (let mm = 0; mm < 12; mm++) {
            if (mm === 1) {  // February
                if (yyyy % 4 === 0 && yyyy % 100 !== 0 || yyyy % 400 === 0) {  // Leap year
                    daysOfMonth = 29;
                } else { // other year
                    daysOfMonth = 28;
                }
            } else if ([8, 3, 5, 10].includes(mm)) {
                daysOfMonth = 30;
            } else {
                daysOfMonth = 31;
            }
            for (let dd = 1; dd <= daysOfMonth; dd++) {
                countdays++;
            }
            if (yyyy === Number(year) && mm === months.indexOf(month)) {
                flag = true;
                break;
            }
        }
        if (flag) break;
    }

    const days = document.querySelector('.days');
    days.innerHTML = '';
    // Fill blank days of month
    for (let i = 1; i <= (countdays - daysOfMonth) % 7; i++) {
        const day = document.createElement('li');
        day.id = 'empty-day';
        days.append(day);
    }
    // Fill numbered days of month
    for (let i = 1; i <= daysOfMonth; i++) {
        const day = document.createElement('li');
        day.innerHTML = `<a href="${googleSearch(i, month, year)}">${i}</a>`
        days.append(day);
        if (year === now.getFullYear() && month === months[now.getMonth()] && i === now.getDate()) {
            day.id = 'today';
        }
    }
}

function googleSearch(day, month, year) {
    const query = `${day}+${month}+${year}`;
    return 'https://www.google.com/search?q=' + query;
}

function handleSubmit(e) {
    e.preventDefault();
    month = selectMonth.value;
    year = Number(yearInput.value);
    yearInput.blur();
    createCalendar();
}

// /**What happened on this day - onthisday.com*/
// function onthisday(day, month, year) {
//   const query = `${year}/${month}/${day}`;
//   return 'https://www.onthisday.com/date/' + query;
// }