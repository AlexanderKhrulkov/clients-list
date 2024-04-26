const SERVER_URL = 'http://localhost:3000'

async function serverAddClient(obj) {
  let response = await fetch(SERVER_URL + '/api/clients', {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(obj),
  });

  let data = await response.json()

  return data;
}

async function serverGetClients() {
  let response = await fetch(SERVER_URL + '/api/clients', {
    method: "GET",
    headers: { 'Content-Type': 'application/json' }
  });

  let data = await response.json()

  return data;
}

async function serverSearchClients(request) {
  let response = await fetch(SERVER_URL + '/api/clients/' + '?search=' + request, {
    method: "GET",
    headers: { 'Content-Type': 'application/json' }
  });

  let data = await response.json()

  return data;
}

async function serverDeleteClients(id) {
  let response = await fetch(SERVER_URL + '/api/clients/' + id, {
    method: "DELETE",
    headers: { 'Content-Type': 'application/json' }
  });

  let data = await response.json()

  return data;
}

async function serverModifyClient(id, obj) {
  let response = await fetch(SERVER_URL + '/api/clients/' + id, {
    method: "PATCH",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(obj)
  });

  let data = await response.json()

  return data;
}

async function serverGetClient(id) {
  let response = await fetch(SERVER_URL + `/api/clients/${id}`, {
    method: "GET",
    headers: { 'Content-Type': 'application/json' }
  });

  let data = await response.json()

  return data;
}


let serverData = await serverGetClients();

let clientsList = [];
console.log(clientsList);

// Создание тултипов
function tooltipInit() {
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
  })
}

// Отрисовка таблицы клиентов
async function tableRender(arg) {
  if (!arg) {
    clientsList = await serverGetClients();
  }
  else {
    clientsList = arg;
  }

  let table = document.querySelector('#sort-table');
  let tbody = table.querySelector('tbody');
  tbody.replaceChildren();

  clientsList.forEach(client => {
    tableBuild(client.id, client.name, client.surname, client.lastName, client.createdAt, client.updatedAt, client.contacts);
  })

  // let modifyClient = document.querySelectorAll('.crm-button_change');
  // modifyClient.forEach(event => {
  //   event.addEventListener('click', () => {
  //     modifyClient(cli);
  //   })
  // })
}

if (serverData !== null) {
  tableRender()
}

const surnameInput = document.querySelector('#surname');
const nameInput = document.querySelector('#name');
const patronymInput = document.querySelector('#patronym');
const modal = document.querySelector('.modal');
const modalInit = new bootstrap.Modal(modal);
const modalForm = modal.querySelector('.modal__form');
const errorMsg = document.querySelector('.error-msg');
const submitModal = document.querySelector('.modal__submit');
let searchInput = document.querySelector('.search__input');


let modalDelete = document.querySelector('.modal-delete');
let deleteInit = new bootstrap.Modal(modalDelete);

const modalAddContact = document.querySelector('.modal__add-contact-button');
let newClientForm = document.querySelector('#exampleModal');
let newClientAddContact = newClientForm.querySelector('.modal__add-contact-button');

// Создание поля нового контакта в модальной форме при клике на кнопку "Добавить контакт"
newClientAddContact.addEventListener('click', function (el) {
  el.preventDefault();
  contactBuild(newClientForm);
  let modalContacts = newClientForm.querySelector('.modal__contacts');
  contactCheck(modalContacts, newClientAddContact);
})

