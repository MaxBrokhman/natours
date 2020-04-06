const login = async (email, password) => {
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
  console.log(res)
}

document.querySelector('.form').addEventListener('submit', (evt) => {
  evt.preventDefault()
  const email = document.querySelector('#email').value
  const password = document.querySelector('#password').value
  login(email, password)
})
