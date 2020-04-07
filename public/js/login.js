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

const logout = async () => {
  try {
    const res = await fetch('/api/v1/users/logout', {
      method: 'GET',
    })
    res.ok && window.location.assign('/')
  } catch (err) {
    showAlert('error', 'Error logging out. Please try again later.')
  }
}

const form = document.querySelector('.form-login')
form && form.addEventListener('submit', (evt) => {
  evt.preventDefault()
  const email = document.querySelector('#email').value
  const password = document.querySelector('#password').value
  login(email, password)
})

const logoutBtn = document.querySelector('.nav__el--logout')
logoutBtn && logoutBtn.addEventListener('click', (evt) => {
  evt.preventDefault()
  logout()
})
