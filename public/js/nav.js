// nav.js
document.addEventListener('DOMContentLoaded', () => {
  const mobileMenuButton = document.querySelector('.md\\:hidden button');
  const navLinks = document.querySelector('.md\\:flex');

  mobileMenuButton.addEventListener('click', () => {
    navLinks.classList.toggle('hidden');
  });
});

console.log('nav.js loaded');