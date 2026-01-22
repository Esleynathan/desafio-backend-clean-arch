# Sistema de Gestão de Pessoas (Fullstack)

Este projeto é uma solução completa para o gerenciamento de cadastro de pessoas, desenvolvida como parte de um processo seletivo. A aplicação segue uma arquitetura robusta e moderna, separando claramente as responsabilidades entre Backend (Django) e Frontend (Angular).

## 🌟 Funcionalidades

- **CRUD Completo:** Criação, Leitura, Atualização e Exclusão de registros de pessoas.
- **Pesquisa Avançada:** Filtragem combinada por nome e sexo.
- **Paginação:** Navegação eficiente entre grandes volumes de dados.
- **Cálculo de Peso Ideal:** Funcionalidade bônus que calcula o peso ideal baseado na altura e sexo.
- **Interface Responsiva:** Design moderno e adaptável utilizando Tailwind CSS.
- **Feedback ao Usuário:** Notificações (Toasts) e Modais para confirmações e erros.

## 🚀 Tecnologias Utilizadas

### Backend (API)
- **Linguagem:** Python 3.10+
- **Framework:** Django & Django REST Framework
- **Banco de Dados:** PostgreSQL (Configurável via .env)
- **Arquitetura:** Camadas (View -> Service -> Task -> Model) com DTOs.

### Frontend (Client)
- **Framework:** Angular (v17+)
- **Estilização:** Tailwind CSS
- **Comunicação:** HTTP Client (RxJS)

### Infraestrutura
- **Containerização:** Docker & Docker Compose
- **Proxy Reverso:** Traefik (SSL automático via Let's Encrypt)
- **Deploy:** Digital Ocean Droplet

## 📋 Pré-requisitos

### Para Desenvolvimento Local
- Python (3.10 ou superior)
- Node.js (v20 LTS ou superior)
- Angular CLI (`npm install -g @angular/cli`)
- PostgreSQL

### Para Deploy com Docker
- Docker & Docker Compose
- Traefik configurado no servidor

## 🔧 Instalação e Configuração

Siga os passos abaixo para configurar e executar o projeto em seu ambiente local.

### 1. Backend (Django)

1.  **Clone o repositório e acesse a pasta do projeto:**
    ```bash
    git clone https://github.com/Esleynathan/desafio-backend-clean-arch.git
    cd projeto
    ```

2.  **Crie e ative o ambiente virtual (recomendado):**
    *   **Windows:**
        ```bash
        python -m venv venv
        .\venv\Scripts\Activate
        ```
    *   **Linux/Mac:**
        ```bash
        python3 -m venv venv
        source venv/bin/activate
        ```

3.  **Instale as dependências do projeto:**
    O projeto possui um arquivo `requirements.txt` com todas as bibliotecas necessárias.
    ```bash
    pip install -r requirements.txt
    ```

4.  **Configure o Banco de Dados (PostgreSQL):**

    O projeto utiliza PostgreSQL como banco de dados. Siga os passos abaixo:

    **a) Instale o PostgreSQL** (caso ainda não tenha):
    - **Windows:** Baixe em [postgresql.org/download/windows](https://www.postgresql.org/download/windows/)
    - **Linux (Ubuntu/Debian):** `sudo apt install postgresql postgresql-contrib`
    - **Mac:** `brew install postgresql`

    **b) Acesse o PostgreSQL e crie o banco de dados:**
    ```bash
    # Acesse o terminal do PostgreSQL
    psql -U postgres

    # Crie o usuário (se necessário)
    CREATE USER admin WITH PASSWORD 'admin';

    # Crie o banco de dados
    CREATE DATABASE pessoa_db OWNER admin;

    # Conceda permissões
    GRANT ALL PRIVILEGES ON DATABASE pessoa_db TO admin;

    # Saia do psql
    \q
    ```

    **c) Configure as variáveis de ambiente (opcional):**

    O projeto já possui valores padrão, mas você pode personalizá-los criando um arquivo `.env` na pasta `core/`:
    ```env
    DB_NAME=pessoa_db
    DB_USER=admin
    DB_PASSWORD=admin
    DB_HOST=localhost
    DB_PORT=5432
    ```

    **d) Execute as migrações para criar as tabelas:**
    ```bash
    python manage.py migrate
    ```

