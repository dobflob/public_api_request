/* Global Variables */
const search = createSearchForm();
const searchInput = document.getElementById('search-input');
const gallery = document.getElementById('gallery');
const modal = createModalSkeleton();
const modalClose = document.querySelector('.modal-close-btn');
const modalInfoContainer = document.querySelector('.modal-info-container');
const modalPrev = document.querySelector('#modal-prev');
const modalNext = document.querySelector('#modal-next');

let cardList;
let employees = []; // update to get data from random user api
let filteredEmployees = []; // this may need to await server response (assign within promise chain)
let employeeIndex = '';

/* Get Data from API */
/**
 * Make API call to get 12 random users
 * Parse respone to JSON
 * set the value of employees variable
 * set the value of the filteredEmployees variable
 * call displayEmployeeGrid to populate gallery with results
 */
fetch('https://randomuser.me/api/?results=12&nat=us&exc=gender,login,registered,phone,id,nat')
    .then(results => results.json())
    .then(data => employees = data.results)
    .then(employees => filteredEmployees = employees)
    .then(employees => displayEmployeeGrid(employees));

/* Display Functions */
/**
 * Builds the search area and displays on the page
 */
function createSearchForm() {
    const searchContainer = document.querySelector('.search-container');
    const html = `
        <form action="#" method="get">
            <input type="search" id="search-input" class="search-input" placeholder="Search...">
            <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
        </form>
    `;

    searchContainer.insertAdjacentHTML('beforeend', html);
    return document.querySelector('form');
};

/**
 * Builds the skeleton of the modal (all the parts that don't change between employees)
 */
function createModalSkeleton() {
    const modalHtml = `
        <div class="modal-container hide">
            <div class="modal">
                <button type="button" id="modal-close-btn" class="modal-close-btn">
                    <strong>X</strong>
                </button>

                <div class="modal-info-container">
                </div>
            </div>

            <div class="modal-btn-container">
                <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                <button type="button" id="modal-next" class="modal-next btn">Next</button>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    return document.querySelector('.modal-container');
};

/** 
 * Creates the employee cards and adds them to the gallery to be displayed on page
 * Gets called by the fetch promise chain to display initial grid view
 * @param {array} employees array of employee objects returned from random users api or from @function filterEmployees()
 */
function displayEmployeeGrid(employees) {
    gallery.innerHTML = '';
    employees.forEach(employee => {
        const html = `
            <div class="card">
                <div class="card-img-container">
                    <img class="card-img" src="${employee.picture.large}" alt="${employee.name.first}'s profile picture" title="${employee.name.first}'s profile picture">
                </div>
                <div class="card-info-container">
                    <h3 id="name" class="card-name cap">${employee.name.first} ${employee.name.last}</h3>
                    <p class="card-text">${employee.email}</p>
                    <p class="card-text cap">${employee.location.city}, ${employee.location.state}</p>
                </div>
            </div>
        `;

        gallery.insertAdjacentHTML('beforeend', html);
        cardList = [...gallery.children];
    });
};

/**
 * Creates the employee specific DOM elements to insert within the modal skeleton for display
 * Called by gallery click event and by modalNext, modalPrev click events
 * @param {number} index the index number from the gallery HTMLCollection array set in @function displayEmployeeGrid()
 */
function displayEmployeeDetails(index) {
    const employee = filteredEmployees[index];
    const employeeBirthday = transformDate(employee.dob.date);
    const infoHtml = `
        <img class="modal-img" src="${employee.picture.large}" alt="${employee.name.first}'s profile picture" title="${employee.name.first}'s profile picture">
        <h3 id="name" class="modal-name cap">${employee.name.first} ${employee.name.last}</h3>
        <p class="modal-text">${employee.email}</p>
        <p class="modal-text">${employee.location.city}</p>
        <hr>
        <p class="modal-text">${employee.cell}</p>
        <p class="modal-text">${employee.location.street.number} ${employee.location.street.name}, ${employee.location.city}, ${employee.location.state} ${employee.location.postcode}</p>
        <p class="modal-text">Brithday: ${employeeBirthday}</p>
    `;

    modalInfoContainer.insertAdjacentHTML('beforeend', infoHtml);
    
    if (modal.classList.contains('hide')) {
        modal.classList.remove('hide');
    };
};

/**
 * Clears the employee details from the modal skeleton
 * Called by modalClose, modalNext, modalPrev click events
 */
function clearEmployeeDetails() {
    modalInfoContainer.innerHTML = '';
};

/* Helper Functions */
/**
 * Called by gallery click event
 * @param {*} element html element that is event target
 * @returns index of the clicked card
 */
function getEmployeeIndex(element) {
    let selectedEmployee = '';
    
    if (element.className === 'card') {
        selectedEmployee = element;
    } else if (element.tagName === 'DIV') {
        selectedEmployee = element.parentNode;
    } else {
        selectedEmployee = element.parentNode.parentNode;
    }

    employeeIndex = cardList.indexOf(selectedEmployee);
    return employeeIndex;
};

/**
 * Called by search click and keyup events when there are cards displayed in grid
 * @param {*} text 
 */
function filterEmployees(text) {
    employees.forEach(employee => {
        let firstName = employee.name.first.toLowerCase();
        let lastName = employee.name.last.toLowerCase();

        if(firstName.includes(text.toLowerCase()) || lastName.includes(text.toLowerCase())) {
            filteredEmployees.push(employee);
        }
    });
    
    displayEmployeeGrid(filteredEmployees);
}

/**
 * Called by @function displayEmployeeDetails()
 * Stores parts of date string into day, month, and year variables
 * @param {string} dateString 
 * @returns formatted date string: mm/dd/yyyy
 */
function transformDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDay();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
};

/* Event Handlers */
search.addEventListener('click', e => {
    if (e.target.id === 'search-submit') {
        if (searchInput.value && cardList.length) {
            const searchText = searchInput.value;
            filteredEmployees = [];
            filterEmployees(searchText);
        } else if (cardList.length < employees.length) {
            filteredEmployees = employees;
            displayEmployeeGrid(filteredEmployees);
        }
    }
});

search.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        if (searchInput.value && cardList.length) {
            const searchText = searchInput.value;
            filteredEmployees = [];
            filterEmployees(searchText);
        } else if (cardList.length < employees.length) {
            filteredEmployees = employees;
            displayEmployeeGrid(filteredEmployees);
        }
    }
});

gallery.addEventListener('click', e => {
    if (e.target.id !== 'gallery') {
        employeeIndex = getEmployeeIndex(e.target);
        displayEmployeeDetails(employeeIndex);
    }
});

modalClose.addEventListener('click', () => {
    modal.classList.add('hide');
    modalInfoContainer.innerHTML = ``;
    clearEmployeeDetails();
});

modalPrev.addEventListener('click', e => {
    let prevIndex;

    if (employeeIndex === 0) {
        prevIndex = filteredEmployees.length - 1;
    } else {
        prevIndex = employeeIndex - 1;
    }

    employeeIndex = prevIndex;
    clearEmployeeDetails();
    displayEmployeeDetails(employeeIndex);
});

modalNext.addEventListener('click', e => {
    let nextIndex;

    if (employeeIndex === filteredEmployees.length - 1) {
        nextIndex = 0;
    } else {
        nextIndex = employeeIndex + 1;
    }

    employeeIndex = nextIndex;
    clearEmployeeDetails();
    displayEmployeeDetails(employeeIndex);
});