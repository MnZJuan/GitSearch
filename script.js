document.getElementById('search-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const searchInput = document.getElementById('search-input');
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const results = document.getElementById('results');
    
    const query = searchInput.value.trim();
    if (!query) return;

    // Mostrar loading e limpar estados anteriores
    loading.classList.remove('hidden');
    error.classList.add('hidden');
    results.innerHTML = '';

    try {
        const response = await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Erro ao buscar repositórios');
        }

        results.innerHTML = data.items
            .map(repo => `
                <div class="repository-card">
                    <img src="${repo.owner.avatar_url}" alt="${repo.owner.login}" style="width: 50px; height: 50px; border-radius: 25px;">
                    <h3>${repo.name}</h3>
                    <p>${repo.description || 'Sem descrição'}</p>
                    <div class="repository-info">
                        <span>⭐ ${repo.stargazers_count}</span>
                        ${repo.language ? `<span>🔤 ${repo.language}</span>` : ''}
                    </div>
                    <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">Ver no GitHub</a>
                </div>
            `)
            .join('');

    } catch (err) {
        error.textContent = err.message;
        error.classList.remove('hidden');
    } finally {
        loading.classList.add('hidden');
    }
});
