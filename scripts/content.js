// ? ----------------------------------------------
// ? -----------CLEANER FUNCTIONS -----------------
// ? ----------------------------------------------
// * REMOVE ALL CHILDREN OF SELECTED ELEMENT
function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

// *REMOVES ALL DYNAMICALLY CREATED CONTENT
function cleanAllDynamicContent() {
  const roverInfo = document.querySelector("#rover-info");
  removeAllChildNodes(roverInfo);
  const solDayDescDiv = document.querySelector("#sol-day-desc");
  removeAllChildNodes(solDayDescDiv);
  const camerasList = document.querySelector("#camera-selectors");
  removeAllChildNodes(camerasList);
  const camInfo = document.querySelector("#cameras-info");
  camInfo.innerHTML = "";
  const solDayInput = document.querySelector("#solar-day-input");
  removeAllChildNodes(solDayInput);

  // * Get the gallery div and clean it from existing content
  const photoDiv = document.querySelector("#photo-gallery");
  removeAllChildNodes(photoDiv);

  // *Get pagination div and delete the content
  const pagesDiv = document.querySelector("#pages");
  removeAllChildNodes(pagesDiv);
}

// !INITIALIZE ALL EVENTS
chooseRover();

// ? ----------------------------------------------
// ? SELECT PARAMETERS AND FETCH MISSION MANIFEST
// ? ----------------------------------------------
function chooseRover() {
  const roverSelect = document.querySelector("#rover-select");
  roverSelect.addEventListener("change", () => {
    const roverName = roverSelect.value;

    if (roverName === "") {
      displayEmptyRoverErr("Nothing to display! Please select a rover!");
    } else {
      fetch(
        `https://api.nasa.gov/mars-photos/api/v1/manifests/${roverName}/?api_key=wlcQTmhFQql1kb762xbFcrn8imjFFLumfDszPmsi`
      )
        .then((response) => response.json())
        .then((data) => displayRoverInfo(data.photo_manifest, roverName));
    }
  });
}

// ? ----------------------------------------------
// ? -----DISPLAY ALL RELEVANT INFORMATIONS--------
// ? ----------------------------------------------
// * If no rover selected clean all the data below
function displayEmptyRoverErr(message) {
  cleanAllDynamicContent();

  const roverInfo = document.querySelector("#rover-info");
  // * Generate description of selected rover
  const roverParagraph = document.createElement("p");
  roverParagraph.innerHTML = `<strong>${message}</strong>`;
  roverParagraph.setAttribute("style", "text-align:center; color:red");
  roverInfo.appendChild(roverParagraph);
}

// *If data is provided display information about selected rover
function displayRoverInfo(info, roverName) {
  cleanAllDynamicContent();

  const roverInfo = document.querySelector("#rover-info");
  // * Generate description of selected rover
  const roverParagraph = document.createElement("p");
  roverParagraph.innerHTML = `<strong>${info.name}</strong> was active for 
    <strong>${info.max_sol}</strong> solar days, and made 
    <strong>${info.total_photos}</strong> during that time. Current mission 
    status is <strong id="mission-status">${info.status.toUpperCase()}</strong>.`;
  roverInfo.appendChild(roverParagraph);

  // * Check mission status and change it's color accordingly
  const missionStatus = document.querySelector("#mission-status");

  if (info.status === "active") {
    missionStatus.textContent = info.status.toUpperCase();
    missionStatus.setAttribute("style", "color:#7CFC00");
  } else {
    missionStatus.textContent = info.status.toUpperCase();
    missionStatus.setAttribute("style", "color:red");
  }

  // * Generate a input field for solar day
  const solDayInput = document.querySelector("#solar-day-input");
  removeAllChildNodes(solDayInput);
  const solDaylabel = document.createElement("span");
  solDaylabel.setAttribute("class", "input-group-text");
  solDaylabel.setAttribute("id", "inputGroup-sizing-sm");
  solDaylabel.textContent = "Solar day to display";
  solDayInput.appendChild(solDaylabel);

  const solDayInputField = document.createElement("input");
  solDayInputField.setAttribute("type", "number");
  solDayInputField.setAttribute("class", "form-control");
  solDayInputField.setAttribute("min", "0");
  solDayInputField.setAttribute("max", info.max_sol);
  solDayInputField.setAttribute("aria-label", "Sizing example input");
  solDayInputField.setAttribute("aria-describedby", "inputGroup-sizing-sm");
  solDayInputField.setAttribute("id", "selected-solar-day");
  solDayInputField.setAttribute("placeholder", "i.e. 1");
  solDayInput.appendChild(solDayInputField);

  // * Invalid feedback div
  const failureDiv = document.createElement("div");
  failureDiv.setAttribute("class", "invalid-feedback");
  failureDiv.setAttribute("hidden", "");
  failureDiv.innerHTML = `<strong>Value of range!</strong> You can choose between <strong>0</strong> and <strong>${info.max_sol}</strong>!`;
  solDayInput.appendChild(failureDiv);

  // * Add value of a solar day
  solDayInputField.addEventListener("change", () => {
    if (solDayInputField.value >= 0 && solDayInputField.value <= info.max_sol) {
      solDayInputField.setAttribute("class", "form-control is-valid");
      failureDiv.setAttribute("hidden", "");
      displaySolDayInfo(info.photos, roverName, solDayInputField.value);
    } else {
      solDayInputField.setAttribute("class", "form-control is-invalid");
      failureDiv.toggleAttribute("hidden");
    }
  });
}

