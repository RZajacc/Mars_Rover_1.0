
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


    for (let i = 0; i < data.photos.length; i++) {

        // *Create a card columns and card body
        const colCard = document.createElement('div');
        colCard.setAttribute('class', 'col');
        cardGroup.appendChild(colCard);
        
        const cardBody = document.createElement('div');
        cardBody.setAttribute('class', 'card h-100');
        colCard.appendChild(cardBody);

        // *Create card body elements
        const cardPhoto = document.createElement('img');
        cardPhoto.setAttribute('class', 'card-img-top');
        cardPhoto.setAttribute('src', data.photos[i].img_src);
        cardPhoto.setAttribute('alt', "Made on: " + data.photos[i].earth_date);
        cardBody.appendChild(cardPhoto);

        const photoDesc = document.createElement('ul');
        photoDesc.setAttribute('class', 'list-group list-group-flush');
        cardBody.appendChild(photoDesc);

        const roverLi = document.createElement('li');
        roverLi.setAttribute('class', 'list-group-item');
        roverLi.innerHTML = "<strong>Rover : </strong>" + data.photos[i].rover.name;
        photoDesc.appendChild(roverLi);

        const solLi = document.createElement('li');
        solLi.setAttribute('class', 'list-group-item');
        solLi.innerHTML = "<strong>Solar day : </strong>" + data.photos[i].sol;
        photoDesc.appendChild(solLi);

        const idLi = document.createElement('li');
        idLi.setAttribute('class', 'list-group-item');
        idLi.innerHTML = "<strong>Photo ID : </strong>" + data.photos[i].id;
        photoDesc.appendChild(idLi);

        const camLi = document.createElement('li');
        camLi.setAttribute('class', 'list-group-item');
        camLi.innerHTML = "<strong>Camera : </strong>" + data.photos[i].camera.name;
        photoDesc.appendChild(camLi);

        // *Create a card footer
        const cardFooter = document.createElement('div');
        cardFooter.setAttribute('class', 'card-footer');
        const footerContent = document.createElement('small');
        footerContent.setAttribute('class', 'text-body-secondary');
        footerContent.innerHTML = "Earth date : " + data.photos[i].earth_date;
        cardBody.appendChild(cardFooter);
        cardFooter.appendChild(footerContent);
    }
}

// * Call the gallery button listener function
galleryListener();
