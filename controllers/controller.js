require("dotenv").config();

const db = require("../models/nedb"); // Define o MODEL que vamos usar
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function authenticateToken(req, res) {
  console.log("Authorizing...");
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    console.log("Null token");
    return res.sendStatus(401);
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.email = user;
  });
}

const nodemailer = require("nodemailer");
const { response } = require("express");

// async..await não é permitido no contexto global
async function sendEmail(recipients, confirmationToken) {
  // Gera uma conta do serviço SMTP de email do domínio ethereal.email
  // Somente necessário na fase de testes e se não tiver uma conta real para utilizar
  let testAccount = await nodemailer.createTestAccount();

  // Cria um objeto transporter reutilizável que é um transporter SMTP
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true para 465, false para outras portas
    auth: {
      user: testAccount.user, // utilizador ethereal gerado
      pass: testAccount.pass, // senha do utilizador ethereal
    },
  });

  // envia o email usando o objeto de transporte definido
  let info = await transporter.sendMail({
    from: '"Scottish Lass" <scotlandisawesome@example.com>', // endereço do originador
    to: recipients, // lista de destinatários
    subject: "Verify your email ✔", // assunto
    text: "Click here to verify your account: " + confirmationToken, // corpo do email
    html: "<b>Click here to verify your account: " + confirmationToken + "</b>", // corpo do email em html
  });

  console.log("Message sent: %s", info.messageId);
  // Mensagem enviada: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // A pré-visualização só estará disponível se usar uma conta Ethereal para envio
  console.log(
    "URL for pre-visualization: %s",
    nodemailer.getTestMessageUrl(info)
  );
  // URL para visualização prévia: https://ethereal.email/message/WaQKMgKddxQDoou...
}

exports.verifyUser = async (req, res) => {
  const confirmationCode = req.params.confirmationCode;
  db.crUd_activate(confirmationCode);
  const reply = { message: "Active user! :D" };
  console.log(reply);
  return res.send(reply);
};

// REGISTAR - cria um novo utilizador
exports.register = async (req, res) => {
  console.log("Register a new user");
  if (!req.body) {
    return res.status(400).send({
      message: "Field cannot be empty!",
    });
  }
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(req.body.password, salt);
  const email = req.body.email;
  const password = hashPassword;
  const confirmationToken = jwt.sign(
    req.body.email,
    process.env.ACCESS_TOKEN_SECRET
  );
  const confirmURL = `http://localhost:${process.env.PORT}/api/auth/confirm/${confirmationToken}`
  db.Crud_register(email, password, confirmationToken) // C: Create
    .then((dados) => {
      sendEmail(email, confirmURL).catch(console.error);
      res.status(201).send({
        message:
          "User created succesfully, check your inbox to activate!",
      });
      console.log("Controller - registered user: ");
      console.log(JSON.stringify(dados)); // para debug
    })
    .catch((response) => {
      console.log("controller - register:");
      console.log(response);
      return res.status(400).send(response);
    });
};

// LOGIN - autentica um utilizador
exports.login = async (req, res) => {
  console.log("User authentication");
  if (!req.body) {
    return res.status(400).send({
      message: "Field cannot be empty!",
    });
  }
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);
  const email = req.body.email;
  const password = hashPassword;
  db.cRud_login(email) //
    .then(async (dados) => {
      if (await bcrypt.compare(req.body.password, dados.password)) {
        const user = { name: email };
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
        res.json({ accessToken: accessToken }); // aqui temos de enviar a token de autorização
        console.log("Database search: ");
        console.log(JSON.stringify(dados)); // para debug
      } else {
        console.log("Wrong password");
        return res.status(401).send({ erro: "The password is not correct!" });
      }
    })
    .catch((response) => {
      console.log("controller:");
      console.log(response);
      return res.status(400).send(response);
    });
};

// CREATE - cria um novo registo
exports.create = (req, res) => {
  console.log("Create");
  if (!req.body) {
    return res.status(400).send({
      message: "Field cannot be empty!",
    });
  }
  const data = req.body;
  db.Crud(data); // C: Create
  const resposta = { message: "New record created!" };
  console.log(resposta);
  return res.send(resposta);
};

/* Envia todas as disciplinas
exports.findAll = (req, res) => {
  authenticateToken(req, res);
  if (req.email != null) {
    // utilizador autenticado
    console.log(`FindAll - user: ${req.email.name}`);
    console.log("Mensagem de debug - listar disciplinas");
    db.cRud_all() // R: Read
      .then((dados) => {
        res.send(dados);
        // console.log("Dados: " + JSON.stringify(dados)); // para debug
      })
      .catch((err) => {
        return res
          .status(400)
          .send({ message: "Não há disciplinas para mostrar!" });
      });
  }
};

// READ one - busca um item pelo id
exports.findOne = async (req, res) => {
  authenticateToken(req, res);
  if (req.email != null) {
    // utilizador autenticado
    console.log("Find One by id");
    console.log("Parâmetro: " + req.params.id);
    //Deve implementar esta funcionalidade...
    const id = req.params.id.substr(1); // faz substring a partir do segundo carater
    db.cRud_id(id) // R: Read
      .then((dados) => {
        res.send(dados);
        // console.log("Dados: " + JSON.stringify(dados)); // para debug
      })
      .catch((err) => {
        return res
          .status(400)
          .send({ message: "Não há disciplinas para mostrar!" });
      });
  }
};

// READ key - busca os itens que contêm uma chave
exports.findKey = (req, res) => {
  authenticateToken(req, res);
  if (req.email != null) {
    // utilizador autenticado
    console.log("Find key");
    // Temos de eliminar o primeiro carater para obter a chave de pesquisa
    // O primeiro carater é o ":"
    const criteria = req.params.id.substr(1); // faz substring a partir do segundo carater
    console.log("Critério: " + criteria);
    db.cRud_key(criteria) // R: Read
      .then((dados) => {
        res.send(dados);
        // console.log("Dados: " + JSON.stringify(dados)); // para debug
      })
      .catch((err) => {
        return res.status(400).send({});
      });
  }
};*/

// UPDATE - atualiza o item com o id recebido
exports.update = (req, res) => {};

// DELETE one - elimina o item com o id recebido
exports.delete = (req, res) => {};

// DELETE all - elimina todos os itens
exports.deleteAll = (req, res) => {};
