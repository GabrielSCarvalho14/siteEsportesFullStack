# Site Full Stack de Esportes

Esse projeto pessoal eu criei durante o curso gratuito "Desenvolvimento Web" da RocketSeat, onde nele eu criei um site onde pode colocar os esportes urbanos que o usuário conheça ou goste. As tecnologias utilizadas foram HTML, CSS, Javascript no Front-end e Node.js para o Back-end.

## 🚀 Guia de Instalação e Execução

Este projeto é um servidor web simples construído com Node.js, Express e SQLite.

### 1. Pré-requisitos

Certifique-se de que o **Node.js** e o **npm** (Gerenciador de Pacotes do Node.js) estão instalados em sua máquina.

* **Verificação:** Você pode verificar as versões instaladas com os comandos:
    ```bash
    node -v
    npm -v
    ```
* **Download:** Se você precisar instalar o Node.js, baixe o instalador (versão LTS recomendada) no site oficial: https://nodejs.org/pt/download
    

### 2. Instalação das Dependências

Na raiz do projeto (onde está o arquivo `server.js`), abra o terminal e execute o comando para instalar todos os pacotes necessários:

```bash
npm install express sqlite3 nunjucks multer
```

### 3.  Execução do Servidor

Com as dependências instaladas, utilize o comando abaixo para iniciar o servidor:

```bash
node server.js
```

O servidor será iniciado e você poderá acessá-lo no seu navegador através do endereço:
http://localhost:3000