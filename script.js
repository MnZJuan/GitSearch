let currentSearchType = 'repositories';
let languagesChart = null;
let githubToken = localStorage.getItem('githubToken') || null;

// Atualizar o campo de entrada com o token salvo
document.getElementById('tokenInput').value = githubToken || '';

// Salvar o token no localStorage
document.getElementById('saveToken').addEventListener('click', () => {
    const tokenInput = document.getElementById('tokenInput');
    const token = tokenInput.value.trim();
    if (token) {
        githubToken = token;
        localStorage.setItem('githubToken', token);
        console.log('Token salvo no localStorage:', githubToken);
        alert('Token salvo com sucesso!');
    } else {
        alert('Por favor, insira um token válido.');
    }
});

// Apagar o token do localStorage
document.getElementById('deleteToken').addEventListener('click', () => {
    localStorage.removeItem('githubToken');
    githubToken = null;
    document.getElementById('tokenInput').value = '';
    console.log('Token apagado do localStorage.');
    alert('Token apagado com sucesso!');
});

// Gerenciamento das tabs
document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', (e) => {
        currentSearchType = e.target.dataset.type;
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        document.getElementById('user-profile').classList.add('hidden');
        document.getElementById('results').innerHTML = '';
    });
});

// Atualizar a função de busca para tratar exceções e exibir mensagens claras
document.getElementById('search-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const searchInput = document.getElementById('search-input');
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const results = document.getElementById('results');
    const userProfile = document.getElementById('user-profile');
    
    const query = searchInput.value.trim();
    if (!query) return;

    loading.classList.remove('hidden');
    error.classList.add('hidden');
    results.innerHTML = '';
    userProfile.classList.add('hidden');

    try {
        if (currentSearchType === 'users') {
            await searchUser(query);
        } else {
            await searchRepositories(query);
        }
    } catch (err) {
        error.textContent = `${err.message} Por favor, insira um token válido na área indicada acima, se necessário.`;
        error.classList.remove('hidden');
    } finally {
        loading.classList.add('hidden');
    }
});

// Atualizar a função githubFetch para capturar o número de requisições restantes
async function githubFetch(url) {
    try {
        const headers = {
            'Accept': 'application/vnd.github.v3+json'
        };
        
        if (githubToken) {
            headers['Authorization'] = `Bearer ${githubToken}`;
        }

        const response = await fetch(url, { headers });

        // Atualizar o número de requisições restantes
        const remaining = response.headers.get('X-RateLimit-Remaining');
        const rateLimitInfo = document.getElementById('rate-limit-info');
        if (remaining !== null) {
            rateLimitInfo.textContent = `Requisições restantes: ${remaining}`;
            rateLimitInfo.classList.remove('hidden');
        }
        
        if (response.status === 403) {
            const resetTime = new Date(response.headers.get('X-RateLimit-Reset') * 1000);
            const minutes = Math.ceil((resetTime - new Date()) / (1000 * 60));
            throw new Error(`Limite de requisições atingido. Tente novamente em ${minutes} minutos ou insira um token válido na área indicada.`);
        }

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Erro na requisição:', error);
        throw error;
    }
}

// Atualizar a função searchUser para tratar falhas
async function searchUser(query) {
    try {
        const userData = await githubFetch(`https://api.github.com/users/${query}`);
        const reposData = await githubFetch(`https://api.github.com/users/${query}/repos?per_page=100&sort=updated`);
        
        displayUserProfile(userData);
        displayUserStats(reposData);
        
        const reposWithCommits = await Promise.all(reposData.map(async repo => {
            try {
                const lastCommit = await getLastCommit(query, repo.name);
                return { ...repo, lastCommit };
            } catch (error) {
                console.warn(`Erro ao buscar commit para ${repo.name}:`, error);
                return { ...repo, lastCommit: null };
            }
        }));

        displayRepositories(reposWithCommits);
    } catch (error) {
        console.error('Erro na busca de usuário:', error);
        throw new Error('Usuário não encontrado. Verifique o termo de busca ou insira um token válido.');
    }
}

function displayUserProfile(user) {
    const userProfile = document.getElementById('user-profile');
    userProfile.classList.remove('hidden');
    
    userProfile.querySelector('.profile-header').innerHTML = `
        <img src="${user.avatar_url}" alt="${user.login}" style="width: 100px; height: 100px; border-radius: 50%;">
        <div>
            <h2>${user.name || user.login}</h2>
            <p>${user.bio || ''}</p>
            <p>👥 ${user.followers} seguidores · ${user.following} seguindo</p>
            ${user.company ? `<p>🏢 ${user.company}</p>` : ''}
            ${user.location ? `<p>📍 ${user.location}</p>` : ''}
            ${user.blog ? `<p>🌐 <a href="${user.blog}" target="_blank">${user.blog}</a></p>` : ''}
        </div>
    `;
}

