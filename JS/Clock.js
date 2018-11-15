//To get Current Time using web worker 
function worker_function() {

    setInterval(function(){
        let today = new Date();
        let h = checkTime(today.getHours());
        let m = checkTime(today.getMinutes());
        let s = checkTime(today.getSeconds());
        let milliSecsTime = today.getTime(); 
        let time = {
            "hours": h,
            "minutes": m,
            "seconds": s,
            "currentMilli": milliSecsTime,
            "sinceMorning": ((h*60*60)+(m*60)+Number(s)) 
        }
        postMessage(time); 
    },1000)

    // To add leading zeros 
    function checkTime(i) {
        if (i < 10) {i = "0" + i};  
        return i;
    }    
}

if(window!=self)
    worker_function();

//web Worker to bring current Time 
//var worker = new Worker('./JS/Clock.js'); 
var worker = new Worker(URL.createObjectURL(new Blob(["("+worker_function.toString()+")()"], {type: 'text/javascript'})));

// global variable for clearing timeout
var timeout =0;

// Getting Time every second
worker.onmessage = function(event) {
    const hours = event.data.hours;
    const minutes = event.data.minutes;
    const seconds = event.data.seconds;
    const milliseconds = event.data.currentMilli;
    const sinceMorning = event.data.sinceMorning;

    // Hours, Minutes and Seconds hands rotation    
    document.getElementById("hours").style = "transform:rotate("+(hours*30+(minutes/2))+"deg)";
    document.getElementById("minutes").style.transform = "rotate("+(minutes*6)+"deg)";
    document.getElementById("seconds").style.transform = "rotate("+(seconds*6)+"deg)";
    document.getElementById("digitalTime").innerHTML = hours+":"+minutes+":"+seconds;

    const alarms = JSON.parse(localStorage.getItem("alarms"));

    // To check whether current time matches with alarm time and clear it after 1 min
    if(alarms && alarms[sinceMorning] && alarms[sinceMorning]["status"]) {
        const bell = document.getElementById("bell");
        bell.style.display = "block";
        bell.setAttribute("data-alarm-id", sinceMorning);
        var objKey = sinceMorning;
        clearTimeout(timeout);
        timeout = setTimeout(() => 
                   {
                        const bell = document.getElementById("bell");
                        let alrm = JSON.parse(localStorage.getItem("alarms"));
                        const status = document.getElementById(""+objKey);

                        // Hiding the bell
                        bell.style.display = "none";

                        // Setting status of alarm on localstorage
                        alrm[""+objKey] = Object.assign({}, alrm[""+objKey], {status: false});
                        localStorage.setItem("alarms", JSON.stringify(alrm));
                        status.style.backgroundColor = "red";
                        status.nextElementSibling.innerText = "OFF";
                        clearTimeout(timeout);
                    }, 60000);
    }

}