function displaySolDayInfo(photoDesc, roverName, selectedSolarDay) {
  // * Find the array containing selected solar day
  const selectedData = photoDesc.filter((entry) => {
    const selectedSolarDayInt = parseInt(selectedSolarDay);
    return entry.sol === selectedSolarDayInt;
  });

  const solDayDescDiv = document.querySelector("#sol-day-desc");
  removeAllChildNodes(solDayDescDiv);

  const solDayDescParagraph = document.createElement("p");
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

  // * If there are any pictures display them, if not, clear the rest of a screen
  if (totalPictures !== 0) {
    let pagesCount = Math.ceil(totalPictures / 25);
    displayCameraSelectors(
      camerasUsed,
      roverName,
      selectedSolarDay,
      pagesCount
    );
  } else {
    const camerasList = document.querySelector("#camera-selectors");
    removeAllChildNodes(camerasList);
    const camInfo = document.querySelector("#cameras-info");
    camInfo.innerHTML = "";
    // * Get the gallery div and clean it from existing content
    const photoDiv = document.querySelector("#photo-gallery");
    removeAllChildNodes(photoDiv);
    const pagesDiv = document.querySelector("#pages");
    removeAllChildNodes(pagesDiv);
  }
}

// * Display switches for cameras and initial fetch
function displayCameraSelectors(
  camerasUsed,
  roverName,
  selectedSolarDay,
  pagesCount
) {
  const camInfo = document.querySelector("#cameras-info");
  camInfo.innerHTML =
    "Each rover has a diffent set of cameras. Select the ones that are interesting for you:";

  const camerasList = document.querySelector("#camera-selectors");
  removeAllChildNodes(camerasList);

  // *List of available cameras
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

  const camSelect = document.createElement("select");
  camSelect.setAttribute("class", "form-select");
  camSelect.setAttribute("aria-label", "camera-select");
  camSelect.setAttribute("id", "cam-select");
  camerasList.appendChild(camSelect);

  const selectAll = document.createElement("option");
  selectAll.setAttribute("value", "ALL");
  selectAll.textContent = "All cameras";
  camSelect.appendChild(selectAll);

  // *Add cameras options to a list
  camerasUsed.forEach((camera) => {
    const selectOption = document.createElement("option");
    selectOption.setAttribute("value", camera);
    selectOption.textContent = availableCameras[camera];
    camSelect.appendChild(selectOption);
  });

  // * Make a first fetch and then respond to select change
  fetchBasic(roverName, selectedSolarDay, pagesCount);

  camSelect.addEventListener("change", () => {
    if (camSelect.value === "ALL") {
      fetchBasic(roverName, selectedSolarDay, pagesCount);
    } else {
      fetchExpanded(roverName, selectedSolarDay, camSelect.value);
    }
  });
}

// ? --------------------------------------------
// ? DEFINITION OF TWO DIFFERENT KINDS OF FETCH *
// ? --------------------------------------------

// * BASIC FETCH - Takes rover name and solar day
function fetchBasic(roverName, selectedSolarDay, pagesCount, page = 1) {
  const fetchUrl = `https://api.nasa.gov/mars-photos/api/v1/rovers/${roverName}/photos?sol=${selectedSolarDay}&page=${page}&api_key=wlcQTmhFQql1kb762xbFcrn8imjFFLumfDszPmsi`;
  fetch(fetchUrl)
    .then((response) => response.json())
    .then((data) =>
      showAllPhotos(data, roverName, selectedSolarDay, pagesCount, page)
    )
    .catch(() => console.log("Something went wrong"));
}

