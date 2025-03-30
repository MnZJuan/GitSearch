# GitHub Repository Search

Uma aplicação web simples que permite buscar repositórios e usuários no GitHub usando a API pública do GitHub.

## 💻 Funcionalidades

- Busca de repositórios do GitHub por palavra-chave.
- Busca de usuários ou organizações do GitHub.
- Exibição de resultados em cards interativos.
- Informações exibidas para cada repositório:
  - Nome do repositório.
  - Avatar do proprietário.
  - Descrição.
  - Número de estrelas.
  - Linguagem de programação principal.
  - Link direto para o repositório.
- Informações exibidas para cada usuário:
  - Nome ou login.
  - Biografia.
  - Número de seguidores e seguindo.
  - Empresa, localização e blog (se disponíveis).
- Gerenciamento de token:
  - Campo para inserir e salvar o token do GitHub.
  - Botão para apagar o token salvo.
- Exibição do número de requisições restantes da API do GitHub.

## 🚀 Como usar

1. Clone este repositório ou baixe os arquivos.
2. Abra o arquivo `index.html` em seu navegador.
3. Insira um token do GitHub no campo "Token" (opcional, mas recomendado para aumentar o limite de requisições).
4. Clique em "Salvar" para armazenar o token.
5. Escolha entre "Repositórios" ou "Usuários/Organizações".
6. Digite o termo de busca no campo de pesquisa.
7. Clique em "Pesquisar" ou pressione Enter.
8. Veja os resultados e clique nos cards para acessar mais detalhes no GitHub.

## 🔧 Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript (ES6+)
- GitHub REST API
- Chart.js (para gráficos de linguagens)

## ⚙️ Como funciona

A aplicação utiliza a API do GitHub para buscar repositórios e usuários. Quando uma pesquisa é realizada:

1. A aplicação faz uma requisição GET para a API do GitHub.
2. Os resultados são processados e exibidos em cards.
3. Cada card mostra informações relevantes do repositório ou usuário.
4. Os cards são clicáveis e levam ao repositório ou perfil original no GitHub.

### Gerenciamento de Token

- O token do GitHub pode ser inserido no campo "Token" no canto superior direito.
- O token é salvo no `localStorage` e usado para autenticar as requisições.
- O botão "Apagar Token" permite remover o token salvo.

### Exibição do Número de Requisições Restantes

- A aplicação exibe o número de requisições restantes da API do GitHub abaixo da área de pesquisa.
- Essa informação é atualizada automaticamente após cada requisição.

## 🔍 Detalhes técnicos

### Endpoints utilizados

#### Repositórios
```
GET https://api.github.com/search/repositories?q={termo_busca}
```

### Estrutura do projeto

```
GitSearch/
├── index.html      # Estrutura da página
├── styles.css      # Estilos da aplicação
├── script.js       # Lógica de busca e exibição
└── README.md       # Documentação do projeto
```

## 📝 Limitações

- A API do GitHub possui limites de taxa para requisições:
  - 60 requisições por hora para usuários não autenticados.
  - 5000 requisições por hora para usuários autenticados com token.
- São exibidos apenas os primeiros 30 resultados por página.
- Algumas informações podem estar indisponíveis dependendo da configuração do repositório ou usuário.

## 💡 Dicas de uso

- Use palavras-chave específicas para melhores resultados.
- Combine termos de busca (ex: "react typescript").
- Insira um token do GitHub para aumentar o limite de requisições.
- Clique nos cards para ver mais detalhes no GitHub.

## 🤝 Contribuindo

Sinta-se livre para:
1. Fazer um fork do projeto.
2. Criar uma branch para sua feature (`git checkout -b feature/AmazingFeature`).
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`).
4. Push para a branch (`git push origin feature/AmazingFeature`).
5. Abrir um Pull Request.

Aplicação MNZ - Juan Menezes