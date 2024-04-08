/* Global Variables */
const search = createSearchForm();
const gallery = document.getElementById('gallery');
const modal = createModalSkeleton();
const modalClose = document.querySelector('.modal-close-btn');

/* Display Functions */
function createSearchForm() {
    const searchContainer = document.querySelector('.search-container');
    const html = `
        <form action='#' method='get'>
            <input type='search' id='search-input' class='search-input' placeholder='Search...'>
            <input type='submit' value='&#x1F50D;' id='search-submit class='search-submit'>
        </form>
    `;

    searchContainer.insertAdjacentHTML('beforeend', html);
    return document.querySelector('form');
};

function createModalSkeleton() {
    const modalHtml = `
        <div class='modal-container hide'>
            <div class='modal'>
                <button type='button' id='modal-close-btn' class='modal-close-btn'>
                    <strong>X</strong>
                </button>

                <div class='modal-info-container'>
                </div>
            </div>

            <div class='modal-btn-container'>
                <button type='button' id='modal-prev' class='modal-prev btn'>Prev</button>
                <button type='button' id='modal-next' class='modal-next btn'>Next</button>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML(`beforeend`, modalHtml);
    return document.querySelector('.modal-container');
};

function displayEmployeeGrid(employees) {
    employees.forEach(employee => {
        const html = `
            <div class='card'>
                <div class='card-img-container'>
                    <img class='card-img' src='' alt=''>
                </div>
                <div class='card-info-container'>
                    <h3 id='name' class='card-name' cap><h3>
                    <p class='card-text'></p>
                    <p class='card-text cap'></p>
                </div>
            </div>
        `;

        gallery.insertAdjacentHTML(`beforeend`, html);
    });
};
/**
 * Call function when user clicks on an employee card from the grid OR uses the modal navigation to view prev/next employee
 * @param {*} employee 
 */
function displayEmployeeDetails(employee) {
    let modalInfoContainer = document.querySelector('.modal-info-container');
    const infoHtml = `
        <img class='modal-img' src='' alt=''>
        <h3 id='name' class='modal-name cap'></h3>
        <p class='modal-text'></p>
        <p class='modal-text'></p>
        <hr>
        <p class='modal-text'></p>
        <p class='modal-text'></p>
        <p class='modal-text'></p>
    `;

    modalInfoContainer.insertAdjacentHTML(`beforeend`, infoHtml);
    
    if (modal.classList.contains('hide')) {
        modal.classList.remove('hide');
    };
};

/* Event Handlers */
modalClose.addEventListener('click', () => {
    modal.classList.add('hide');
});


displayEmployeeDetails();