// Функция создания поля контакта в модальной форме
function contactBuild(form, asyncParam) {
  let container = form.querySelector('.modal__contacts');
  let contact = document.createElement('div');
  contact.classList.add('modal__contact', 'contact');
  let selectBox = document.createElement('div');
  selectBox.id = 'contact__select';
  selectBox.setAttribute('name', 'contact');
  let selectInput = document.createElement('div');
  selectInput.classList.add('contact__select-input');
  let optionsBox = document.createElement('div');
  optionsBox.classList.add('contact__box', 'hidden');
  let optionsPhone = document.createElement('div');
  optionsPhone.setAttribute('name', 'Телефон');
  optionsPhone.textContent = 'Телефон';
  let optionsEmail = document.createElement('div');
  optionsEmail.setAttribute('name', 'Email');
  optionsEmail.textContent = 'Email';
  let optionsFb = document.createElement('div');
  optionsFb.setAttribute('name', 'Facebook');
  optionsFb.textContent = 'Facebook';
  let optionsVK = document.createElement('div');
  optionsVK.setAttribute('name', 'VK');
  optionsVK.textContent = 'VK';
  let optionsOther = document.createElement('div');
  optionsOther.setAttribute('name', 'Другое');
  optionsOther.textContent = 'Другое';
  let contactInfo = document.createElement('input');
  contactInfo.setAttribute('type', 'text');
  contactInfo.classList.add('contact__info');
  let deleteButton = document.createElement('button');
  deleteButton.classList.add('contact__delete');

  selectBox.appendChild(selectInput);
  optionsBox.appendChild(optionsPhone);
  optionsBox.appendChild(optionsEmail);
  optionsBox.appendChild(optionsFb);
  optionsBox.appendChild(optionsVK);
  optionsBox.appendChild(optionsOther);
  selectBox.appendChild(optionsBox);
  contact.appendChild(selectBox);
  contact.appendChild(contactInfo);
  contact.appendChild(deleteButton);
  container.appendChild(contact);


  selectInput.textContent = optionsBox.querySelector('div').textContent;

  if (form == document.querySelector('#modalModify') && asyncParam) {
    selectInput.textContent = asyncParam[0];
    contactInfo.value = asyncParam[1];
  }


  selectInput.addEventListener('click', function () {
    optionsBox.classList.toggle('hidden');
  });

  document.addEventListener('click', function (e) {
    if (e.target.className != 'contact__select-input') {
      optionsBox.classList.add('hidden');
    };
  });

  optionsBox.querySelectorAll('div').forEach(function (e) {
    e.addEventListener('click', function () {
      optionsBox.querySelectorAll('div').forEach(function (el) {
        el.classList.remove('hidden');
      })
      e.classList.add('hidden');
      selectInput.textContent = e.textContent;
    })
  })

  deleteButton.addEventListener('click', function () {
    contact.remove();
    let addContactButton = form.querySelector('.modal__add-contact-button');
    contactCheck(container, addContactButton);
  })

}

// Создание клиента
async function addClient() {
  let client = { surname: '', name: '', lastName: '', createdAt: new Date(), updatedAt: new Date(), contacts: [] }
  let valid;
  let contactInput = document.querySelector('.contact__info');
  function validation() {
    if (surnameInput.value != '' && nameInput.value != '' && contactInput.value != '') {
      client.surname = surnameInput.value;
      client.name = nameInput.value;
      client.lastName = patronymInput.value;
      document.querySelectorAll('.modal__contact').forEach(function (e) {
        let typeVal = e.querySelector('.contact__select-input').textContent;
        let valueVal = e.querySelector('.contact__info').value;
        let contact = {
          type: typeVal,
          value: valueVal
        }
        client.contacts.push(contact);
      })

      valid = true;
    }
    else {
      errorMsg.textContent = "Заполните обязательные поля!";
      valid = false;
    }
  }
  validation();
  if (valid == true) {
    let serverDataObj = await serverAddClient(client);
    clientsList.push(serverDataObj);
    console.log(clientsList);
    document.querySelector('tbody').replaceChildren();

    tableRender();

    modalForm.reset();
    modalInit.hide();
  }
}


submitModal.addEventListener('click', function () {
  addClient();
})

