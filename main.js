
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
            displayEmptyRoverErr("Nothing to display! Please select a rover");
        } else {
            fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/${roverName}/?api_key=wlcQTmhFQql1kb762xbFcrn8imjFFLumfDszPmsi`)
                .then(response => response.json())
                .then(data => displayRoverInfo(data.photo_manifest, roverName));
        }   
})
}

// * Executed only blank field for rover is selected
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

     // * Get the gallery div and clean it from existing content
    const photoDiv = document.getElementById("photo-gallery");
    removeAllChildNodes(photoDiv);

    // * Generate description of selected rover
    const roverParagraph = document.createElement('p');
    roverParagraph.innerHTML = `<strong>${message}</strong>`;
    roverInfo.appendChild(roverParagraph);
}


function displayRoverInfo(info, roverName) {

    // * Clean all the data below
    const roverInfo = document.getElementById("rover-info");
    removeAllChildNodes(roverInfo);
    const solDayDescDiv = document.getElementById("sol-day-desc");
    removeAllChildNodes(solDayDescDiv);
    const camerasList = document.getElementById("camera-selectors");
    removeAllChildNodes(camerasList);
    const camInfo = document.getElementById("cameras-info");
    camInfo.innerHTML = "";
    // * Get the gallery div and clean it from existing content
    const photoDiv = document.getElementById("photo-gallery");
    removeAllChildNodes(photoDiv);

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

    // * Add value of a solar day
    // ! REQUIRED VALIDATION
    solDayInputField.addEventListener('change', () => {
        displaySolDayInfo(info.photos, roverName, solDayInputField.value);
    })
}

function displaySolDayInfo(photoDesc, roverName, selectedSolarDay) {

    // * Find the array containing selected solar day
    const selectedData = photoDesc.filter((entry) => {
        const selectedSolarDayInt = parseInt(selectedSolarDay);
        return entry.sol === selectedSolarDayInt;
    })

    const solDayDescDiv = document.getElementById("sol-day-desc");
    removeAllChildNodes(solDayDescDiv);

    const solDayDescParagraph = document.createElement('p');
    solDayDescDiv.appendChild(solDayDescParagraph);
    let totalPictures;
    let camerasUsed;

     // * If there's no match the list still will contain empty array
    if (selectedData.length != 0) {
        totalPictures = selectedData[0].total_photos;
        camerasUsed = selectedData[0].cameras;
    } else {
        totalPictures = 0;
    }

    solDayDescParagraph.innerHTML = `On <strong>${selectedSolarDay}</strong> 
    solar day rover made a total of <strong>${totalPictures}</strong> pictures.`;
    
    if (totalPictures !== 0) {
        let pagesCount = Math.ceil(totalPictures / 25);
        displayCameraSelectors(camerasUsed, roverName, selectedSolarDay, pagesCount);
    }
}

// * Display switches for cameras that were used at that specific day
function displayCameraSelectors(camerasUsed, roverName, selectedSolarDay, pagesCount) {

    const camInfo = document.getElementById("cameras-info");
    camInfo.innerHTML = "Each rover has a diffent set of cameras. Select the ones that are interesting for you:";
   
    const camerasList = document.getElementById("camera-selectors");
    removeAllChildNodes(camerasList);

    const availableCameras = {
        ENTRY: "Entry, Descent, and Landing Camera",
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

    const camSelect = document.createElement('select');
    camSelect.setAttribute('class', 'form-select');
    camSelect.setAttribute('aria-label', 'camera-select');
    camSelect.setAttribute('id', 'cam-select');
    camerasList.appendChild(camSelect);

    const selectAll = document.createElement('option');
    selectAll.setAttribute('value', 'ALL');
    selectAll.innerText = "All cameras";
    camSelect.appendChild(selectAll);

    // * Make a first fetch and then respond to select change
    fetchBasic(roverName, selectedSolarDay, pagesCount);

    camSelect.addEventListener('change', () => {
        if (camSelect.value === "ALL") {
            fetchBasic(roverName, selectedSolarDay, pagesCount);
        } else {
            fetchExpanded(roverName, selectedSolarDay, camSelect.value, pagesCount);
        }
    })

    camerasUsed.forEach((camera) => {
        const selectOption = document.createElement('option');
        selectOption.setAttribute('value', camera);
        selectOption.innerText = availableCameras[camera];
        camSelect.appendChild(selectOption);
    })
}


// * ---------------------------
// * FETCHING DATA FROM AN API *
// * ---------------------------

// * BASIC FETCH - Takes rover name and solar day
function fetchBasic(roverName, selectedSolarDay ,pagesCount, page=1) {
    const fetchUrl = `https://api.nasa.gov/mars-photos/api/v1/rovers/${roverName}/photos?sol=${selectedSolarDay}&page=${page}&api_key=wlcQTmhFQql1kb762xbFcrn8imjFFLumfDszPmsi`;
    fetch(fetchUrl)
        .then((response) => response.json())
        .then((data) => showPhotos(data, roverName, selectedSolarDay, pagesCount, page))
        .catch(() => console.log("Something went wrong"))
}

