import { showAlert } from './alerts.js'

const updateData = async (data) => {
  try {
    const res = await fetch('/api/v1/users/updateProfile', {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
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
    const nameInput = document.querySelector('#name')
    const emailInput = document.querySelector('#email')
    const nameInputValue = nameInput.value
    const emailInputValue = emailInput.value
    if (nameInputValue && nameInputValue !== initialNameValue) {
      updates.name = nameInputValue
    }
    if (emailInputValue && emailInputValue !== initialEmailValue) {
      updates.email = emailInputValue
    }
    const updated = Object.keys(updates).length
      ? await updateData(updates)
      : null
    if (updated && updated.user) {
      initialNameValue = updated.user.name
      initialEmailValue = updated.user.email
      showAlert('success', 'Info successfully changed!')
    }
  })
} 
