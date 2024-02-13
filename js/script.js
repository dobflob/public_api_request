// Global Variables
let employees;
let currentEmployee;
let gallery = document.querySelector('#gallery');
let modalContainer; //modal container
let modalInfo; //employee specific info inside modal

// Fetch Random Users from the Random Users API
fetch('https://randomuser.me/api/?results=12&exc=gender,login,registered,phone,id&nat=US')
    .then(result => result.json())
    .then(data => cacheEmployees(data))
    .then(employees => displayGallery(employees))
    .catch(err => console.log(new Error(err)));

// Function calls to set initial page view
createModalSkeleton();

// Helper Functions
/** Stores employees returned from fetch
 * @param {object} data json of fetch results
 * @returns @type {array} of employees
 */
function cacheEmployees(data) {
    employees = data.results.map(element => element);
    return employees;
}

/** Creates employee cards for each employee in the employees array and appends the html to the gallery
 * @param {array} employees 
 */
function displayGallery(array) {
    array.forEach(employee => {
        let cardHtml = `
            <div id="${employee.email}" class="card">
                <div class="card-img-container">
                    <img class="card-img" src="${employee.picture.large}" alt="Profile Picture of ${employee.name.first} ${employee.name.last}">
                </div>
                <div class="card-info-container">
                    <h3 id="name" class="card-name cap">${employee.name.first} ${employee.name.last}</h3>
                    <p id="email" class="card-text">${employee.email}</p>
                    <p id="city-state"class="card-text">${employee.location.city}, ${employee.location.state}</p>
                </div>
            </div>    
        `;
        gallery.insertAdjacentHTML('beforeend', cardHtml);
    });
}

/** Resets innerHTML of gallery */
function clearGallery() {
    gallery.innerHTML = '';
};

/** Adds static html for the modal and sets the modalContainer variable */
function createModalSkeleton() {
    let modalHtml = `
        <div class="modal-container hide">
            <div class="modal">
                <button type="button" id="modal-close-btn" class="modal-close-btn">X</button>
                
                <div class="modal-info-container"></div>
            </div>
            
            <div class="modal-btn-container">
                <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                <button type="button" id="modal-next" class="modal-next btn">Next</button>
            </div>
        </div>
    `;
    gallery.insertAdjacentHTML('afterend', modalHtml);
    modalContainer = gallery.nextElementSibling;
}

/** Toggles modal visiblity based on provided param
 * @param {string} action 
 */
function toggleModalVisibility(action) {
    if (action ==='show') {
        modalContainer.classList.remove('hide');
    } else if (action === 'hide') {
        modalContainer.classList.add('hide');
    }
}

/** Sthe currentEmployee variable using the supplied email as the unique identifier then calls @function showEmployeeDetails to populate the modal's dynamic content
 * @param {string} email 
 */
function setCurrentEmployee(empId) {
    currentEmployee = employees.find(employee => employee.email === empId);
    showEmployeeDetails(currentEmployee);
};

/** Sets the dynamic content of the modal based on the supplied employee
 * @param {object} employee 
 */
function showEmployeeDetails(employee) {
    modalInfo = modalContainer.firstElementChild.lastElementChild;
    
    let employeeDetailsHtml = `
        <img class="modal-img" src="${employee.picture.large}" alt="Profile Picture of ${employee.name.first} ${employee.name.last}">
        <h3 id="name" class="modal-name cap">${employee.name.first} ${employee.name.last}</h3>
        <p class="modal-text">${employee.email}</p>
        <p class="modal-text">${employee.location.city}</p>

        <hr>

        <p class="modal-text">${employee.cell}</p>
        <p class="modal-text">${employee.location.street.number} ${employee.location.street.name}, ${employee.location.city}, ${employee.location.state} ${employee.location.postcode}</p>
        <p class="modal-text">${employee.email}</p>
    `;

    modalInfo.insertAdjacentHTML('beforeend', employeeDetailsHtml);
    toggleModalVisibility('show');
}

/** Removes dynamic content (employee details) from modal */
function clearEmployeeDetails() {
    modalInfo.innerHTML = '';
}

/** Gets the index of the currentEmployee and reduces the index by 1 or resets the index to the last element in the employees array and calls the @function setCurrentEmployee */
function getPrevEmployee() {
    let currentIndex = employees.indexOf(currentEmployee);
    let employeeId;

    if (currentIndex !== 0) {
        currentIndex --;
    } else {
        currentIndex = employees.length - 1;
    }

    employeeId = employees[currentIndex].email;
    setCurrentEmployee(employeeId);
};

/** Gets the index of the currentEmployee and increases the index by 1 or resets the index to the first element in the employees array and calls the @function setCurrentEmployee */
function getNextEmployee() {
    let currentIndex = employees.indexOf(currentEmployee);
    let employeeId;

    if (currentIndex !== employees.length - 1) {
        currentIndex ++;
    } else {
        currentIndex = 0;
    }

    employeeId = employees[currentIndex].email;
    setCurrentEmployee(employeeId);
};

// Event listeners
gallery.addEventListener('click', e => {
    if (e.target.id !== 'gallery') {
        const targetElement = e.target;
        let employeeId;
        
        if (targetElement.className === 'card') {
            employeeId = targetElement.id;
        } else if (targetElement.tagName === 'DIV') {
            employeeId = targetElement.parentElement.id;
        } else if (targetElement.className === 'card-img' || targetElement.id === 'name' || targetElement.className === 'card-text') {
            employeeId = targetElement.parentElement.parentElement.id;
        }
        setCurrentEmployee(employeeId);
    }
});

modalContainer.addEventListener('click', e => {
    if (e.target.tagName === 'BUTTON') {
        const button = e.target;

        if (button.id === 'modal-close-btn') {
            toggleModalVisibility('hide');
            clearEmployeeDetails();
        } else if (button.id === 'modal-prev') {
            clearEmployeeDetails();
            getPrevEmployee();
        } else if (button.id === 'modal-next') {
            clearEmployeeDetails();
            getNextEmployee();
        }
    }
});