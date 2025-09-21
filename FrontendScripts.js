let startBtn = document.getElementById('start');
let stopBtn = document.getElementById('stop');
let resetBtn = document.getElementById('reset');

let hour = 0;
let sec = 0;
let min = 0;
let count = 0;

let timer = false;

startBtn.addEventListener('click', function(){
    timer = true;
    stopwatch();
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