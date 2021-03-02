const clear = document.querySelector('.clear');
const dateElement = document.getElementById('date');
const list = document.getElementById('list');
const plusBtn = document.querySelector('.plus');
const input = document.getElementById('input');
const theDiv = document.querySelector('.main');
 
const CHECK = 'fa-check-circle';
const UNCHECK = 'fa-circle-thin';
const LINE_THROUGH = 'lineThrough';

let LIST = [], id = 0;

let data = localStorage.getItem('TODO');

if (data) {
    LIST = JSON.parse(data); 
    id = LIST.length; 
    stoerAndUpdateList(LIST); 
} else {
    LIST = [];
    id = 0;
}


options = {weekday: 'long', month: 'long', day: 'numeric'}
today = new Date();
dateElement.innerHTML = today.toLocaleDateString('en-GB', options)

document.addEventListener('keyup', e => {
    if(e.keyCode == 13) {
        const toDo = input.value;
        if (toDo) {
            adToDo(toDo, id, false, false);
            
            LIST.push({
                name: toDo,
                id: id,
                done: false,
                trash: false
            })
        }
        localStorage.setItem('TODO', JSON.stringify(LIST));
        id++
        input.value = '';
    }
})

plusBtn.addEventListener('click', () => {
    const toDo = input.value; 
    if (toDo) {
        adToDo(toDo, id, false, false);

        LIST.push({
            name: toDo,
            id: id,
            done: false,
            trash: false
        })
    }
    localStorage.setItem('TODO', JSON.stringify(LIST));
    id++;
    input.value = '';
})

list.addEventListener('click', e => {
    const element = e.target;
    const elementJob = element.attributes.job.value;
    
    if (elementJob == 'complete') {
        completeToDo(element);
    } else if (elementJob == 'delete') {
        removeToDo(element);
    }
    localStorage.setItem('TODO', JSON.stringify(LIST));
})

clear.addEventListener('click', () => {
    localStorage.clear();
    location.reload();
})

function adToDo(toDo, id, done, trash, on) {

    if (trash) {return;}

    const DONE = done ? CHECK : UNCHECK;
    const LINE = done ? LINE_THROUGH : '';

    item = `
        <li class="item">
            <i class="fa ${DONE} co" job="complete" id="${id}"></i>
            <p class="text ${LINE}">${toDo}</p>
            <i class="fa fa-trash-o de" job="delete" id="${id}"></i>
        </li>
       `
position = 'beforeend';
list.insertAdjacentHTML(position, item);
}

function completeToDo(e) {
    e.classList.toggle(CHECK);
    e.classList.toggle(UNCHECK);
    e.parentNode.querySelector('.text').classList.toggle(LINE_THROUGH);

    LIST[e.id].done = LIST[e.id].done ? false : true;
}

function removeToDo(e) {
    e.parentNode.parentNode.removeChild(e.parentNode);
    LIST[e.id].trash = true;
}


function stoerAndUpdateList(array) {
    array.forEach(item => {
        adToDo(item.name, item.id, item.done, item.trash);
    });
}

/////////////////////////////////////////////////

const alarmBtn = document.querySelectorAll('alarm-btn');
const cancelBtn = document.querySelectorAll('cancel-btn');
const div = document.querySelector('.div');

let sound = new Audio();
sound.src = 'alarm.mp3';
let timer;

startTimer();
let alarms = [];


function render() {
  alarms.forEach((items, index) => {

    if (alarms[index].rendered) {
      return;
    }

    alarms[index].rendered = true;

    const alarmsItems = document.createElement("div");
    alarmsItems.id = 'date-alarms-item-' + index; 

    const title = document.createElement('input');
    title.type = 'text';
    title.className = 'title';
    title.placeholder = 'Your Reminder...'
    title.setAttribute('data-title-id', '' + index);
    alarmsItems.appendChild(title);
  
    const input = document.createElement('input');
    input.type = 'datetime-local';
    input.className = 'alarm-time';
    input.id = 'date-', '' + index; 
    input.setAttribute('data-date-id', '' + index)
    alarmsItems.appendChild(input);

    const alarmBtn = document.createElement('button');
    alarmBtn.className = 'btn btn-success alarm-btn';
    alarmBtn.textContent = 'Set Alarm';
    alarmBtn.setAttribute('data-alarm-id', '' + index)
    alarmBtn.style.display = '';
    alarmsItems.appendChild(alarmBtn);

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'btn btn-danger cancel-btn';
    cancelBtn.setAttribute('data-cancel-id', '' + index)
    cancelBtn.textContent = 'Cancel';
    cancelBtn.style.display = 'none';
    alarmsItems.appendChild(cancelBtn);

    const span = document.createElement('span');
    const txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.appendChild(txt);
    alarmsItems.appendChild(span);

    div.appendChild(alarmsItems);
    
  });
  deleteList()
}

function deleteList() {

let close = document.getElementsByClassName("close");

  for (let i = 0; i < close.length; i++) {
    close[i].onclick = function() {
      let el = this.parentElement;
      el.style.display = "none";
    }
  }
}

function initAlarm(index) {
  sound.loop = true;
  sound.play();

  let alarmBtn = document.querySelector(`[data-alarm-id='${index}']`);
  let cancelBtn = document.querySelector(`[data-cancel-id='${index}']`);
  alarmBtn.style.display = 'none';
  cancelBtn.style.display = '';
}

function addElement() {
  
  alarms.push({
    'title': '',
    'alarm_at': null,
    rendered: false,
  });

  render();
  events();
}

function setAlarm(id) {
  const nowTime = document.querySelector(`[data-date-id='${id}']`);

    let time = nowTime.valueAsNumber;
    if (isNaN(time)) {
        alert('Invalid Input');
        return;
    }

  const alarm = new Date(time);
  const alarmTime = new Date(alarm.getUTCFullYear(), alarm.getUTCMonth(), alarm.getUTCDate(), alarm.getUTCHours(), alarm.getUTCMinutes(), alarm.getUTCSeconds());

  alarms[id]['alarm_at'] = alarmTime;
}

function startTimer() {
  timer = setInterval(function () {
    alarms.forEach(function (item, index) {
      if (!item.alarm_at) {
          return;
      }
      let alarm = new Date(item.alarm_at);
      let current = new Date();
      if (current > alarm) {
          alarms[index]['alarm_at'] = null
          initAlarm(index)
      }
    });
  }, 3000)
}

function cancelAlarm(index) {
  sound.pause();

  let alarmBtn = document.querySelector(`[data-alarm-id='${index}']`);
  let cancelBtn = document.querySelector(`[data-cancel-id='${index}']`);
  alarmBtn.style.display = '';
  cancelBtn.style.display = 'none';
}

function events() {

  const alarmButtons = document.querySelectorAll('.alarm-btn');
  const cancelButtons = document.querySelectorAll('.cancel-btn');

  alarmButtons.forEach(function (alarmBtn) {
      let id = alarmBtn.getAttribute('data-alarm-id');

      if (alarms[id]['alarm-event']) {
          return;
      }

      alarms[id]['alarm-event'] = true;

      alarmBtn.addEventListener('click', () => {
          setAlarm(id);
      });
  })

  cancelButtons.forEach(function (cancelBtn) {

      let id = cancelBtn.getAttribute('data-cancel-id');

      if (alarms[id]['cancel-event']) {
          return;
      }

      alarms[id]['cancel-event'] = true;

      cancelBtn.addEventListener('click', () => {
        cancelAlarm(id);
      });
  })
}
