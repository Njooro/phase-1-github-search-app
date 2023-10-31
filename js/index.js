const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const reposResults = document.getElementById('reposResults');

searchForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const username = searchInput.value;
  fetch(`https://api.github.com/search/users?q=${username}`)
    .then(response => response.json())
    .then(data => {
      searchResults.innerHTML = '';
      data.items.forEach(user => {
        const userElement = document.createElement('div');
        userElement.innerHTML = `
          <img src="${user.avatar_url}" alt="User Avatar" style="width:100px;height:100px;">
          <p>Username: ${user.login}</p>
          <a href="${user.html_url}" target="_blank">Profile Link</a>
        `;
        userElement.addEventListener('click', function () {
          fetch(`https://api.github.com/users/${user.login}/repos`)
            .then(response => response.json())
            .then(reposData => {
              reposResults.innerHTML = '';
              reposData.forEach(repo => {
                const repoElement = document.createElement('div');
                repoElement.innerHTML = `
                  <p><strong>Repository:</strong> ${repo.name}</p>
                  <p><strong>Description:</strong> ${repo.description || 'No description'}</p>
                  <p><strong>URL:</strong> <a href="${repo.html_url}" target="_blank">${repo.html_url}</a></p>
                  <hr>
                `;
                reposResults.appendChild(repoElement);
              });
            })
            .catch(error => console.error('Error fetching repositories:', error));
        });
        searchResults.appendChild(userElement);
      });
    })
    .catch(error => console.error('Error fetching users:', error));
});