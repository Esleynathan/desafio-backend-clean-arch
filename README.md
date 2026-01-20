# Projeto Fullstack - Cadastro de Pessoas

Este projeto é uma aplicação completa (Fullstack) para o gerenciamento de pessoas, permitindo operações de CRUD (Criar, Ler, Atualizar, Deletar) e funcionalidades extras como o cálculo de peso ideal.

## 🚀 Tecnologias Utilizadas

### Backend
- **Linguagem:** Python 3.10+
- **Framework:** Django
- **Arquitetura:** API REST (com DTOs e Services)

### Frontend
- **Framework:** Angular (v17+)
- **Estilização:** Tailwind CSS
- **Linguagem:** TypeScript

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:
- [Python](https://www.python.org/)
- [Node.js](https://nodejs.org/) (Versão LTS v20 ou superior)
- [Angular CLI](https://angular.io/cli) (`npm install -g @angular/cli`)

## 🔧 Instalação e Execução

### 1. Backend (Python)

```bash
# Ative o ambiente virtual
.\venv\Scripts\Activate

# Instale as dependências (se houver requirements.txt)
pip install django

# Execute o servidor
python manage.py runserver
```

### 2. Frontend (Angular)

```bash
# Entre na pasta do frontend
cd frontend-pessoa

# Instale as dependências
npm install

# Execute o servidor de desenvolvimento
ng serve
```

Acesse a aplicação em: `http://localhost:4200`

## 🗺️ Roadmap de Desenvolvimento

- [x] Configuração do Ambiente Python
- [x] Estrutura do Backend (Django)
- [x] Lógica de Negócio (Cálculo Peso Ideal)
- [x] Configuração do Ambiente Node.js/Angular
- [ ] Integração Frontend-Backend (Service)
- [ ] Implementação das Telas (CRUD)
- [ ] Estilização com Tailwind CSS