function fetchExpanded(roverName, selectedSolarDay, camName, pagesCount, page=1) {
    
    const fetchUrl = `https://api.nasa.gov/mars-photos/api/v1/rovers/${roverName}/photos?sol=${selectedSolarDay}&camera=${camName}&page=${page}&api_key=wlcQTmhFQql1kb762xbFcrn8imjFFLumfDszPmsi`;
    fetch(fetchUrl)
        .then((response) => response.json())
        .then((data) => showPhotos(data, pagesCount, page))
        .catch(() => console.log("Something went wrong"))
}

// * Function cleaning previous content before generating a new one
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

// * Generate photos on a webpage
function showPhotos(data, roverName, selectedSolarDay, pagesCount, page) {

    console.log("Current page : ", page);
    console.log("Pages count : ", pagesCount);

    

    // * Get the gallery div and clean it from existing content
    const photoDiv = document.getElementById("photo-gallery");
    removeAllChildNodes(photoDiv);
    const pagesDiv = document.getElementById('pages');
    removeAllChildNodes(pagesDiv);

     // *Create a div containing cards group
    const cardGroup = document.createElement('div');
    cardGroup.setAttribute("class", "row row-cols-1 row-cols-md-3 g-4");
    photoDiv.appendChild(cardGroup);

    if (pagesCount > 1) {
        
        // ? Create navigation and Previous element tab
        const pagesDiv = document.getElementById('pages');
        const paginationNav = document.createElement('nav');
        paginationNav.setAttribute('aria-label', 'pagination-nav');
        pagesDiv.appendChild(paginationNav);
        const paginationUl = document.createElement('ul');
        paginationUl.setAttribute('class', 'pagination');
        paginationNav.appendChild(paginationUl);

        // *Create a move to a FIRST PAGE element
        const previousLi = document.createElement('li');
        previousLi.setAttribute('class', 'page-item');
        const previousHref = document.createElement('a');
        previousHref.setAttribute('class', 'page-link');
        previousHref.setAttribute('href', '#');
        previousHref.innerText = "First page";
        previousLi.appendChild(previousHref);
        paginationUl.appendChild(previousLi);

        previousHref.addEventListener('click', () => {
            targetPage = 1;
            removeAllChildNodes(photoDiv);
            fetchBasic(roverName, selectedSolarDay, pagesCount, targetPage);
        })
        
        // * Working pagination
        if (page === 1 && pagesCount>=3) {
            for (let i = page; i < page+3; i++) {
            const paginationLi = document.createElement('li');
            paginationLi.setAttribute('class', 'page-item');
            const paginationHref = document.createElement('a');
            if (i === page) {
                paginationHref.setAttribute('class', 'page-link active');
            } else {
                paginationHref.setAttribute('class', 'page-link');
            }
            
            paginationHref.setAttribute('href', '#');
            paginationHref.innerText = i;
            paginationLi.appendChild(paginationHref);
            paginationUl.appendChild(paginationLi);
            paginationHref.addEventListener('click', () => {
                targetPage = parseInt(paginationHref.innerText);
                removeAllChildNodes(photoDiv);
                fetchBasic(roverName, selectedSolarDay, pagesCount, targetPage);
            })
            }
        } else if (page === 1 && pagesCount<=3) {
            for (let i = page; i < pagesCount+1; i++) {
            const paginationLi = document.createElement('li');
            paginationLi.setAttribute('class', 'page-item');
            const paginationHref = document.createElement('a');
            if (i === page) {
                paginationHref.setAttribute('class', 'page-link active');
            } else {
                paginationHref.setAttribute('class', 'page-link');
            }
            
            paginationHref.setAttribute('href', '#');
            paginationHref.innerText = i;
            paginationLi.appendChild(paginationHref);
            paginationUl.appendChild(paginationLi);
            paginationHref.addEventListener('click', () => {
                targetPage = parseInt(paginationHref.innerText);
                removeAllChildNodes(photoDiv);
                fetchBasic(roverName, selectedSolarDay, pagesCount, targetPage);
            })
            }
        } else if (page === pagesCount && pagesCount >=3) {
            for (let i = page-2; i < pagesCount+1; i++) {
            const paginationLi = document.createElement('li');
            paginationLi.setAttribute('class', 'page-item');
            const paginationHref = document.createElement('a');
            if (i === page) {
                paginationHref.setAttribute('class', 'page-link active');
            } else {
                paginationHref.setAttribute('class', 'page-link');
            }
            
            paginationHref.setAttribute('href', '#');
            paginationHref.innerText = i;
            paginationLi.appendChild(paginationHref);
            paginationUl.appendChild(paginationLi);
            paginationHref.addEventListener('click', () => {
                targetPage = parseInt(paginationHref.innerText);
                removeAllChildNodes(photoDiv);
                fetchBasic(roverName, selectedSolarDay, pagesCount, targetPage);
            })
            }
         } else if (page === pagesCount && pagesCount <=3){
             for (let i = pagesCount-1; i < pagesCount+1; i++) {
            const paginationLi = document.createElement('li');
            paginationLi.setAttribute('class', 'page-item');
            const paginationHref = document.createElement('a');
            if (i === page) {
                paginationHref.setAttribute('class', 'page-link active');
            } else {
                paginationHref.setAttribute('class', 'page-link');
            }
            
            paginationHref.setAttribute('href', '#');
            paginationHref.innerText = i;
            paginationLi.appendChild(paginationHref);
            paginationUl.appendChild(paginationLi);
            paginationHref.addEventListener('click', () => {
                targetPage = parseInt(paginationHref.innerText);
                removeAllChildNodes(photoDiv);
                fetchBasic(roverName, selectedSolarDay, pagesCount, targetPage);
            })
            }
        } else {
            for (let i = page-1; i < page+2; i++) {
            const paginationLi = document.createElement('li');
            paginationLi.setAttribute('class', 'page-item');
            const paginationHref = document.createElement('a');
            if (i === page) {
                paginationHref.setAttribute('class', 'page-link active');
            } else {
                paginationHref.setAttribute('class', 'page-link');
            }
            
            paginationHref.setAttribute('href', '#');
            paginationHref.innerText = i;
            paginationLi.appendChild(paginationHref);
            paginationUl.appendChild(paginationLi);
            paginationHref.addEventListener('click', () => {
                targetPage = parseInt(paginationHref.innerText);
                removeAllChildNodes(photoDiv);
                fetchBasic(roverName, selectedSolarDay, pagesCount, targetPage);
            })
            }
        }

        
        // *Create a move to LAST PAGE element
        const nextLi = document.createElement('li');
        nextLi.setAttribute('class', 'page-item');
        const nextHref = document.createElement('a');
        nextHref.setAttribute('class', 'page-link');
        nextHref.setAttribute('href', '#');
        nextHref.innerText = "Last page";
        nextLi.appendChild(nextHref);
        paginationUl.appendChild(nextLi);

        nextHref.addEventListener('click', () => {
            targetPage = pagesCount;
            removeAllChildNodes(photoDiv);
            fetchBasic(roverName, selectedSolarDay, pagesCount, targetPage);
            
        })
    }

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