// Построение таблицы клиентов
function tableBuild(idValue, nameValue, surnameValue, lastnameValue, createdValue, updatedValue, contactsValue) {
  console.log('test');
  let table = document.querySelector('#sort-table');
  let tbody = table.querySelector('tbody');
  let tr = document.createElement('tr');

  let idCell = document.createElement('td');
  idCell.style.color = 'var(--grey)';
  idCell.style.verticalAlign = 'middle';

  let nameCell = document.createElement('td');
  nameCell.style.verticalAlign = 'middle';
  let nameLink = document.createElement('a');
  nameLink.setAttribute('href', '/');
  nameLink.setAttribute('data-bs-toggle', 'modal');
  nameLink.setAttribute('data-bs-target', '#clientCard');

  let createdCell = document.createElement('td');
  createdCell.style.verticalAlign = 'middle';
  let createdTime = document.createElement('span');
  createdTime.style.color = 'var(--grey)';
  createdTime.style.paddingLeft = '20px';

  let updatedCell = document.createElement('td');
  updatedCell.style.verticalAlign = 'middle';
  let updatedTime = document.createElement('span');
  updatedTime.style.color = 'var(--grey)';
  updatedTime.style.paddingLeft = '20px';

  let contactsCell = document.createElement('td');
  contactsCell.style.verticalAlign = 'middle';
  let contactsContainer = document.createElement('div');
  contactsContainer.classList.add('table__contacts');

  let actionsCell = document.createElement('td');
  actionsCell.style.verticalAlign = 'middle';
  let actionsDiv = document.createElement('div');
  actionsDiv.classList.add('actions');
  let deleteButton = document.createElement('button');
  let changeButton = document.createElement('button');
  changeButton.textContent = 'Изменить';
  deleteButton.textContent = 'Удалить';
  changeButton.setAttribute('type', 'button');
  changeButton.setAttribute('data-bs-toggle', 'modal');
  changeButton.setAttribute('data-bs-target', '#modalModify');
  changeButton.classList.add('crm-button', 'crm-button_change');
  deleteButton.classList.add('crm-button', 'crm-button_delete');
  deleteButton.setAttribute('data-bs-toggle', 'modal');
  deleteButton.setAttribute('data-bs-target', '#deleteClient');

  idCell.innerHTML = idValue;
  tr.appendChild(idCell);
  nameLink.innerHTML = `${surnameValue} ${nameValue} ${lastnameValue}`;
  nameCell.appendChild(nameLink);
  tr.appendChild(nameCell);
  function longDate(value, func) {
    let date = new Date(value).getDate();
    let month = new Date(value).getMonth();
    let hours = new Date(value).getHours();
    let minutes = new Date(value).getMinutes();
    if (func == 'date') {
      if (date < 10) date = '0' + date;
      return date;
    }
    if (func == 'month') {
      if (month < 10) month = '0' + month;
      return month;
    }
    if (func == 'hours') {
      if (hours < 10) hours = '0' + hours;
      return hours;
    }
    if (func == 'minutes') {
      if (minutes < 10) minutes = '0' + minutes;
      return minutes;
    }

  }
  createdCell.innerHTML = `${longDate(createdValue, 'date')}.${longDate(createdValue, 'month')}.${new Date(createdValue).getFullYear()}`;
  createdTime.innerHTML = longDate(createdValue, 'hours') + ':' + longDate(createdValue, 'minutes');
  createdCell.append(createdTime);
  tr.appendChild(createdCell);
  updatedCell.innerHTML = `${longDate(updatedValue, 'date')}.${longDate(updatedValue, 'month')}.${new Date(updatedValue).getFullYear()}`;
  updatedTime.innerHTML = longDate(updatedValue, 'hours') + ':' + longDate(updatedValue, 'minutes');
  updatedCell.append(updatedTime);
  tr.appendChild(updatedCell);

  contactsValue.forEach(function (el) {
    let contactIcon = document.createElement('div');
    contactIcon.setAttribute('data-bs-toggle', 'tooltip');
    contactIcon.setAttribute('title', `${el.type} : ${el.value}`);
    contactIcon.setAttribute('data-bs-placement', 'top');

    if (el.type == 'Телефон') {
      contactIcon.classList.add('table__contact-icon', 'table__contact-icon_phone');
    }
    if (el.type == 'Email') {
      contactIcon.classList.add('table__contact-icon', 'table__contact-icon_email');
    }
    if (el.type == 'Facebook') {
      contactIcon.classList.add('table__contact-icon', 'table__contact-icon_fb');
    }
    if (el.type == 'VK') {
      contactIcon.classList.add('table__contact-icon', 'table__contact-icon_vk');
    }
    if (el.type == 'Другое') {
      contactIcon.classList.add('table__contact-icon', 'table__contact-icon_other');
    }
    contactsContainer.appendChild(contactIcon);
  })
  contactsCell.append(contactsContainer);
  tr.appendChild(contactsCell);
  actionsDiv.appendChild(changeButton);
  actionsDiv.appendChild(deleteButton);
  actionsCell.appendChild(actionsDiv);
  tr.appendChild(actionsCell);
  tbody.appendChild(tr);
  tooltipInit();

  function mod() {
    modifyClient(idValue);
  }


  changeButton.addEventListener('click', mod);

  let modifymodal = document.querySelector('#modalModify');

  modifymodal.addEventListener('hidden.bs.modal', () => {
    console.log('closed');
    changeButton.removeEventListener('click', mod);
  })



  deleteButton.addEventListener('click', async function () {
    let deleteClient = modalDelete.querySelector('.modal-delete__submit');
    deleteClient.addEventListener('click', async function () {
      await serverDeleteClients(idValue);
      deleteInit.hide();
      tableRender();
    })
  })

}

