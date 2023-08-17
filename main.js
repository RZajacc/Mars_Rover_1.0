
// * -------------------------
// * SELECTORS FOR REQUESTS *
// * -------------------------


// * Call range listeners
startRangeListener();
endRangeListener();

// * Add event listeners to range slides
function startRangeListener() {
    const startSolRange = document.getElementById("start-sol-range");
    startSolRange.addEventListener('input', changeStartRange);
}

function endRangeListener() {
    const endSolRange = document.getElementById('end-sol-range');
    endSolRange.addEventListener('input', changeEndRange);
}

function changeStartRange() {
    const startSolField = document.getElementById("start-sol");
    startSolField.innerText = this.value;
}

function changeEndRange() {
     const endSolField = document.getElementById("end-sol");
     endSolField.innerText = this.value;
}

// * ---------------------------
// * FETCHING DATA FROM AN API *
// * ---------------------------

// * Call the gallery button listener function
galleryListener();

// * Add an event listener that is connected to fetch function
function galleryListener() {
    const displayButton = document.getElementById("show-photos-button");
    displayButton.addEventListener('click', fetchData);
}

// * Connect fetch response to to show photos function
function fetchData() {
    const fetchUrl = "https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=49&page=11&api_key=wlcQTmhFQql1kb762xbFcrn8imjFFLumfDszPmsi";
    fetch(fetchUrl)
        .then((response) => response.json())
        .then((data) => showPhotos(data))
        .catch(() => console.log("Something went wrong"))
}

// * Function cleaning previous content before generating a new one
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

// * Generate photos on a webpage
function showPhotos(data) {

    // * Get the gallery div and clean it from existing content
    const photoDiv = document.getElementById("photo-gallery");
    removeAllChildNodes(photoDiv);

     // *Create a div containing cards group
    const cardGroup = document.createElement('div');
    cardGroup.setAttribute("class", "row row-cols-1 row-cols-md-3 g-4");
    photoDiv.appendChild(cardGroup);


    // *Loop through requested data
    data.photos.forEach(element => {
    
        const colCard = document.createElement('div');
        colCard.setAttribute('class', 'col');
        cardGroup.appendChild(colCard);
        
        const cardBody = document.createElement('div');
        cardBody.setAttribute('class', 'card h-100');
        colCard.appendChild(cardBody);

        // *Create card body elements
        const cardPhoto = document.createElement('img');
        cardPhoto.setAttribute('class', 'card-img-top');
        cardPhoto.setAttribute('src', element.img_src);
        cardPhoto.setAttribute('alt', "Made on: " + element.earth_date);
        cardBody.appendChild(cardPhoto);

        const photoDesc = document.createElement('ul');
        photoDesc.setAttribute('class', 'list-group list-group-flush');
        cardBody.appendChild(photoDesc);

        const roverLi = document.createElement('li');
        roverLi.setAttribute('class', 'list-group-item');
        roverLi.innerHTML = "<strong>Rover : </strong>" + element.rover.name;
        photoDesc.appendChild(roverLi);

        const solLi = document.createElement('li');
        solLi.setAttribute('class', 'list-group-item');
        solLi.innerHTML = "<strong>Solar day : </strong>" + element.sol;
        photoDesc.appendChild(solLi);

        const idLi = document.createElement('li');
        idLi.setAttribute('class', 'list-group-item');
        idLi.innerHTML = "<strong>Photo ID : </strong>" + element.id;
        photoDesc.appendChild(idLi);

        const camLi = document.createElement('li');
        camLi.setAttribute('class', 'list-group-item');
        camLi.innerHTML = "<strong>Camera : </strong>" + element.camera.name;
        photoDesc.appendChild(camLi);

        // *Create a card footer
        const cardFooter = document.createElement('div');
        cardFooter.setAttribute('class', 'card-footer');
        const footerContent = document.createElement('small');
        footerContent.setAttribute('class', 'text-body-secondary');
        footerContent.innerHTML = "Earth date : " + element.earth_date;
        cardBody.appendChild(cardFooter);
        cardFooter.appendChild(footerContent);
    });

}

fetch("data/curiosity.json")
    .then(response => response.json())
    .then(data => console.log(data.photo_manifest));