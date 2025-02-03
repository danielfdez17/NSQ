//
// Bases de datos NoSQL (24/25)
// Práctica 2
//
// Rellena en cada función con la instrucción o instrucciones que resuelven
// el correspondiente apartado.
//

function ejercicio1() {
  return db.libros.find({ opiniones: { $exists: false }, precio: { $gt: 12 } });
}

function ejercicio2() {
  return db.libros.find({ precio: { $type: "string" } }).count();
}

function ejercicio3() {
  return db.libros.find({ "opiniones.usuario": { $nin: ["bertoldo"] } });
}

function ejercicio4() {
  return db.libros.find({ genero: { $all: ["romance", "terror"] } });
}

function ejercicio5() {
  return db.libros.countDocuments({
    genero: { $all: ["romance"], $nin: ["terror"] },
  });
}

function ejercicio6() {
  return db.libros.find({ "opiniones.0.puntos": { $gt: 5 } }).count();
}

function ejercicio7() {
  return db.libros.find({
    $or: [{ "opiniones.usuario": "herminia" }, { precio: { $lt: 10 } }],
  });
}

function ejercicio8() {
  return db.libros.find(
    {
      "opiniones.2": { $exists: true },
    },
    {
      opiniones: { $slice: [2, 1] },
      titulo: 1,
      _id: 0,
    }
  );
}

function ejercicio9() {
  return db.libros.find(
    {
      genero: "romance",
      opiniones: {
        $elemMatch: {
          usuario: "bertoldo",
          puntos: { $gte: 8 },
        },
      },
    },
    {
      titulo: 1,
      _id: 0,
    }
  );
}

function ejercicio10() {
  return db.libros.find(
    {
      $expr: {
        $gte: [{ $subtract: ["$edicion.actual.year", "$edicion.primera"] }, 10],
      },
    },
    {
      titulo: 1,
      _id: 0,
    }
  );
}
