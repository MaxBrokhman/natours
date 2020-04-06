import { showAlert } from './alerts.js'

const login = async (email, password) => {
  try {
    const res = await fetch('/api/v1/users/login', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
      }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:3000',
      },
    })
    const data = await res.json()
    if (res.ok) {
      showAlert('success', 'Logged in successfully!!')
      window.location.assign('/')
    } else {
      throw new Error(data.message)
    }
  } catch (err) {
    showAlert('error', err.message)
  }
}
const form = document.querySelector('.form')
form && form.addEventListener('submit', (evt) => {
  evt.preventDefault()
  const email = document.querySelector('#email').value
  const password = document.querySelector('#password').value
  login(email, password)
})
