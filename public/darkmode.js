const checkbox = document.getElementById('checkbox');
const htmlInner = document.querySelector('html');

checkbox.addEventListener('click', () => {
    checkbox.checked ? htmlInner.classList.add('dark') : htmlInner.classList.remove('dark');
})