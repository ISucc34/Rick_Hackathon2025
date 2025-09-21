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
        this.updateSelectedDateInfo();
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
            // Create a new Date object for each iteration to avoid reference issues
            const dateForElement = new Date(currentDate);
            const dateElement = this.createDateElement(dateForElement, month, today);
            datesContainer.appendChild(dateElement);
            currentDate.setDate(currentDate.getDate() + 1);
        }
    }

    createDateElement(date, currentMonth, today) {
        const dateElement = document.createElement('div');
        dateElement.className = 'calendar-date';
        dateElement.textContent = date.getDate();

        // Store the date data for easier access
        dateElement.dataset.date = this.formatDateKey(date);
        dateElement.dataset.month = date.getMonth();
        dateElement.dataset.currentMonth = currentMonth;

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

        // Add click event with improved handling
        dateElement.addEventListener('click', ((clickedDate) => {
            return (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                console.log('Date clicked:', clickedDate.toDateString(), 'Currently selected:', this.selectedDate ? this.selectedDate.toDateString() : 'none');
                
                // Toggle selection: if clicking the same date, deselect it
                if (this.selectedDate && this.isSameDay(clickedDate, this.selectedDate)) {
                    this.deselectDate();
                } else {
                    this.selectDate(new Date(clickedDate));
                }
            };
        })(new Date(date)));

        // Add visual feedback on mousedown
        dateElement.addEventListener('mousedown', () => {
            dateElement.style.transform = 'scale(0.95)';
        });

        dateElement.addEventListener('mouseup', () => {
            dateElement.style.transform = '';
        });

        return dateElement;
    }

    selectDate(date) {
        this.selectedDate = new Date(date);
        this.render();
        this.updateSelectedDateInfo();
        
        console.log('Selected date:', this.formatDateKey(date));
    }

    deselectDate() {
        this.selectedDate = null;
        this.render();
        this.updateSelectedDateInfo();
        
        console.log('Date deselected');
    }

    updateSelectedDateInfo() {
        const infoDiv = document.getElementById('selectedDateInfo');
        if (this.selectedDate) {
            const dateStr = this.selectedDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric', 
                month: 'long', 
                day: 'numeric'
            });
            const dateKey = this.formatDateKey(this.selectedDate);
            const events = this.events[dateKey] || [];
            
            let html = `<strong>📅 Selected: ${dateStr}</strong><br>`;
            if (events.length > 0) {
                html += `<strong>📋 Events (${events.length}):</strong><br>`;
                events.forEach((event, index) => {
                    html += `• ${event} <button onclick="calendar.removeEvent(calendar.selectedDate, '${event}')" style="margin-left: 10px; font-size: 12px; padding: 2px 6px; background: #ff4757; color: white; border: none; border-radius: 3px; cursor: pointer;">❌</button><br>`;
                });
            } else {
                html += '<em>📝 No events for this date. Add one above!</em>';
            }
            html += '<br><small style="color: #666;">💡 Click the same date again to deselect it</small>';
            
            infoDiv.innerHTML = html;
        } else {
            infoDiv.innerHTML = '👆 <strong>No date selected</strong><br>Click on any date to select it and add events<br><small style="color: #666;">💡 Click the same date twice to deselect it</small>';
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
            // If no date selected, offer to select today's date
            if (confirm('No date selected. Would you like to add this event to today?')) {
                calendar.selectDate(new Date());
                calendar.addEvent(calendar.selectedDate, eventText);
                document.getElementById('eventText').value = '';
            }
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