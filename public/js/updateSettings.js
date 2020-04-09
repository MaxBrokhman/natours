import { showAlert } from './alerts.js'

const PASSWORD_URL = '/api/v1/users/updateMyPassword'
const DATA_URL = '/api/v1/users/updateProfile'

const updateData = async (data, url) => {
  try {
    const res = await fetch(url, {
      method: 'PATCH',
      body: data,
    })
    const updatedData = await res.json()
    if (!res.ok || !updatedData) return showAlert('error', 'Update failed')
    return updatedData
  } catch {
    showAlert('error', 'Update failed')
  }
}

const accountForm = document.querySelector('.form-user-data')
if (accountForm) {
  let initialNameValue = document.querySelector('#name').value
  let initialEmailValue = document.querySelector('#email').value
  accountForm.addEventListener('submit', async (evt) => {
    evt.preventDefault()
    const updates = {}
    const formData = new FormData()
    const nameInput = document.querySelector('#name')
    const emailInput = document.querySelector('#email')
    const photoInput = document.querySelector('#photo')
    const nameInputValue = nameInput.value
    const emailInputValue = emailInput.value
    const photoInputValue = photoInput.files[0]
    if (nameInputValue && nameInputValue !== initialNameValue) {
      formData.append('name', nameInputValue)
      updates['name'] = true
    }
    if (emailInputValue && emailInputValue !== initialEmailValue) {
      formData.append('email', emailInputValue)
      updates['email'] = true
    }
    if (photoInputValue) {
      formData.append('photo', photoInputValue)
      updates['photo'] = true
    }
    const updated = Object.keys(updates).length
      ? await updateData(formData, DATA_URL)
      : null
    if (updated && updated.user) {
      initialNameValue = updated.user.name
      initialEmailValue = updated.user.email
      showAlert('success', 'Info successfully changed!')
    }
  })
} 

const passwordForm = document.querySelector('.form-user-settings')
passwordForm && passwordForm.addEventListener('submit', async (evt) => {
  evt.preventDefault()
  const passwordCurrent = document.querySelector('#password-current').value
  const newPassword = document.querySelector('#password').value
  const passwordConfirm = document.querySelector('#password-confirm').value
  if (newPassword && newPassword === passwordConfirm) {
    const res = await updateData({
      passwordCurrent,
      password: newPassword,
      passwordConfirm,
    }, PASSWORD_URL)
    res.user && showAlert('success', 'Password successfully updated!')
  }
})
