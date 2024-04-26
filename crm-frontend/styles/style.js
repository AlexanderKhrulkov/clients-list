document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.modal__string').forEach(function(e) {
    let input = e.querySelector('.modal__input');
    let label = e.querySelector('.modal__label');



    input.addEventListener('keyup', function() {
      if (input.value != '') {
        input.classList.add('focused');
      }
      else {
        input.classList.remove('focused');
      }
    })

    let star = label.querySelector('span');
    if (star) {
      star.style.color = 'var(--firm)';
    }
  })
})