// Ограничение работы кнопки "Добавить контакт" 10 контактами
function contactCheck(box, btn) {
  if (box.children.length >= 10) {
    btn.style.display = 'none';
  }
  else {
    btn.style.display = 'block';
  }
}

// Изменение клиента
async function modifyClient(id) {
  let client = { surname: '', name: '', lastName: '', updatedAt: new Date(), contacts: [] }
  let clientModified = await serverGetClient(id);
  console.log(clientModified);
  let modifyForm = document.querySelector('#modalModify');
  let container = modifyForm.querySelector('.modal__contacts');
  let addContactButton = modifyForm.querySelector('.modal__add-contact-button');
  let submitButton = modifyForm.querySelector('.modal__submit');
  let deleteButton = modifyForm.querySelector('.modal__delete');
  container.replaceChildren();
  let idSpan = modifyForm.querySelector('.id');
  let surnameModify = modifyForm.querySelector('#surnameModify');
  let nameModify = modifyForm.querySelector('#nameModify');
  let patronymModify = modifyForm.querySelector('#patronymModify');
  idSpan.textContent = clientModified.id;


  function focusCheck(input) {
    if (input.value != '') {
      input.classList.add('focused');
    }
  }
  surnameModify.value = clientModified.surname;
  nameModify.value = clientModified.name;
  patronymModify.value = clientModified.lastName;
  focusCheck(surnameModify);
  focusCheck(nameModify);
  focusCheck(patronymModify);
  clientModified.contacts.forEach(async function (e) {
    contactBuild(modifyForm, Object.values(e));
  });

  contactCheck(container, addContactButton);

  addContactButton.addEventListener('click', function (el) {
    el.preventDefault();
    contactBuild(modifyForm);
    contactCheck(container, addContactButton);
    // console.log('test');
  })

  submitButton.addEventListener('click', async function () {
    client.surname = surnameModify.value;
    client.name = nameModify.value;
    client.lastName = patronymModify.value

    modifyForm.querySelectorAll('.modal__contact').forEach(function (e) {
      let typeVal = e.querySelector('.contact__select-input').textContent;
      let valueVal = e.querySelector('.contact__info').value;
      let contact = {
        type: typeVal,
        value: valueVal
      }
      client.contacts.push(contact);
    })
    let clientPatched = await serverModifyClient(id, client);
    console.log(clientPatched);
    await serverModifyClient(id, client);
    tableRender();
  })

  deleteButton.addEventListener('click', function () {
    let deleteClient = modalDelete.querySelector('.modal-delete__submit');
    deleteClient.addEventListener('click', async function () {
      await serverDeleteClients(id);
      deleteInit.hide();
      tableRender();
    })
  })
}


// Сортировка
document.querySelectorAll('.sort-button').forEach(function (el) {
  let ascSort = false;

  el.addEventListener('click', function () {
    let name = el.getAttribute('name');

    switch (ascSort) {
      case false:
        let ascSortFunc = clientsList.sort(function (a, b) {
          if (name == 'id') {

            if (a['id'] < b['id']) return -1;
          }
          if (name == 'fio') {
            if (a['surname'] < b['surname']) return -1;
          }
          if (name == 'created') {
            if (a['createdAt'] < b['createdAt']) return -1;
          }
          if (name == 'changed') {
            if (a['updatedAt'] < b['updatedAt']) return -1;
          }

        });
        tableRender(ascSortFunc);
        ascSort = true;
        el.classList.add('sort-asc');
        el.classList.remove('sort-desc');
        break;

      case true:
        let descSortFunc = clientsList.sort(function (a, b) {
          if (name == 'id') {
            if (a['id'] > b['id']) return -1;
          }
          if (name == 'fio') {
            if (a['surname'] > b['surname']) return -1;
          }
          if (name == 'created') {
            if (a['createdAt'] > b['createdAt']) return -1;
          }
          if (name == 'changed') {
            if (a['updatedAt'] > b['updatedAt']) return -1;
          }
        });
        tableRender(descSortFunc);
        ascSort = false;
        el.classList.remove('sort-asc');
        el.classList.add('sort-desc');
        break;
    }
  })
})

// Поиск
searchInput.addEventListener('input', function() {
  setTimeout(async function() {
    let searchRequest = searchInput.value;
  console.log(searchRequest);
  console.log(clientsList);
  clientsList = await serverSearchClients(searchRequest);
  tableRender(clientsList);
  }, 300);

})

