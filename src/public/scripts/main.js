/* eslint-disable no-undef */
// Declaração de variáveis
const toggleMenu = document.querySelectorAll('.toggle_menu');

const menuMobile = document.querySelector('.mob_menu');

const overlay = document.querySelector('.menu_overlay');

const btnMobMenu = document.querySelector('.btn_mob_menu .material-icons');

// Abrindo e fechando o Menu Mobile
for (let m = 0; m < toggleMenu.length; m += 1) {
  toggleMenu[m].addEventListener('click', () => {
    overlay.classList.toggle('menu_overlay_is_open');
    menuMobile.classList.toggle('btn_mob_menu_is_closed');
    menuMobile.classList.toggle('btn_mob_menu_is_open');

    const icon = btnMobMenu.innerHTML;

    if (icon === 'menu') {
      btnMobMenu.innerHTML = 'close';
    } else {
      btnMobMenu.innerHTML = 'menu';
    }
  });
}
