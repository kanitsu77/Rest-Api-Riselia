async function loadData() {
  try {
    const res = await fetch('/api/docs')
    const data = await res.json()

    const container = document.getElementById('container')
    container.innerHTML = ''

    const categories = data.APIs.categories

    Object.keys(categories).forEach(category => {
      categories[category].forEach(api => {

        container.innerHTML += `
          <div class="card">
            <h3>${api.name}</h3>
            <p>${api.description}</p>

            <input 
              id="input-${api.name}" 
              placeholder="Masukkan ${Object.keys(api.params)[0]}"
            >

            <button onclick="execute('${api.path}', ${api.apikey}, '${api.name}')">
              Execute
            </button>

            <pre id="result-${api.name}"></pre>

            <code>
GET /api/${api.path}?q=example${api.apikey ? '&apikey=Tee' : ''}
            </code>
          </div>
        `
      })
    })

  } catch (err) {
    document.getElementById('container').innerHTML =
      '<p style="color:red">Gagal fetch /api/docs</p>'
  }
}

async function execute(path, needKey, name) {
  const input = document.querySelector(`#input-${name}`).value

  let url = `/api/${path}?q=${encodeURIComponent(input)}`
  if (needKey) url += `&apikey=Tee`

  const res = await fetch(url)
  const data = await res.json()

  document.querySelector(`#result-${name}`).textContent =
    JSON.stringify(data, null, 2)
}

document.addEventListener('DOMContentLoaded', () => {
  loadData()

  document.getElementById('search').addEventListener('input', function () {
    const value = this.value.toLowerCase()
    document.querySelectorAll('.card').forEach(card => {
      card.style.display =
        card.innerText.toLowerCase().includes(value)
          ? 'block'
          : 'none'
    })
  })
})
