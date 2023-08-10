let picContainer = document.getElementById("api-data");

const photos = [photo1, photo2];

for (let i = 0; i < photos.length; i++) {
    let pic = document.createElement('img');
    pic.setAttribute('src', photos[i])
    picContainer.appendChild(pic);
}
