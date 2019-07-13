const Dom = require('./dom');
let dom = new Dom();

module.exports = class {
    constructor() {
        this.clusterer = {};
        this.placeMarkSettings = {
            preset: 'islands#redStretchyIcon',
            hasBalloon: false
        };
    }

    mapInit(selector, config) {
        this.map = new ymaps.Map(selector, config.default, config.additional);

        this.clusterer = new ymaps.Clusterer({
            clusterDisableClickZoom: true,
            clusterOpenBalloonOnClick: true,
            clusterBalloonContentLayout: 'cluster#balloonCarousel',
            clusterBalloonPanelMaxMapArea: 0,
            clusterBalloonContentLayoutWidth: 400,
            clusterBalloonContentLayoutHeight: 200,
            clusterBalloonPagerSize: 5,
            preset: 'islands#invertedRedClusterIcons'
        });

        this.clusterer.events.add('objectsaddtomap', function () {
            let geoObjectState = cluster.getObjectState(myGeoObjects[1]);
            if (geoObjectState.isShown) {
                if (geoObjectState.isClustered) {
                    geoObjectState.cluster.state.set('activeObject', myGeoObjects[1]);
                    geoObjectState.cluster.balloon.open();

                } else {
                    myGeoObjects[1].balloon.open();
                }
            }
        });

        this.map.geoObjects.add(this.clusterer);
    }

    setControls(config) {
        this.map.controls.add(new ymaps.control.ZoomControl(config.zoom));
        this.map.controls.add(new ymaps.control.FullscreenControl(config.fullscreen));
    }

    getAddress(coords, callback) {
        ymaps.geocode(coords).then(res => {
            let firstGeoObject = res.geoObjects.get(0);
            let address = firstGeoObject.getAddressLine();
            if (callback) {
                callback(address);
            }
        });
    }

    createPlacemark(coords, data, places) {
        let placemark = new ymaps.Placemark(
            coords,
            this.getPlacemarkData(coords, data),
            this.placeMarkSettings
        );

        placemark.events.add(['click'], e => {
            let originalEvent = e.get('domEvent').originalEvent;
            let x = originalEvent.clientX;
            let y = originalEvent.clientY;
            let coords = e.get('target').geometry.getCoordinates();
            this.getAddress(coords, address => {
                this.clusterer.balloon.close();
                dom.modalOpen(x, y, address, places, coords)
            });
        });

        this.map.geoObjects.add(placemark);
        this.clusterer.add(placemark);
    }

    getPlacemarkData(coords, data) {
        return {
            balloonContentHeader: `<strong>${data.place}</strong>`,
            balloonContentBody: `<a data-review="true" 
                                    data-coords="${coords[0]},${coords[1]}" 
                                    data-address="${data.address}" 
                                    href="#">${data.address}</a>
                                 <div>${data.feedback}</div>`,
            balloonContentFooter: `<div>${data.date}</div>`
        };
    }

    formatCoords(coords) {
        let result = [];
        coords.forEach(item => {
            item = Number(item);
            result.push((Number(item.toPrecision(6))));
        });
        return result;
    }
};
