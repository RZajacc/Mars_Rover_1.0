
// * -------------------------
// * SELECTORS FOR REQUESTS *
// * -------------------------
// * This function starts the selection of data to display
chooseRover();


function chooseRover() {

    const roverSelect = document.getElementById('rover-select');
    roverSelect.addEventListener('change', () => {
        
        const roverName = roverSelect.value;

        if (roverName === "") {
            console.log("Je;;p")
            displayEmptyRoverErr("No rover selected!");
        } else {
            fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/${roverName}/?api_key=wlcQTmhFQql1kb762xbFcrn8imjFFLumfDszPmsi`)
                .then(response => response.json())
                .then(data => displayRoverInfo(data.photo_manifest, roverName));
        }

        
    // const roverForm = document.getElementById('select-rover-form');
    // roverForm.addEventListener('submit', e => {
    //     e.preventDefault();
    //     const roverName = document.getElementById("rover-select").value;

    //     fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/${roverName}/?api_key=wlcQTmhFQql1kb762xbFcrn8imjFFLumfDszPmsi`)
    //         .then(response => response.json())
    //         .then(data => displayRoverInfo(data.photo_manifest, roverName));
})
}

function displayEmptyRoverErr(message) {
    // * Clean all the data below
    const roverInfo = document.getElementById("rover-info");
    removeAllChildNodes(roverInfo);
    const solDayDescDiv = document.getElementById("sol-day-desc");
    removeAllChildNodes(solDayDescDiv);
    const camerasList = document.getElementById("camera-selectors");
    removeAllChildNodes(camerasList);
    const camInfo = document.getElementById("cameras-info");
    camInfo.innerHTML = "";
    const solDayInput = document.getElementById('solar-day-input');
    removeAllChildNodes(solDayInput);

    // * Generate description of selected rover
    const roverParagraph = document.createElement('p');
    roverParagraph.innerHTML = `<strong>${message}</strong>`;
    roverInfo.appendChild(roverParagraph);
}

function displayRoverInfo(info, roverName) {

    // console.log(roverName);

    // * Clean all the data below
    const roverInfo = document.getElementById("rover-info");
    removeAllChildNodes(roverInfo);
    const solDayDescDiv = document.getElementById("sol-day-desc");
    removeAllChildNodes(solDayDescDiv);
    const camerasList = document.getElementById("camera-selectors");
    removeAllChildNodes(camerasList);
    const camInfo = document.getElementById("cameras-info");
    camInfo.innerHTML = "";

    // * Generate description of selected rover
    const roverParagraph = document.createElement('p');
    roverParagraph.innerHTML = `<strong>${info.name}</strong> was active for 
    <strong>${info.max_sol}</strong> solar days, and made 
    <strong>${info.total_photos}</strong> during that time. Current mission 
    status is <strong id="mission-status">${info.status.toUpperCase()}</strong>.`;
    roverInfo.appendChild(roverParagraph);
   
    // * Check mission status and change it's color accordingly
    const missionStatus = document.getElementById("mission-status");
    
    if (info.status === "active") {
        missionStatus.innerText = info.status.toUpperCase();
        missionStatus.setAttribute('style', 'color:green');
    } else {
        missionStatus.innerText = info.status.toUpperCase();
        missionStatus.setAttribute('style', 'color:red');
    }
    
    // * Geneate a field receiving selected solar day
    const solDayInput = document.getElementById('solar-day-input');
    removeAllChildNodes(solDayInput);
    const solDaylabel = document.createElement('span');
    solDaylabel.setAttribute('class', 'input-group-text');
    solDaylabel.setAttribute('id', 'inputGroup-sizing-sm');
    solDaylabel.innerText = 'Solar day to display';
    solDayInput.appendChild(solDaylabel);

    const solDayInputField = document.createElement('input');
    solDayInputField.setAttribute('type', 'text');
    solDayInputField.setAttribute('class', 'form-control');
    solDayInputField.setAttribute('aria-label', 'Sizing example input');
    solDayInputField.setAttribute('aria-describedby', 'inputGroup-sizing-sm');
    solDayInputField.setAttribute('id', 'selected-solar-day');
    solDayInput.appendChild(solDayInputField);

    // * Create submit button
    
    solDayInputField.addEventListener('change', () => {
        displaySolDayInfo(info.photos, roverName, solDayInputField.value);
        fetchData(roverName, solDayInputField.value)
    })

    // const solDaySubmitDiv = document.getElementById('sol-day-submit-div')
    // removeAllChildNodes(solDaySubmitDiv);
    // const solDaySubmit = document.createElement('button');
    // solDaySubmit.setAttribute('type', 'submit');
    // solDaySubmit.setAttribute('class', 'btn btn-primary');
    // solDaySubmit.innerText = 'Select';
    // solDaySubmitDiv.appendChild(solDaySubmit);

    // // * Submit a form with selected day
    // let solDayForm = document.getElementById("sol-days-select");
    // solDayForm.addEventListener('submit', e => {
    //     e.preventDefault();
    //     let selectedSolarDay = document.getElementById("selected-solar-day").value;
    //     let camList = [];
    //     displaySolDayInfo(info.photos, roverName, selectedSolarDay);
    // })
}

