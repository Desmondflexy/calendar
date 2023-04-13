const selectMonth = document.querySelector('select');
const yearInput = document.querySelector('input');
const enterBtn = document.querySelector('button');

const timeNow = document.querySelector('footer');
const month_year = document.querySelector('.month-year');
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

// Populate month select button with options
months.forEach(month => {
    const option = document.createElement('option')
    option.textContent = option.value = month;
    selectMonth.appendChild(option)
})

// Display current calendar date on page load.
let now = new Date();
createCalendar(months[now.getMonth()], now.getFullYear());

// At the click of the enter button.
enterBtn.addEventListener('click', (e) => {
    createCalendar(selectMonth.value, yearInput.value);
    e.preventDefault();
})

// Add event listener to date footer: return to today when clicked
timeNow.addEventListener('click', () => {
    now = new Date();
    createCalendar(months[now.getMonth()], now.getFullYear());
})

// Add event listener to prev and next month button

document.querySelector('.prev').addEventListener('click', () => {
    const MonthYear = month_year.textContent.split(' ')
    let month = MonthYear[0], year = MonthYear[1];
    let m = months.indexOf(month) - 1;

    if (m < 0) {
        year--;
        createCalendar(months[11], year);
    } else {
        createCalendar(months[m], year);
    }
})

document.querySelector('.next').addEventListener('click', () => {
    const MonthYear = month_year.textContent.split(' ')
    let month = MonthYear[0], year = MonthYear[1];
    let m = months.indexOf(month) + 1;

    if (m > 11) {
        year++;
        createCalendar(months[0], year);
    } else {
        createCalendar(months[m], year);
    }
})

// User input validation: disable enter btn if input invalid
yearInput.addEventListener('input', () => {
    if (yearInput.validity.rangeUnderflow || yearInput.validity.rangeOverflow) {
        yearInput.setCustomValidity('Input must be within 1582 and 2100');
        yearInput.reportValidity();
        enterBtn.disabled = true;
    } else {
        yearInput.setCustomValidity("");
        enterBtn.disabled = false;
    }
})

// Changes the time display on the red footer every second
setInterval(() => {
    now = new Date();
    timeNow.textContent = `${now.toDateString()}, ${now.toLocaleTimeString()}`;
}, 1000);

//
function createCalendar(month, year) {
    /* List out the number of days in month of year. */

    // Validates inputs entered from the browser console. Just for debugging sakes.
    if (!(months.includes(month)) || year < 1582 || year > 2100) {
        console.log('Error in createCalendar: Invalid input.')
        return;
    }

    // Update the values on the form
    selectMonth.value = month;
    yearInput.value = year;

    month_year.textContent = `${month} ${year}`;

    const weekdays = document.querySelector('.weekdays');
    weekdays.innerHTML = '';
    for (let i of ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun']) {
        const weekday = document.createElement('li');
        weekday.textContent = i;
        weekdays.appendChild(weekday);
    }

    let countdays = 0, daysOfMonth, flag = false;
    // This loop counts the days from 1900 up to the month in the given year
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
        days.appendChild(day);
    }
    // Fill numbered days of month
    for (let i = 1; i <= daysOfMonth; i++) {
        const day = document.createElement('li');
        day.innerHTML = `<a href="${googleSearch(i, month, year)}">${i}</a>`
        days.appendChild(day);
        if (Number(year) === now.getFullYear() && month === months[now.getMonth()] && i === now.getDate()) {
            day.id = 'today';
            day.innerHTML = `<a href="https://www.britannica.com/on-this-day">${i}</a>`
        }
    }

    console.log("All's good with createCalendar :)")
}

/**What happened on this day - onthisday.com*/
function onthisday(day, month, year) {
    const query = `${year}/${month}/${day}`;
    return 'https://www.onthisday.com/date/' + query;
}

/**Search this date on google.com */
function googleSearch(day, month, year) {
    const query = `${day}+${month}+${year}`;
    return 'https://www.google.com/search?q=' + query;
}
