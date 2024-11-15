function scrollToCards() {
    var targetElement = document.getElementById('container-cards');
    if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
    } else {
        console.log('Elemento com id "container-cards" não encontrado.');
    }
}
