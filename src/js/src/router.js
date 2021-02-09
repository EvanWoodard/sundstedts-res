function setListeners() {
    const content = document.querySelector('.page-content');
    const links = document.querySelectorAll('.menu-item-wc');
    for (const link of links) {
        link.addEventListener('click', async (event) => {
            event.preventDefault();
            try {
                const { loadPageTo } = await import(`https://cdn.sundstedt.us/wcp/${link.dataset.entryModule}.js`);
                loadPageTo(content);
            } catch (error) {
                content.textContent = error.message;
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', setListeners, false);