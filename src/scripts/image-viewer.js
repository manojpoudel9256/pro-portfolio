// IMAGE MODAL FUNCTIONS
let imageModalScrollState = null;

function openImageModal(card) {
    const photo = card.querySelector('.edu-photo img');
    const title = card.querySelector('.edu-title');
    const school = card.querySelector('.edu-school');
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalSubtitle = document.getElementById('modalSubtitle');

    modalImage.src = photo.src; // full-size original, not the srcset thumbnail
    modalImage.alt = photo.alt;
    modalImage.dataset.i18nAlt = photo.dataset.i18nAlt;
    modalTitle.textContent = title.textContent;
    modalTitle.dataset.i18n = title.dataset.i18n;
    modalSubtitle.textContent = school.textContent;
    modalSubtitle.dataset.i18n = school.dataset.i18n;

    // Lenis handles wheel input independently of native overflow locks.
    // Capture the previous state once, including when switching photos.
    if (!imageModalScrollState) {
        imageModalScrollState = {
            rootOverflow: document.documentElement.style.overflow,
            bodyOverflow: document.body.style.overflow,
            scroller: window.lenis,
            wasStopped: window.lenis ? window.lenis.isStopped : true
        };
        if (imageModalScrollState.scroller) imageModalScrollState.scroller.stop();
    }
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    modal.scrollTop = 0; // reused for every photo: start at the top
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    window.dialogFocus.open(modal, modal.querySelector('.image-modal-close'));
}

function closeImageModal() {
    const modal = document.getElementById('imageModal');
    if (!modal.classList.contains('active')) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    window.dialogFocus.close(modal);
    if (imageModalScrollState) {
        const state = imageModalScrollState;
        document.documentElement.style.overflow = state.rootOverflow;
        document.body.style.overflow = state.bodyOverflow;
        if (state.scroller && !state.wasStopped) state.scroller.start();
        imageModalScrollState = null;
    }
}

// Close modal on background click
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('imageModal');
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeImageModal();
        }
    });
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeImageModal();
    }
});

