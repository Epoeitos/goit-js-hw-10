import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');

form.addEventListener('submit', e => {
  e.preventDefault();

  const state = form.elements['state'].value;
  const delay = Number(form.elements['delay'].value);

  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
          resolve(`Fulfilled promise in ${delay}ms`);
          form.reset();
      } else {
          reject(`Rejected promise in ${delay}ms`);
          form.reset();
      }
    }, delay);
  });

  promise
    .then(message => {
      iziToast.success({
        message,
        position: 'topRight',
      });
    })
    .catch(message => {
      iziToast.error({
        message,
        position: 'topRight',
      });
    });
});