// * BASIC FETCH - Takes also selected camera
function fetchExpanded(roverName, selectedSolarDay, camName, page = 1) {
  const fetchUrl = `https://api.nasa.gov/mars-photos/api/v1/rovers/${roverName}/photos?sol=${selectedSolarDay}&camera=${camName}&page=${page}&api_key=wlcQTmhFQql1kb762xbFcrn8imjFFLumfDszPmsi`;
  fetch(fetchUrl)
    .then((response) => response.json())
    .then((data) =>
      showSelectedPhotos(data, roverName, selectedSolarDay, camName, page)
    )
    .catch(() => console.log("Something went wrong"));
}

// * Generate photos on a webpage
function showAllPhotos(data, roverName, selectedSolarDay, pagesCount, page) {
  // * Get the gallery div and clean it from existing content
  const photoDiv = document.querySelector("#photo-gallery");
  removeAllChildNodes(photoDiv);
  const pagesDiv = document.querySelector("#pages");
  removeAllChildNodes(pagesDiv);

  // *Create a div containing cards group
  const cardGroup = document.createElement("div");
  cardGroup.setAttribute("class", "row row-cols-1 row-cols-md-2 g-3");
  photoDiv.appendChild(cardGroup);

  // *Displaying photos is called from few places
  displayGallery(cardGroup, data);

  // * Create a pagination if there are more pages than 1
  if (pagesCount > 1) {
    //  *Create navigation and FIRST element tab
    const pagesDiv = document.querySelector("#pages");
    const paginationNav = document.createElement("nav");
    paginationNav.setAttribute("aria-label", "pagination-nav");
    pagesDiv.appendChild(paginationNav);
    const paginationUl = document.createElement("ul");
    paginationUl.setAttribute("class", "pagination justify-content-center");
    paginationNav.appendChild(paginationUl);

    // *Create a move to a FIRST PAGE element
    const firstLi = document.createElement("li");
    firstLi.setAttribute("class", "page-item");
    const firstHref = document.createElement("a");
    firstHref.setAttribute("class", "page-link");
    firstHref.setAttribute("href", "#");
    firstHref.textContent = "First page";
    firstLi.appendChild(firstHref);
    paginationUl.appendChild(firstLi);

    firstHref.addEventListener("click", () => {
      targetPage = 1;
      removeAllChildNodes(photoDiv);
      fetchBasic(roverName, selectedSolarDay, pagesCount, targetPage);
    });

    // * PAGINATION LOGIC
    if (page === 1 && pagesCount >= 3) {
      for (let i = page; i < page + 3; i++) {
        const paginationLi = document.createElement("li");
        paginationLi.setAttribute("class", "page-item");
        const paginationHref = document.createElement("a");
        if (i === page) {
          paginationHref.setAttribute("class", "page-link active");
        } else {
          paginationHref.setAttribute("class", "page-link");
        }

        paginationHref.setAttribute("href", "#");
        paginationHref.textContent = i;
        paginationLi.appendChild(paginationHref);
        paginationUl.appendChild(paginationLi);
        paginationHref.addEventListener("click", () => {
          targetPage = parseInt(paginationHref.textContent);
          removeAllChildNodes(photoDiv);
          fetchBasic(roverName, selectedSolarDay, pagesCount, targetPage);
        });
      }
    } else if (page === 1 && pagesCount <= 3) {
      for (let i = page; i < pagesCount + 1; i++) {
        const paginationLi = document.createElement("li");
        paginationLi.setAttribute("class", "page-item");
        const paginationHref = document.createElement("a");
        if (i === page) {
          paginationHref.setAttribute("class", "page-link active");
        } else {
          paginationHref.setAttribute("class", "page-link");
        }

        paginationHref.setAttribute("href", "#");
        paginationHref.textContent = i;
        paginationLi.appendChild(paginationHref);
        paginationUl.appendChild(paginationLi);
        paginationHref.addEventListener("click", () => {
          targetPage = parseInt(paginationHref.textContent);
          removeAllChildNodes(photoDiv);
          fetchBasic(roverName, selectedSolarDay, pagesCount, targetPage);
        });
      }
    } else if (page === pagesCount && pagesCount >= 3) {
      for (let i = page - 2; i < pagesCount + 1; i++) {
        const paginationLi = document.createElement("li");
        paginationLi.setAttribute("class", "page-item");
        const paginationHref = document.createElement("a");
        if (i === page) {
          paginationHref.setAttribute("class", "page-link active");
        } else {
          paginationHref.setAttribute("class", "page-link");
        }

        paginationHref.setAttribute("href", "#");
        paginationHref.textContent = i;
        paginationLi.appendChild(paginationHref);
        paginationUl.appendChild(paginationLi);
        paginationHref.addEventListener("click", () => {
          targetPage = parseInt(paginationHref.textContent);
          removeAllChildNodes(photoDiv);
          fetchBasic(roverName, selectedSolarDay, pagesCount, targetPage);
        });
      }
    } else if (page === pagesCount && pagesCount <= 3) {
      for (let i = pagesCount - 1; i < pagesCount + 1; i++) {
        const paginationLi = document.createElement("li");
        paginationLi.setAttribute("class", "page-item");
        const paginationHref = document.createElement("a");
        if (i === page) {
          paginationHref.setAttribute("class", "page-link active");
        } else {
          paginationHref.setAttribute("class", "page-link");
        }

        paginationHref.setAttribute("href", "#");
        paginationHref.textContent = i;
        paginationLi.appendChild(paginationHref);
        paginationUl.appendChild(paginationLi);
        paginationHref.addEventListener("click", () => {
          targetPage = parseInt(paginationHref.textContent);
          removeAllChildNodes(photoDiv);
          fetchBasic(roverName, selectedSolarDay, pagesCount, targetPage);
        });
      }
    } else {
      for (let i = page - 1; i < page + 2; i++) {
        const paginationLi = document.createElement("li");
        paginationLi.setAttribute("class", "page-item");
        const paginationHref = document.createElement("a");
        if (i === page) {
          paginationHref.setAttribute("class", "page-link active");
        } else {
          paginationHref.setAttribute("class", "page-link");
        }

        paginationHref.setAttribute("href", "#");
        paginationHref.textContent = i;
        paginationLi.appendChild(paginationHref);
        paginationUl.appendChild(paginationLi);
        paginationHref.addEventListener("click", () => {
          targetPage = parseInt(paginationHref.textContent);
          removeAllChildNodes(photoDiv);
          fetchBasic(roverName, selectedSolarDay, pagesCount, targetPage);
        });
      }
    }

    // *Create a move to LAST element
    const lastLi = document.createElement("li");
    lastLi.setAttribute("class", "page-item");
    const lastHref = document.createElement("a");
    lastHref.setAttribute("class", "page-link");
    lastHref.setAttribute("href", "#");
    lastHref.textContent = "Last page";
    lastLi.appendChild(lastHref);
    paginationUl.appendChild(lastLi);

    lastHref.addEventListener("click", () => {
      targetPage = pagesCount;
      removeAllChildNodes(photoDiv);
      fetchBasic(roverName, selectedSolarDay, pagesCount, targetPage);
    });
  }
}

