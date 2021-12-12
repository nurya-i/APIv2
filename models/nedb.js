const Datastore = require("nedb");
let db = {};
db.users = new Datastore("users.db");
//db.disciplinas = new Datastore("disciplinas.db");
db.users.loadDatabase();
//db.disciplinas.loadDatabase();

// Ativa um utilizador (faz um Update)
exports.crUd_activate = (confirmationToken) => {
  db.users.update(
    {
      confirmationToken: confirmationToken,
    },
    {
      $set: {
        confirm: 1,
      },
    },
    {},
    function (err, nRecords) {
      console.log("Records updated:" + nRecords);
    }
  );
};

// Retorna o utilizador e sua password encriptada
exports.cRud_login = (email) => {
  return new Promise((resolve, reject) => {
    // busca os registos que contêm a chave
    db.users.findOne(
      {
        _id: email,
      },
      (err, user) => {
        if (err) {
          reject({ msg: "Database issue!" });
        } else {
          if (user == null) {
            reject({ msg: "User does not exist!" });
          } else if (user.confirm != 1) {
            reject({ msg: "Pending activation - please verify your email." });
          } else {
            resolve(user);
          }
        }
      }
    );
  });
};

exports.Crud_register = (email, password, confirmationToken) => {
  // insere um novo utilizador
  return new Promise((resolve, reject) => {
    data = {
      _id: email,
      confirm: 0,
      password: password,
      confirmationToken: confirmationToken,
    };
    db.users.insert(data, (err, dados) => {
      if (err) {
        reject(null);
      } else {
        resolve(dados);
      }
    });
  });
};

/*exports.Crud = (data) => {
  // insere um registo
  db.disciplinas.insert(data);
  console.log(JSON.stringify(data));
};

exports.cRud_all = () => {
  return new Promise((resolve, reject) => {
    // lê todos os registos
    db.disciplinas.find({}, (err, dados) => {
      if (err) {
        reject("Não há disciplinas para mostrar!");
      } else {
        resolve(dados);
      }
    });
  });
};

exports.cRud_id = (id) => {
  return new Promise((resolve, reject) => {
    // busca os registos que contêm a chave
    db.disciplinas.find(
      {
        _id: id,
      },
      (err, dados) => {
        if (err) {
          reject("Disciplina com o id " + id + " não encontrada!");
        } else {
          resolve(dados);
        }
      }
    );
  });
};

exports.cRud_key = (criteria) => {
  return new Promise((resolve, reject) => {
    // busca os registos que contêm a chave
    db.disciplinas.find(
      {
        $or: [
          {
            disciplina: new RegExp(criteria), // RegExp é para usar como expressão regular /criterio/
          },
          {
            docente: new RegExp(criteria),
          },
          {
            curso: new RegExp(criteria),
          },
          {
            ano: Number(criteria),
          },
        ],
      },
      (err, dados) => {
        if (err || Object.keys(dados).length == 0) {
          reject("Não posso mostrar disciplinas!");
        } else {
          resolve(dados);
        }
      }
    );
  });
};*/