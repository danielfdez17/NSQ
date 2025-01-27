//
// Bases de datos NoSQL (24/25)
// Práctica 1
//
// Rellena en cada función con la instrucción o instrucciones que resuelven
// el correspondiente apartado.
//

function ejercicio1() {
  return db.comments.find().skip(100).limit(1);
}

function ejercicio2() {
  return db.comments.find({ "author.name": "Pedro Cánovas" }).count();
}

function ejercicio3() {
  return db.comments
    .find({ "_id.thread": "10434005174", "_id.id": "6631242158" })
    .projection({ "autor.name": 1, _id: 0 });
}

function ejercicio4() {
  return db.comments.find({ sentiment: "joy" }).count();
}

function ejercicio5() {
  db.user.drop();
  db.comments.find({ "author.name": "Artemisa J" }).forEach((doc) => {
    db.user.insertOne(doc);
  });
  return db.user.countDocuments();
}

function ejercicio6() {
  // .count() no se puede usar, error: is not a function
  const totalUsuarios = db.comments.distinct("author.name").length;
  const searchDocument = db.comments.distinct("author.name", {
    likes: { $gt: 0 },
  }).length;
  return (searchDocument / totalUsuarios) * 100;
}

function ejercicio7() {
  // No hace falta agregar projection
  return db.comments.distinct("threadTitle");
}

function ejercicio8() {
  db.pru.drop();
  db.pru.insertMany([
    { a: 1, b: 1 },
    { a: 1, b: 2 },
    { a: 2, b: 1 },
    { a: 2, b: 2 },
    { a: 3, b: 1 },
    { a: 3, b: 2 },
  ]);
  return db.pru.find().projection({ _id: 0 }).sort({ b: 1, a: -1 });
}

function ejercicio9() {
  return db.comments
    .find({ dislikes: 0 })
    .projection({ raw_message: 1, _id: 0 })
    .sort({ likes: -1 })
    .limit(1)
    .toArray()[0].raw_message;
}

function ejercicio10() {
  // Slice permite extraer una porción de un array, empezamos por -2 para empezar de derecha a izquierda
  db.pru2.drop();
  db.pru2.insertOne({ a: [10, 20, 30, 40, 50] });
  return db.pru2.find({}, { a: { $slice: -2 }, _id: 0 });
}
