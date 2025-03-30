# GitHub Repository Search

Uma aplicação web simples que permite buscar repositórios no GitHub usando a API pública do GitHub.

## 💻 Funcionalidades

- Busca de repositórios do GitHub por palavra-chave
- Exibição de resultados em cards interativos
- Informações exibidas para cada repositório:
  - Nome do repositório
  - Avatar do proprietário
  - Descrição
  - Número de estrelas
  - Linguagem de programação principal
  - Link direto para o repositório

## 🚀 Como usar

1. Clone este repositório ou baixe os arquivos
2. Abra o arquivo `index.html` em seu navegador
3. Digite o termo de busca no campo de pesquisa
4. Clique em "Pesquisar" ou pressione Enter

## 🔧 Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript (ES6+)
- GitHub REST API

## ⚙️ Como funciona

A aplicação utiliza a API de busca do GitHub (`https://api.github.com/search/repositories`) para encontrar repositórios. Quando uma pesquisa é realizada:

1. A aplicação faz uma requisição GET para a API do GitHub
2. Os resultados são processados e exibidos em cards
3. Cada card mostra informações relevantes do repositório
4. Os cards são clicáveis e levam ao repositório original no GitHub

## 🔍 Detalhes técnicos

### Endpoints utilizados

```
GET https://api.github.com/search/repositories?q={termo_busca}
```

### Estrutura do projeto

```
GitSearch/
├── index.html      # Estrutura da página
├── styles.css      # Estilos da aplicação
└── script.js       # Lógica de busca e exibição
```

## 📝 Limitações

- A API do GitHub possui limites de taxa para requisições não autenticadas
- São exibidos apenas os primeiros 30 resultados por página
- Algumas informações podem estar indisponíveis dependendo da configuração do repositório

## 💡 Dicas de uso

- Use palavras-chave específicas para melhores resultados
- Combine termos de busca (ex: "react typescript")
- Aguarde o carregamento completo entre as buscas
- Clique nos cards para ver mais detalhes no GitHub

## 🤝 Contribuindo

Sinta-se livre para:
1. Fazer um fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abrir um Pull Request

Aplicação MNZ - Juan Menezes