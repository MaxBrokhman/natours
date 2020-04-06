const hideAlert = () => {
  const alert = document.querySelector('.alert')
  if (alert) alert.remove()
}

export const showAlert = (type, message) => {
  hideAlert()
  const alert = document.createElement('div')
  alert.className = `alert alert--${type}`
  alert.textContent = message
  document.body.insertAdjacentElement('afterbegin', alert)
}
