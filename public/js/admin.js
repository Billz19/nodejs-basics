const deleteProduct = (btn) => {
  const id = btn.parentNode.querySelector('[name="id"]').value;
  const _csrf = btn.parentNode.querySelector('[name="_csrf"]').value;
  const targetElement = btn.closest('article');
  fetch('/admin/product/' + id, {
    method: 'DELETE',
    headers: {
      'csrf-token': _csrf,
    },
  })
    .then((result) => result.json())
    .then(data => {
        console.log(data);
        targetElement.parentNode.removeChild(targetElement);
    })
    .catch((error) => console.log(error));
};