5.  **Popular o Banco de Dados (Opcional):**
    Para facilitar os testes, você pode inserir dados iniciais de duas formas:
    
    *   **Opção A - Via Script Automatizado:** Execute o script na raiz do projeto para criar registros fictícios.
        ```bash
        python populate_db.py
        ```
    *   **Opção B - Via Aplicação:** Utilize o formulário de cadastro na interface web após iniciar o sistema.

6.  **Inicie o Servidor Backend:**
    ```bash
    python manage.py runserver
    ```
    O backend estará rodando em `http://localhost:8000`.

### 2. Frontend (Angular)

1.  **Abra um novo terminal e acesse a pasta do frontend:**
    ```bash
    cd frontend-pessoa
    ```

2.  **Instale as dependências do Node:**
    ```bash
    npm install
    ```

3.  **Inicie o servidor de desenvolvimento:**
    ```bash
    ng serve
    ```
    Acesse a aplicação em seu navegador através de `http://localhost:4200`.

## 📚 Documentação da API

A API REST oferece os seguintes endpoints principais para integração:

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `GET` | `/api/pessoas/` | Lista pessoas (suporta paginação `?page=1` e filtros `?search=nome&sexo=M`) |
| `POST` | `/api/pessoas/` | Cadastra uma nova pessoa |
| `GET` | `/api/pessoas/{id}/` | Obtém detalhes de uma pessoa específica |
| `PUT` | `/api/pessoas/{id}/` | Atualiza os dados de uma pessoa |
| `DELETE` | `/api/pessoas/{id}/` | Remove uma pessoa do cadastro |
| `GET` | `/api/pessoas/{id}/peso-ideal/` | Calcula o peso ideal da pessoa |

## 🏗️ Arquitetura do Projeto

```mermaid
flowchart TD
    Client(Frontend Angular) -->|JSON| View(Controller / View)
    subgraph Django Backend
        View -->|Data| Serializer(Serializer)
        Serializer -->|Dict| DTO(DTO)
        DTO -->|Object| Service(Service Layer)
        Service -->|Business Logic| Task(Task Layer)
        Task -->|ORM| Model(Model)
    end
    Model -->|SQL| DB[(Database)]
```

O backend foi desenhado para ser escalável, testável e organizado, seguindo o fluxo:

1.  **Controller (Views):** Recebe a requisição HTTP e valida os dados de entrada.
2.  **Serializer:** Valida os dados da API e converte para formatos Python.
3.  **DTO:** Objeto de transferência interno que isola a regra de negócio do framework web.
4.  **Service:** Orquestra a lógica de negócio e comunica-se com as Tasks.
5.  **Task:** Executa operações atômicas e acesso ao banco de dados.
6.  **Model:** Representação das tabelas no banco de dados (ORM).

---

## 🐳 Deploy com Docker

O projeto está configurado para deploy em produção usando Docker e Traefik.

### Arquitetura de Produção

```
Internet → Traefik (SSL automático)
              └── desafio-gestaopessoas.esleynathan.com.br → backend:8001
```

### Arquivos Docker

| Arquivo | Descrição |
| :--- | :--- |
| `Dockerfile` | Multi-stage build: compila Angular + serve com Django/Gunicorn |
| `docker-compose.yml` | Orquestra PostgreSQL + Backend com labels Traefik |
| `entrypoint.sh` | Aguarda DB, roda migrations, inicia Gunicorn |
| `.dockerignore` | Exclui arquivos desnecessários do build |

### Deploy no Servidor

1. **Configure o DNS:**
   - Crie um registro A apontando para o IP do servidor

2. **Clone e suba os containers:**
   ```bash
   git clone https://github.com/Esleynathan/desafio-backend-clean-arch.git
   cd projeto
   docker-compose up -d --build
   ```

3. **Verifique os logs:**
   ```bash
   docker-compose logs -f backend-pessoas
   ```

O Traefik cuida automaticamente do SSL via Let's Encrypt.

---

## 🗺️ Status do Desenvolvimento

- [x] Configuração do Ambiente
- [x] Backend (Django REST Framework)
- [x] Frontend (Angular + Tailwind)
- [x] Funcionalidade de Peso Ideal
- [x] Paginação e Filtros
- [x] Documentação Completa
- [x] Dockerização para Produção

---
Desenvolvido para avaliação técnica.
