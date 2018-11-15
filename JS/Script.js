//Show Modal to enter Time
function displayModal(){
   modal.style.display = "block"; 
}

//Close Time Modal
function closeModal() {
    modal.style.display = "none";
}

//Close if clicked anywhere otherthan Modal
function handleDocumentClick(e) {
    if(!e.target.closest(".modalContent")){
        closeModal();
    }
}

// Close modal on pressing esc button
function handleKeyDown(e) {
        if(e.keyCode === 27) {
            closeModal();
        }                    
}

var alarms = JSON.parse(localStorage.getItem("alarms"));
var alarmNumber = 0;

//load alarms stored in localStorage on loading
window.onload = function() {
    loaddata();                       
    document.getElementById('saveAlarm').addEventListener('click', saveAlarm, false);
    //document.getElementById("alarmSound").pause();
};


// To display alarms stored in localStorage
function loaddata() {

    var alarms = localStorage.getItem("alarms");
    alarms = JSON.parse(alarms);
    if(alarms){
        for(key in alarms){
            let i=alarmNumber;
            if(alarms.hasOwnProperty(key)){
                let alarm = alarms[key];
                appendRow(i, alarm);
                alarmNumber++;
            }
        }
    }
}


// To show newly added alarm
function appendRow(i, alarm) {
    let table = document.getElementById("multipleAlarms");
    let row = table.insertRow(i);
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    const color = alarm.status?'green':'red';
    const statusText = alarm.status?"ON":"OFF";
    cell1.innerHTML = '<span id="alarm'+i+'" class="alarms">'+ alarm.time +'</span>';
    cell2.innerHTML = '<div><div id='+alarm.milli+' data-time="'+alarm.milli+'" data-status="'+alarm.status+'" onclick="changeStatus(this);" class="active" style="background-color: '+color+'" ></div><p class="statusText" id="statusText'+i+'">'+statusText+'</p></div>';
}


// To save alarm to local Storage
function saveAlarm(){
    if(alarmNumber<5) {
        let hoursSelect = document.getElementById("hoursSelect").value;
        let minutesSelect = document.getElementById("minutesSelect").value;                 
        let ampmSelect = document.getElementById("ampmSelect").value;

        if(ampmSelect == "PM" && hoursSelect!=="12"){
            hoursSelect = parseInt(hoursSelect)+12;
        }
        if(ampmSelect == "AM" && hoursSelect==="12"){
            hoursSelect = "00";
        }

        t = hoursSelect+":"+minutesSelect;
        let milli = (hoursSelect*60*60+minutesSelect*60);
        alarm = {"milli":milli,
                 "time":t,
                 "status": true
                };
        const key = ""+milli;
        if(!alarms) {
            alarms = {};
        }

        alarms[key] = alarm;

        localStorage.setItem("alarms", JSON.stringify(alarms));
        closeModal();
        appendRow(alarmNumber, alarm);
        document.getElementById("message").innerHTML = "";
        alarmNumber++;
    } else {
        closeModal();
        document.getElementById("message").innerHTML = "Max alarms added. Can't add anymore";
    }
}


//To show the status of the alarm
function changeStatus(element) {
   let alarms = JSON.parse(localStorage.getItem("alarms"));
   const status = element.getAttribute("data-status") === "true";
    
   element.style.backgroundColor = status?"red":"green";
   element.nextElementSibling.innerHTML= status?"OFF":"ON";
   element.setAttribute("data-status", status?"false":"true");
   const alarmObj = alarms[element.getAttribute("data-time")];
   alarms[element.getAttribute("data-time")] = Object.assign({}, alarmObj, {status: !status});

   localStorage.setItem("alarms", JSON.stringify(alarms));
}

// To stop Alarm
function stopAlarm() {
    const bell = document.getElementById("bell");
    const alarmTime = bell.getAttribute("data-alarm-id");
    const alarm = document.getElementById(alarmTime);
    bell.style.display = "none";
    alarm.style.backgroundColor = "red";
    alarm.nextElementSibling.innerHTML = "OFF";
    
    let alrm = JSON.parse(localStorage.getItem("alarms"));
    
    alrm[""+alarmTime] = Object.assign({}, alrm[""+alarmTime], {status: false});
    
    localStorage.setItem("alarms", JSON.stringify(alrm));

}

