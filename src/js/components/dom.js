const feeedbackForm = document.getElementById('feeedback-form'),
    modal = document.getElementById('modal'),
    modalAddress = document.getElementById('modal-address'),
    feedbackList = document.getElementById('feedbacks-list'),
    modalBtn = document.getElementById('btn');

module.exports = class {
    constructor() {
    }

    modalClose() {
        modal.classList.add('hide');
        return this.feedbackFormReset();
    }

    modalOpen(x, y, address, places, coords) {
        let feedbacks = [];
        modalBtn.dataset.coords = coords;
        let emptyString = '<li>' + 'Отзывов пока что нет' + '</li>';
        places.forEach(function (item) {
            if (item.address === address) {
                feedbacks.push(item);
            }
        });
        if (feedbacks.length) {
            let layout = this.showFeedback(feedbacks);
            feedbackList.innerHTML = '';
            feedbackList.innerHTML += layout;
        } else {
            feedbackList.innerHTML = emptyString;
        }
        modalAddress.innerText = address;
        modal.style.top = y + 'px';
        modal.style.left = x + 'px';
        modal.classList.remove('hide');
    }

    feedbackFormReset() {
        return feeedbackForm.reset();
    }

    showFeedback(item) {
        let feedback = require('../../templates/feedback.hbs');
        return feedback({
            item: item
        });
    }

    renderFeedbackList(address, places) {
        let feedbacks = [];
        places.forEach(function (item) {
            if (item.address === address) {
                feedbacks.push(item);
            }
        });
        feedbackList.innerHTML = this.showFeedback(feedbacks);
    }
};