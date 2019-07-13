import '../css/style.scss';

const config = require('../js/config');
const Ymap = require('./components/api.ymaps');
const Dom = require('./components/dom');

let places = [];

ymaps.ready(() => init());

const mapContainer = document.getElementById('map'),
    modal = document.getElementById('modal'),
    modalAddress = document.getElementById('modal-address');

const init = () => {
    const dom = new Dom();

    document.documentElement.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-close')) {
            dom.modalClose();
        }
    });

    modal.addEventListener('click', (e) => {
        const name = document.getElementById('inputName').value,
            place = document.getElementById('inputPlace').value,
            feedback = document.getElementById('inputReview').value;

        if (e.target.classList.contains('save__btn')) {
            let coords = e.target.dataset.coords.split(',');
            e.preventDefault();

            if (name !== '' && place !== '' && feedback !== '') {
                createPlace(coords, {
                    name: name,
                    place: place,
                    feedback: feedback,
                    address: modalAddress.textContent,
                    date: new Date().toLocaleString()
                });
                dom.feedbackFormReset();
            }
        }
    });

    const myApiYandex = new Ymap();
    myApiYandex.mapInit('map', config.map.options);
    myApiYandex.setControls(config.map.controls);

    myApiYandex.map.events.add('click', e => {
        let target = e.get('pagePixels');
        let coords = myApiYandex.formatCoords(e.get('coords'));
        let x = target[0];
        let y = target[1];

        myApiYandex.getAddress(coords, address => {
            myApiYandex.clusterer.balloon.close();
            dom.modalOpen(x, y, address, places, coords);
        });
    });

    myApiYandex.map.balloon.events.add('open', function (event) {
        dom.modalClose();
    });

    mapContainer.addEventListener('click', e => {
        e.preventDefault();
        let target = e.target;
        if (target.dataset.review) {
            let coords = target.dataset.coords;
            let address = target.dataset.address;
            myApiYandex.clusterer.balloon.close();
            dom.modalOpen(e.pageX, e.pageY, address, places, coords);
        }
    });

    const createPlace = (coords, formData) => {
        let place = {};
        place.coords = [coords[0], coords[1]];
        place.address = formData.address;
        place.name = formData.name;
        place.feedback = formData.feedback;
        place.place = formData.place;
        place.date = formData.date;

        places.push(place);
        myApiYandex.createPlacemark(coords, formData, places);
        dom.renderFeedbackList(formData.address, places);
    };
};
