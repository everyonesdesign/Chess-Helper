const script = document.createElement('script');
// %s is replaced during building
// eslint-disable-next-line quotes
script.innerHTML = (`%%s%%`);
window.addEventListener('load', () => {
  document.body.appendChild(script);
});
