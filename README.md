# Servidor de Arquivos Seguro

Este é um backend simples, seguro e otimizado em Node.js com TypeScript para gerenciamento de arquivos, com autenticação via token e persistência de dados com Docker.

## Requisitos

- Node.js (v18+)
- Docker (opcional, para deploy)

## Configuração

1.  **Clone o repositório:**
    ```bash
    git clone <url-do-repositorio>
    cd Mycloud
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure o Token de API:**
    Crie um arquivo `.env` na raiz do projeto e adicione seu token secreto:
    ```
    API_TOKEN=seu-token-super-secreto-aqui
    ```

## Como Executar

### Modo de Desenvolvimento

Para rodar o servidor em modo de desenvolvimento com hot-reload:

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3000`.

### Modo de Produção (Local)

Para buildar e rodar a versão otimizada em JavaScript:

```bash
npm run build
npm start
```

## Como Usar com Docker

O Dockerfile está configurado para buildar e rodar a aplicação em um container, garantindo a persistência dos arquivos na pasta `/uploads`.

1.  **Build da Imagem Docker:**

    ```bash
    docker build -t secure-file-server .
    ```

2.  **Executar o Container com Volume:**

    Para garantir que os arquivos em `/uploads` não sejam perdidos, você deve mapear a pasta `/uploads` do container para uma pasta na sua máquina local (host).

    Substitua `"$(pwd)/persistent_uploads"` pelo caminho absoluto da pasta que você quer usar para armazenar os arquivos na sua máquina.

    ```bash
    docker run -d -p 3000:3000 --name my-secure-server -v "$(pwd)/persistent_uploads":/uploads -e API_TOKEN=seu-token-super-secreto-aqui secure-file-server
    ```
    **Atenção:** É crucial passar a variável de ambiente `API_TOKEN` no comando `docker run`.

## Endpoints da API

**Autenticação:** Todas as rotas exigem o header `Authorization: Bearer <SEU_TOKEN>`.

-   **`POST /folder`**: Cria uma nova pasta.
    -   **Corpo:** `{ "name": "nome-da-pasta" }`

-   **`POST /upload/:folder`**: Faz upload de arquivos para uma pasta existente.
    -   **Parâmetro de URL:** `:folder` - O nome da pasta de destino.
    -   **Corpo:** `multipart/form-data` com o campo `files` contendo um ou mais arquivos.

-   **`GET /files/:folder/:filename`**: Faz o download de um arquivo.
    -   **Parâmetros de URL:** `:folder` e `:filename`.

-   **`DELETE /files/:folder/:filename`**: Deleta um arquivo.
    -   **Parâmetros de URL:** `:folder` e `:filename`.
