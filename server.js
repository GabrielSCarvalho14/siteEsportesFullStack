// Express foi usado para criar o servidor
const express = require('express')
const server = express()
const db = require("./db") // O db.js agora só exporta a instância do banco de dados
const multer = require('multer')
const path = require('path')

// Configurar armazenamento do Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {

        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

// Inicializa o Multer com a configuração de armazenamento
const upload = multer({ storage: storage })

// Configurar arquivos estáticos
server.use(express.static("public"))

// Habilitar uso do req.body
server.use(express.urlencoded({ extended: true }))

// Configuração do Nunjucks
const nunjucks = require('nunjucks')
nunjucks.configure("views", {
    express: server,
    noCache: true,
})

// Inicialização do banco de dados
db.serialize(function () {
    db.run(`
        CREATE TABLE IF NOT EXISTS esportes(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            imagem TEXT,
            titulo TEXT,
            categoria TEXT,
            descricao TEXT
        );
    `);

    // Inserir dados padrão se a tabela estiver vazia
    db.get(`SELECT COUNT(*) AS count FROM esportes`, function (err, row) {
        if (err) {
            console.error("Erro ao verificar o número de registros:", err);
            return;
        }

        if (row.count === 0) { // Se não houver registros, insere os dados padrão
            const query = `
                INSERT INTO esportes(
                    imagem,
                    titulo,
                    categoria,
                    descricao
                ) VALUES (?, ?, ?, ?);
            `;

            const values = [
                "https://cdn-icons-png.flaticon.com/128/4689/4689248.png",
                "Basquete",
                "Em Quadra (Espaço Fechado ou Aberto)",
                "O basquete é um desporto coletivo jogado por duas equipas de cinco jogadores. O objetivo principal é marcar pontos arremessando uma bola através de uma cesta elevada (o cesto) do adversário, enquanto se impede que a equipa adversária faça o mesmo."
            ];

            db.run(query, values, function (err) {
                if (err) {
                    console.error("Erro ao inserir dados padrão:", err);
                }
            });
        }
    });
});

// Criação das rotas
server.get("/", function (req, res) {
    db.all(`SELECT * FROM esportes`, function (err, rows) {
        if (err) {
            console.log(err)
            return res.send("Erro no banco de dados!")
        }

        const esportesInvertidos = [...rows].reverse()
        let ultimosEsportes = []
        for (let esporte of esportesInvertidos) {
            if (ultimosEsportes.length < 3) {
                ultimosEsportes.push(esporte)
            }
        }
        return res.render("index.html", { esportes: ultimosEsportes })
    })
})

server.get("/esportes", function (req, res) {
    db.all(`SELECT * FROM esportes`, function (err, rows) {
        if (err) {
            console.log(err)
            return res.send("Erro no banco de dados!")
        }
        const esportesInvertidos = [...rows].reverse()
        return res.render("todosEsportes.html", { esportes: esportesInvertidos })
    })

})

server.post("/", upload.single('imagem'), function (req, res) {
    // Verificando se a imagem foi enviada
    if (!req.file) {
        console.log("Nenhum arquivo de imagem foi enviado.")
        return res.send("Erro: Nenhum arquivo de imagem foi selecionado.")
    }
    // inserir dados na tabela
    const query = `
        INSERT INTO esportes(
            imagem,
            titulo,
            categoria,
            descricao
        ) VALUES (?, ?, ?, ?);
    `

    const caminhoImagem = `/uploads/${req.file.filename}`

    const values = [
        caminhoImagem,
        req.body.titulo,
        req.body.categoria,
        req.body.descricao
    ]

    db.run(query, values, function (err) {
        if (err) {
            console.log(err)
            return res.send("Erro no banco de dados!")
        }

        return res.redirect("/esportes")
    })

})

server.post("/esporte/delete", function(req, res) {
    const id = req.body.id;
    const referer = req.headers.referer || "/";

    if (!id) {
        console.log("ID do esporte não fornecido para exclusão.");
        return res.send("Erro: ID do esporte não fornecido.");
    }

    db.run(`DELETE FROM esportes WHERE id = ?`, [id], function(err) {
        if (err) {
            console.error("Erro ao deletar o esporte:", err);
            return res.send("Erro ao deletar o esporte no banco de dados!");
        }
        console.log(`Esporte com ID ${id} deletado com sucesso!`);
        // Redireciona de volta para a página que originou a requisição
        return res.redirect(referer); 
    });
});

// Porta do servidor
server.listen(3000)