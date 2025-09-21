let startBtn = document.getElementById('start');
let stopBtn = document.getElementById('stop');
let resetBtn = document.getElementById('reset');

let hour = 0;
let sec = 0;
let min = 0;
let count = 0;

let timer = false;

startBtn.addEventListener('click', function(){
    if(timer==false){
    timer = true;
    stopwatch();
    }
});

stopBtn.addEventListener('click', function(){
    timer = false;
});

resetBtn.addEventListener('click', function(){
    timer = false;
    hour = 0;
    min = 0;
    sec = 0;
    count = 0;

    document.getElementById('hr').innerHTML = "00";
    document.getElementById('min').innerHTML = "00";
    document.getElementById('sec').innerHTML = "00";
});

function stopwatch(){
    if(timer){
        count++;
        if(count == 100){
            sec++;
            count = 0;
        }
        if(sec == 60){
            min++;
            sec = 0;
        }
        if (min == 60){
            hour++;
            min = 0;
        }
        
        let hourStr = hour;
        let minStr = min;
        let secStr = sec;

        if(hourStr < 10){
            hourStr = "0" + hourStr;
        }
        if(minStr < 10){
            minStr = "0" + minStr;
        }
        if(secStr < 10){
            secStr = "0" + secStr;
        }

        document.getElementById('hr').innerHTML = hourStr;
        document.getElementById('min').innerHTML = minStr;
        document.getElementById('sec').innerHTML = secStr;
        
        setTimeout(stopwatch, 10);
    }
}

// Calendar functionality
class Calendar {
    constructor() {
        this.currentDate = new Date();
        this.selectedDate = null;
        this.events = {}; // Store events by date
        this.init();
    }

    init() {
        this.render();
        this.addEventListeners();
    }

    addEventListeners() {
        document.getElementById('prevMonth').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.render();
        });

        document.getElementById('nextMonth').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.render();
        });
    }

    render() {
        this.renderHeader();
        this.renderDates();
    }

    renderHeader() {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        const monthYear = `${monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
        document.getElementById('currentMonth').textContent = monthYear;
    }

    renderDates() {
        const datesContainer = document.getElementById('calendar-dates');
        datesContainer.innerHTML = '';

        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        // First day of the month
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        
        // Start from Sunday of the week containing the first day
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());
        
        // End at Saturday of the week containing the last day
        const endDate = new Date(lastDay);
        endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));

        const today = new Date();
        const currentDate = new Date(startDate);

        while (currentDate <= endDate) {
            const dateElement = this.createDateElement(currentDate, month, today);
            datesContainer.appendChild(dateElement);
            currentDate.setDate(currentDate.getDate() + 1);
        }
    }

    createDateElement(date, currentMonth, today) {
        const dateElement = document.createElement('div');
        dateElement.className = 'calendar-date';
        dateElement.textContent = date.getDate();

        // Add classes for styling
        if (date.getMonth() !== currentMonth) {
            dateElement.classList.add('other-month');
        }

        if (this.isSameDay(date, today)) {
            dateElement.classList.add('today');
        }

        if (this.selectedDate && this.isSameDay(date, this.selectedDate)) {
            dateElement.classList.add('selected');
        }

        // Check if date has events
        const dateKey = this.formatDateKey(date);
        if (this.events[dateKey] && this.events[dateKey].length > 0) {
            dateElement.classList.add('has-event');
            dateElement.title = this.events[dateKey].join(', ');
        }

        // Add click event
        dateElement.addEventListener('click', () => {
            if (date.getMonth() === currentMonth) {
                this.selectDate(date);
            }
        });

        return dateElement;
    }

    selectDate(date) {
        this.selectedDate = new Date(date);
        this.render();
        this.updateSelectedDateInfo();
        
        console.log('Selected date:', this.formatDateKey(date));
    }

    updateSelectedDateInfo() {
        const infoDiv = document.getElementById('selectedDateInfo');
        if (this.selectedDate) {
            const dateStr = this.selectedDate.toLocaleDateString();
            const dateKey = this.formatDateKey(this.selectedDate);
            const events = this.events[dateKey] || [];
            
            let html = `<strong>Selected: ${dateStr}</strong><br>`;
            if (events.length > 0) {
                html += `<strong>Events:</strong><br>`;
                events.forEach((event, index) => {
                    html += `• ${event} <button onclick="calendar.removeEvent(calendar.selectedDate, '${event}')" style="margin-left: 10px; font-size: 12px;">Remove</button><br>`;
                });
            } else {
                html += '<em>No events for this date</em>';
            }
            
            infoDiv.innerHTML = html;
        } else {
            infoDiv.innerHTML = 'Click on a date to select it';
        }
    }

    addEvent(date, eventText) {
        const dateKey = this.formatDateKey(date);
        if (!this.events[dateKey]) {
            this.events[dateKey] = [];
        }
        this.events[dateKey].push(eventText);
        this.render();
        this.updateSelectedDateInfo();
    }

    removeEvent(date, eventText) {
        const dateKey = this.formatDateKey(date);
        if (this.events[dateKey]) {
            this.events[dateKey] = this.events[dateKey].filter(event => event !== eventText);
            if (this.events[dateKey].length === 0) {
                delete this.events[dateKey];
            }
            this.render();
            this.updateSelectedDateInfo();
        }
    }

    formatDateKey(date) {
        return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    }

    isSameDay(date1, date2) {
        return date1.getDate() === date2.getDate() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getFullYear() === date2.getFullYear();
    }
}

// Initialize calendar when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.calendar = new Calendar();
    
    // Add event listener for adding events
    document.getElementById('addEventBtn').addEventListener('click', function() {
        const eventText = document.getElementById('eventText').value.trim();
        if (eventText && calendar.selectedDate) {
            calendar.addEvent(calendar.selectedDate, eventText);
            document.getElementById('eventText').value = '';
        } else if (!calendar.selectedDate) {
            alert('Please select a date first');
        } else {
            alert('Please enter an event description');
        }
    });
    
    // Add event listener for Enter key in event input
    document.getElementById('eventText').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('addEventBtn').click();
        }
    });
    
    // Example: Add some sample events
    const today = new Date();
    calendar.addEvent(today, 'Today\'s tasks');
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    calendar.addEvent(tomorrow, 'Meeting at 2 PM');
});