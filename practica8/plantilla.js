//
// Bases de datos NoSQL (24/25)
// Práctica 8
//
// Rellena cada apartado como indica el enunciado.
//

function ejercicio1() {
  // Comando para crear al usuario
  //use admin
  db.createUser({
    user: "G04", //TAIS114
    pwd: "password",
    roles: [
      { role: "userAdminAnyDatabase", db: "admin" },
      { role: "read", db: "admin" },
    ],
  });
  //Pasos:
  //mongosh --authenticationDatabase "admin" -u "G04" -p
  //use admin
  /*
     Una vez iniciado sesion con el usuario, si se puede ya que hemos agregado el rol read, que permite leer en la base de datos admin.
     En caso contrario no se podria.
  */
}

function ejercicio2() {
  // Comando para crear el rol
  //use buzon
  db.createRole({
    role: "remitente",
    privileges: [
      {
        resource: { db: "buzon", collection: "cartas" },
        actions: ["insert"]
      }
    ],
    roles: []
  });
  
  // Comando para crear el usuario
  db.createUser({
    user: "herminia",
    pwd: "herminia",
    roles: [{ role: "remitente", db: "buzon"}],
  });
  //mongosh --authenticationDatabase "buzon" -u "herminia" -p
  //use buzon
  /*
    db.cartas.insertOne({ a: "herminia", mensaje: "Herminia, eres la mejor" })
    db.cartas.insertOne({ a: "anselmo", mensaje: "No puedes ser más idiota" })
  */
}

function ejercicio3() {
  // Comando para crear el rol
  //use buzon
  db.createRole({
    role: "paje",
    privileges: [
      {
        resource: { db: "buzon", collection: "" },
        actions: ["remove", "createIndex"],
    },
],
    roles: [
        { role: "read", db: "buzon" },
        { role: "readWrite", db: "oficina" },
    ],
  });
  // Comando para crear el usuario
  //use oficina
  db.createUser({
    user: "bertoldo",
    pwd: "passBertoldo",
    roles: [
      { role: "paje", db: "buzon" },
    ],
  });
  // ¿Has podido borrar el mensaje de Herminia? Si, se ha podido borrar

  /*  
    Nos conectamos
    mongosh --authenticationDatabase "oficina" -u "bertoldo" -p 
    use buzon
    db.cartas.find()
    db.cartas.deleteOne({ a: "herminia", mensaje: "Herminia, eres la mejor" })
  */
}

function ejercicio4() {
  // Instrucción de creación del índice
  //use buzon
  db.cartas.createIndex({ caduca: 1 }, { expireAfterSeconds: 0 });
  db.cartas.insertOne({
    a: "bertoldo",
    mensaje: "Si tienes una carta para mí, estoy en el laboratorio 3",
    caduca: new Date("2025-03-17T16:00"),
  });
  // ¿Se ha borrado la clave en la fecha indicada?
}

function ejercicio5() {
  // Instrucción para ampliar privilegios
  //use admin
  db.grantRolesToUser("G04", [{ role: "readWriteAnyDatabase", db: "admin" }]);
  // Instrucción para reescribir los mensajes
  //use buzon
  db.cartas.updateMany({ mensaje: /idiota/ }, [
    {
      $set: {
        mensaje: {
          $replaceOne: {
            input: "$mensaje",
            find: "idiota",
            replacement: "encantador",
          }, // porque no hay juez para esta práctica
        },
      },
    },
  ]);
  db.cartas.find();
}

function ejercicio6() {
  // Comando
  mongodump --authenticationDatabase "admin" -u "G04" -p "password" \
          --db buzon \
          --out 'C:/datos'
}

function ejercicio7() {
  // Comando
  mongoexport --authenticationDatabase "admin" -u "G04" -p "password" \
            --db "admin" --collection "system.users" \
            --out "usuarios.json" --jsonArray
}