function showSelectedPhotos(data, roverName, selectedSolarDay, camName, page) {
  // * Get the gallery div and clean it from existing content
  const photoDiv = document.querySelector("#photo-gallery");
  removeAllChildNodes(photoDiv);
  const pagesDiv = document.querySelector("#pages");
  removeAllChildNodes(pagesDiv);

  // *Create a div containing cards group
  const cardGroup = document.createElement("div");
  cardGroup.setAttribute("class", "row row-cols-1 row-cols-md-2 g-3");
  photoDiv.appendChild(cardGroup);

  // *Gallery is displayed from more places
  displayGallery(cardGroup, data);

  // * If requested page is empty then move to last working one (Pagination)
  if (data.photos.length === 0) {
    let targetPage = page - 1;
    removeAllChildNodes(photoDiv);
    fetchExpanded(roverName, selectedSolarDay, camName, targetPage);
  }

  // * PAGINATION LOGIC
  if (data.photos.length === 25 || page != 1) {
    // ? Create navigation and Previous element tab
    const pagesDiv = document.querySelector("#pages");
    const paginationNav = document.createElement("nav");
    paginationNav.setAttribute("aria-label", "pagination-nav");
    pagesDiv.appendChild(paginationNav);
    const paginationUl = document.createElement("ul");
    paginationUl.setAttribute("class", "pagination justify-content-center");
    paginationNav.appendChild(paginationUl);

    // *Create a move to a FIRST PAGE element
    const firstLi = document.createElement("li");
    firstLi.setAttribute("class", "page-item");
    const firstHref = document.createElement("a");
    firstHref.setAttribute("class", "page-link");
    firstHref.setAttribute("href", "#");
    firstHref.textContent = "First Page";
    firstLi.appendChild(firstHref);
    paginationUl.appendChild(firstLi);

    firstHref.addEventListener("click", () => {
      let targetPage = 1;
      removeAllChildNodes(photoDiv);
      fetchExpanded(roverName, selectedSolarDay, camName, targetPage);
    });

    // *Create a move to a PREVIOUS PAGE element
    const previousLi = document.createElement("li");
    previousLi.setAttribute("class", "page-item");
    const previousHref = document.createElement("a");
    previousHref.setAttribute("class", "page-link");
    previousHref.setAttribute("href", "#");
    previousHref.textContent = "Previous";
    previousLi.appendChild(previousHref);
    paginationUl.appendChild(previousLi);

    previousHref.addEventListener("click", () => {
      if (page > 1) {
        let targetPage = page - 1;
        removeAllChildNodes(photoDiv);
        fetchExpanded(roverName, selectedSolarDay, camName, targetPage);
      }
    });

    // * Create a CURRENT PAGE element
    const currentLi = document.createElement("li");
    currentLi.setAttribute("class", "page-item");
    const currentHref = document.createElement("a");
    currentHref.setAttribute("class", "page-link disabled");
    currentHref.setAttribute("href", "");
    currentHref.textContent = page;
    currentLi.appendChild(currentHref);
    paginationUl.appendChild(currentLi);

    // *Create a move to NEXT element
    const nextLi = document.createElement("li");
    nextLi.setAttribute("class", "page-item");
    const nextHref = document.createElement("a");
    nextHref.setAttribute("class", "page-link");
    nextHref.setAttribute("href", "#");
    nextHref.textContent = "Next Page";
    nextLi.appendChild(nextHref);
    paginationUl.appendChild(nextLi);

    nextHref.addEventListener("click", () => {
      targetPage = page + 1;
      removeAllChildNodes(photoDiv);
      fetchExpanded(roverName, selectedSolarDay, camName, targetPage);
    });
  }
}