function displaySolDayInfo(photoDesc, roverName, selectedSolarDay) {

    console.log(roverName, selectedSolarDay);
    // * Find the array containing selected solar day
    const selectedData = photoDesc.filter((entry) => {
        const selectedSolarDayInt = parseInt(selectedSolarDay);
        return entry.sol === selectedSolarDayInt;
    })

    const solDayDescDiv = document.getElementById("sol-day-desc");
    removeAllChildNodes(solDayDescDiv);

    const solDayDescParagraph = document.createElement('p');
    solDayDescDiv.appendChild(solDayDescParagraph);
    let solDayValue;
    let camerasUsed;

     // * If there's no match the list still will contain empty array
    if (selectedData.length != 0) {
        solDayValue = selectedData[0].total_photos;
        camerasUsed = selectedData[0].cameras;
    } else {
        solDayValue = 0;
    }

    solDayDescParagraph.innerHTML = `On <strong>${selectedSolarDay}</strong> 
    solar day rover made a total of <strong>${solDayValue}</strong> pictures.`;
   
    displayCameraSelectors(camerasUsed, roverName, selectedSolarDay);
}

// * Display switches for cameras that were used at that specific day
function displayCameraSelectors(camerasUsed, roverName, selectedSolarDay) {

    const camInfo = document.getElementById("cameras-info");
    camInfo.innerHTML = "Each rover has a diffent set of cameras. Select the ones that are interesting for you:";
   
    const camSelectSubmitDiv = document.getElementById("camera-select-submit");
    removeAllChildNodes(camSelectSubmitDiv);

    const camerasList = document.getElementById("camera-selectors");
    removeAllChildNodes(camerasList);

    const availableCameras = {
        ENTRY: "Entry camera",
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

    // const camSelectSubmit = document.createElement('button');
    // camSelectSubmit.setAttribute('type', 'submit');
    // camSelectSubmit.setAttribute('class', 'btn btn-primary');
    // camSelectSubmit.setAttribute('id', 'show-photos-button');
    // camSelectSubmit.innerText = "Display";
    // camSelectSubmitDiv.appendChild(camSelectSubmit);

    // const camSelectForm = document.getElementById("cameras-select-form");
    // camSelectForm.addEventListener("submit", (e) => {
    //     e.preventDefault();
    //     let nodes = camerasList.childNodes;
    //     let camList = [];
    //     nodes.forEach((node) => {
    //         camList.push(node.firstChild.value);
    //         // console.log(node.firstChild);
    //         // console.log(node.firstChild.value);
    //         console.log(node.checked === undefined);
    //     })

    //     fetchData(roverName, selectedSolarDay, camList);
    // })
}


// * ---------------------------
// * FETCHING DATA FROM AN API *
// * ---------------------------

// * Connect fetch response to to show photos function
function fetchData(roverName, selectedSolarDay, camList) {
    
    const fetchUrl = `https://api.nasa.gov/mars-photos/api/v1/rovers/${roverName}/photos?sol=${selectedSolarDay}&page=1&api_key=wlcQTmhFQql1kb762xbFcrn8imjFFLumfDszPmsi`;
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







