
// * -------------------------
// * SELECTORS FOR REQUESTS *
// * -------------------------




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

// *-------------------------
// *--------TEST AREA -------
// *-------------------------



let roverForm = document.getElementById('select-rover-form');

roverForm.addEventListener('submit', e => {
    e.preventDefault();
    let roverName = document.getElementById("rover-select").value;

    fetch(`data/${roverName}.json`)
        .then(response => response.json())
        .then(data => displayRoverInfo(data.photo_manifest));
})


function displayRoverInfo(info) {
    const roverName = document.getElementById("roverName");
    roverName.innerText = info.name;
    const maxSol = document.getElementById("max-sol")
    maxSol.innerText = info.max_sol;
    const totalPhotos = document.getElementById("total-photos")
    totalPhotos.innerText = info.total_photos;
    
    let solDayForm = document.getElementById("sol-days-select");
    solDayForm.addEventListener('submit', e => {
        e.preventDefault();
        let selectedSolarDay = document.getElementById("selected-solar-day").value;
        displaySolDayInfo(info.photos, selectedSolarDay);
    })
    
}

function displaySolDayInfo(photoDesc, selectedSolarDay) {

    // * Find the array containing selected solar day
    const selectedData = photoDesc.filter((entry) => {
        const selectedSolarDayInt = parseInt(selectedSolarDay);
        return entry.sol === selectedSolarDayInt;
    })

    // * Update data in html with data relevant to selection
    const selectedSolDay = document.getElementById("selected-sol");
    selectedSolDay.innerText = selectedSolarDay;
    const totalPhotosSelectedDay = document.getElementById("total-photos-selected-day");
    let camerasUsed;

    // * If there's no match the list still will contain empty array
    if (selectedData.length != 0) {
        totalPhotosSelectedDay.innerText = selectedData[0].total_photos;
        camerasUsed = selectedData[0].cameras;
    } else {
        totalPhotosSelectedDay.innerText = 0;
    }
    
    displayCameraSelectors(camerasUsed);
}

// * Display switches for cameras that were used at that specific day
function displayCameraSelectors(camerasUsed) {
    const camerasList = document.getElementById("camera-selectors");
    const availableCameras = {
        FHAZ: "Front Hazard Avoidance Camera",
        RHAZ: "Rear Hazard Avoidance Camera",
        MAST: "Mast Camera",
        CHEMCAM: "Chemistry and Camera Complex",
        MAHLI: "Mars Hand Lens Imager",
        MARDI: "Mars Descent Imager",
        NAVCAM: "Navigation Camera",
        PANCAM: "Panoramic Camera",
        MINITES: "Miniature Thermal Emission Spectrometer (Mini-TES)",
    };

    camerasUsed.forEach((camera) => {

        // * Create a Div containing switches
        const camSwitchDiv = document.createElement('div');
        camSwitchDiv.setAttribute("class", "form-check form-switch");
        camerasList.appendChild(camSwitchDiv);
        
        // * Create switch elements
        const camSwitch = document.createElement('input');
        camSwitch.setAttribute("class", "form-check-input");
        camSwitch.setAttribute("type", "checkbox");
        camSwitch.setAttribute("role", "switch");
        camSwitch.setAttribute("id", camera);
        camSwitch.setAttribute("value", camera);
        camSwitch.setAttribute("checked", "");
        camSwitchDiv.appendChild(camSwitch);

        // * Create switch labels
        const camSwitchLabel = document.createElement("label");
        camSwitchLabel.setAttribute("class", "form-check-label");
        camSwitchLabel.setAttribute("for", camera);
        camSwitchLabel.innerText = availableCameras[camera];
        camSwitchDiv.appendChild(camSwitchLabel);
    })
}