// ? --------------------------------------------
// ? ----------DISPLAY PHOTO GALLERY-------------
// ? --------------------------------------------
function displayGallery(cardGroup, data) {
  // *Loop through requested data
  data.photos.forEach((element) => {
    const colCard = document.createElement("div");
    colCard.setAttribute("class", "col");
    cardGroup.appendChild(colCard);

    const cardBody = document.createElement("div");
    cardBody.setAttribute("class", "card h-100");
    colCard.appendChild(cardBody);

    // *Create card body elements
    const photoRef = document.createElement("a");
    photoRef.setAttribute("href", element.img_src);
    photoRef.setAttribute("target", "_blank");
    cardBody.append(photoRef);
    const cardPhoto = document.createElement("img");
    cardPhoto.setAttribute("class", "card-img-top");
    cardPhoto.setAttribute("src", element.img_src);
    cardPhoto.setAttribute("alt", "Made on: " + element.earth_date);
    photoRef.appendChild(cardPhoto);

    const photoDesc = document.createElement("ul");
    photoDesc.setAttribute("class", "list-group list-group-flush");
    cardBody.appendChild(photoDesc);

    const roverLi = document.createElement("li");
    roverLi.setAttribute("class", "list-group-item");
    roverLi.innerHTML = "<strong>Rover : </strong>" + element.rover.name;
    photoDesc.appendChild(roverLi);

    const solLi = document.createElement("li");
    solLi.setAttribute("class", "list-group-item");
    solLi.innerHTML = "<strong>Solar day : </strong>" + element.sol;
    photoDesc.appendChild(solLi);

    const idLi = document.createElement("li");
    idLi.setAttribute("class", "list-group-item");
    idLi.innerHTML = "<strong>Photo ID : </strong>" + element.id;
    photoDesc.appendChild(idLi);

    const camLi = document.createElement("li");
    camLi.setAttribute("class", "list-group-item");
    camLi.innerHTML = "<strong>Camera : </strong>" + element.camera.name;
    photoDesc.appendChild(camLi);

    // *Create a card footer
    const cardFooter = document.createElement("div");
    cardFooter.setAttribute("class", "card-footer");
    const footerContent = document.createElement("small");
    footerContent.setAttribute("class", "text-body-secondary");
    footerContent.innerHTML = "Earth date : " + element.earth_date;
    cardBody.appendChild(cardFooter);
    cardFooter.appendChild(footerContent);
  });
}