function displayUserStats(repos) {
    const languages = {};
    let totalStars = 0;
    let totalForks = 0;

    repos.forEach(repo => {
        if (repo.language) {
            languages[repo.language] = (languages[repo.language] || 0) + 1;
        }
        totalStars += repo.stargazers_count;
        totalForks += repo.forks_count;
    });

    // Atualizar gráfico de linguagens
    if (languagesChart) {
        languagesChart.destroy();
    }

    const ctx = document.getElementById('languagesChart').getContext('2d');
    languagesChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(languages),
            datasets: [{
                data: Object.values(languages),
                backgroundColor: generateColors(Object.keys(languages).length)
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Linguagens Mais Usadas',
                    color: '#c9d1d9'
                },
                legend: {
                    labels: {
                        color: '#c9d1d9'
                    }
                }
            }
        }
    });

    document.getElementById('general-stats').innerHTML = `
        <p>⭐ Total de estrelas: ${totalStars}</p>
        <p>🔄 Total de forks: ${totalForks}</p>
        <p>📚 Repositórios públicos: ${repos.length}</p>
    `;
}

async function getLastCommit(owner, repo) {
    try {
        const commits = await githubFetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`);
        return commits[0];
    } catch (error) {
        console.warn('Erro ao buscar commits:', error);
        return null;
    }
}

function formatCommitDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `${diffDays} dias atrás`;
    if (diffDays < 30) return `${Math.floor(diffDays/7)} semanas atrás`;
    return date.toLocaleDateString();
}

async function displayRepositories(repos) {
    const results = document.getElementById('results');
    
    if (!repos || repos.length === 0) {
        results.innerHTML = '<div class="no-results">Nenhum repositório encontrado</div>';
        return;
    }

    results.innerHTML = repos
        .map(repo => `
            <div class="repository-card">
                <h3 title="${repo.name}">${repo.name}</h3>
                <p>${repo.description || 'Sem descrição'}</p>
                ${repo.lastCommit ? `
                    <div class="commit-info">
                        <p title="${repo.lastCommit.commit.message}">🔨 ${repo.lastCommit.commit.message.split('\n')[0]}</p>
                        <p class="commit-author">👤 ${repo.lastCommit.commit.author.name}</p>
                        <p class="commit-date">🕒 ${formatCommitDate(repo.lastCommit.commit.author.date)}</p>
                    </div>
                ` : ''}
                <div class="repository-info">
                    <span>⭐ ${repo.stargazers_count}</span>
                    <span>🔄 ${repo.forks_count}</span>
                    ${repo.language ? `<span>🔤 ${repo.language}</span>` : ''}
                    <span class="info-icon" title="Mais informações">ℹ️
                        <div class="tooltip">
                            <strong>Detalhes do Repositório:</strong><br>
                            Criado em: ${new Date(repo.created_at).toLocaleDateString()}<br>
                            Último push: ${new Date(repo.pushed_at).toLocaleDateString()}<br>
                            ${repo.license ? `Licença: ${repo.license.name}<br>` : ''}
                            Tamanho: ${(repo.size/1024).toFixed(2)}MB<br>
                            Issues abertas: ${repo.open_issues_count}
                        </div>
                    </span>
                </div>
                <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">Ver no GitHub</a>
            </div>
        `)
        .join('');
}

function generateColors(count) {
    const colors = [];
    for (let i = 0; i < count; i++) {
        colors.push(`hsl(${(i * 360) / count}, 70%, 50%)`);
    }
    return colors;
}

// Atualizar também a função searchRepositories
async function searchRepositories(query) {
    try {
        const data = await githubFetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars`);
        
        if (!data.items || data.items.length === 0) {
            throw new Error('Nenhum repositório encontrado. Verifique o termo de busca ou insira um token válido.');
        }

        const results = document.getElementById('results');
        results.innerHTML = '<div class="loading">Carregando informações dos commits...</div>';

        const reposWithCommits = await Promise.all(data.items.map(async repo => {
            try {
                const lastCommit = await getLastCommit(repo.owner.login, repo.name);
                return { ...repo, lastCommit };
            } catch (error) {
                console.warn(`Erro ao buscar commits para ${repo.name}:`, error);
                return { ...repo, lastCommit: null };
            }
        }));

        displayRepositories(reposWithCommits);
    } catch (error) {
        console.error('Erro na busca de repositórios:', error);
        const errorDiv = document.getElementById('error');
        errorDiv.textContent = error.message;
        errorDiv.classList.remove('hidden');
    }
}
