import './sass/main.scss';

import axios from 'axios';
// import card from "./hbs/card";
import Notiflix from 'notiflix';
// import { AccessAlarm, ThreeDRotation } from '@mui/icons-material';
import SimpleLightbox from "simplelightbox"
import 'simplelightbox/dist/simple-lightbox.min.css';

const API_KEY = '24498679-f86143e0bdf849ada732017c0';
const BASE_URL = 'https://pixabay.com/api/'
let pageEl = 1;

const formEl = document.querySelector('#search-form');
const inputEl = document.querySelector('.input')
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const searchBtn = document.querySelector('.search-form__btn')
formEl.addEventListener("submit", inputUser);
loadMoreBtn.addEventListener("click", loadMore);

loadMoreBtn.classList.add('is-hidden');

async function inputUser(event) {
    try {
        pageEl = 1;
        event.preventDefault();
        loadMoreBtn.classList.add('is-hidden');
        const q = event.target.searchQuery.value.trim();
        clearGallery();
        if (q === "") {
            return;
        }
        console.log(q)
        const { data } = await fetchImages(q);
        if (data.total > 0) {
                showLoadBtn();
                Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`)
                renderGallery(data.hits);
                new SimpleLightbox('.gallery a', { captionDelay: 250, showCounter: false });
                
            } else {
                Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
                
            }  
    } catch (err) {
        console.log(err)
    };
}
const fetchImages = q => {
  return axios.get(`${BASE_URL}`, {
    params: {
      key: API_KEY,
      q,
      page: pageEl,
      per_page: 40,
    },
  });
};


async function loadMore(event) {
    try {
        pageEl += 1;
        const q = inputEl.value.trim();
        const { data } = await fetchImages(q);
        renderGallery(data.hits)
        if (data.total > 0 && data.hits.length >= 1) {
                showLoadBtn(loadMoreBtn);
                Notiflix.Notify.success(`Success ${data.hits.length} images loaded`)
                return;
            }
            if (data.hits.length === 0) {
                Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
                hideLoadBtn(loadMoreBtn)
            
            }
            renderGallery(data.hits);
            new SimpleLightbox('.gallery a', { captionDelay: 250, showCounter: false });
    } catch (err) {
        console.log(err)
    }
}
    


function clearGallery() {
    gallery.innerHTML = '';
}

function showLoadBtn() {
    loadMoreBtn.classList.remove('is-hidden');
}

function hideLoadBtn() {
    loadMoreBtn.classList.add('is-hidden');
}



    function renderGallery(images) {
        const markup = images
            .map(image => {
                return `
          <div class="card">
    <a class="gallery__item" href="${image.largeImageURL}">
        <img class="gallery__image" loading="lazy" src="${image.webformatURL}" alt=${image.tags}/>
        <div class="overlay">
            <div class="text">Open</div>
        </div>
    </a>
    <div class="info">
        <p class="info-item"><b>Likes &#9829</b>
            ${image.likes}
        </p>
        <p class="info-item"><b>Views &#128065</b>
            ${image.views}
        </p>
        <p class="info-item"><b>Comments &#128387</b>
            ${image.comments}
        </p>
        <p class="info-item"><b>Downloads &#129095</b>
            ${image.downloads}
        </p>
    </div>
</div>`;
            })
            .join(' ');

        gallery.insertAdjacentHTML('beforeend', markup);
    
        //renderGallery(data.hits);
        //new SimpleLightbox('.gallery a', { captionsData: 'alt', captionDelay: 250 });
    }