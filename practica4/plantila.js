//
// Bases de datos NoSQL (24/25)
// Práctica 4
//
// Haz que cada función evalúe la consulta del correspondiente
// apartado y devuelva el resultado.

function ejercicio1() {
  return db.presupuesto
    .aggregate({
      $group: { _id: null, media: { $avg: "$cuantia.inicial" } },
    })
    .toArray()[0].media;
}

function ejercicio2() {
  return db.presupuesto.aggregate([
    {
      $group: {
        _id: "$centro_presupuestario.nombre",
        inicial: { $sum: "$cuantia.inicial" },
        actual: { $sum: "$cuantia.actual" },
      },
    },
  ]);
}

function ejercicio3() {
  return db.presupuesto.aggregate([
    //El floor redond
    {
      $group: {
        _id: { $floor: { $divide: ["$subconcepto.id", 10000] } },
        inicial: { $sum: "$cuantia.inicial" },
        actual: { $sum: "$cuantia.actual" },
      },
    },
    { $sort: { _id: 1 } },
  ]);
}

function ejercicio4() {
  return db.presupuesto.aggregate([
    {
      $group: {
        _id: [
          "$centro_presupuestario.nombre",
          { $floor: { $divide: ["$subconcepto.id", 10000] } },
        ],
        inicial: { $sum: "$cuantia.inicial" },
        actual: { $sum: "$cuantia.actual" },
      },
    },
    { $sort: { "_id.0": 1, "_id.1": 1 } }, // Ordena primero por centro y luego por capítulo
  ]);
}
function ejercicio5() {
  return db.presupuesto
    .aggregate([
      {
        $match: {
          "subconcepto.nombre": { $regex: "COMPLUTENSE" },
        },
      },
      {
        $group: {
          _id: null,
          max_actual: { $max: "$cuantia.actual" },
        },
      }
    ])
    .toArray()[0].max_actual;
}

function ejercicio6() {
  return db.presupuesto.aggregate([
    { $unwind: "$ejecucion" }, //Unwind permite transformar un array en Object
    {
      $group: {
        _id: "$ejecucion.mes",
        gasto: { $sum: "$ejecucion.dispuesto" },
      },
    }, //Como lo hemos unwindeado podemos acceder a la propiedad
    { $sort: { gasto: -1 } },
  ]);
}

function ejercicio7() {
  return db.presupuesto.aggregate([
    {
      $bucket: {
        //Bucket agrupa segun el boundaries
        groupBy: "$cuantia.inicial",
        boundaries: [0, 10000, 1000000, 10000000, 1000000000],
        default: ">10^9",
        output: { numero: { $sum: 1 } },
      },
    },
  ]);
}

function ejercicio8() {
  return db.presupuesto.aggregate([
    {
      $group: {
        _id: {
          id: "$programa.id",
          nombre: "$programa.nombre",
        },
        cuantia_inicial: { $sum: "$cuantia.inicial" },
        cuantia_autorizado: { $sum: "$cuantia.autorizado" },
      },
    },
    {
      $project: {
        programa: "$_id", // Usamos directamente `_id` que ya tiene id y nombre
        gastado: {
          $multiply: [
            {
              $cond: [
                { $gt: ["$cuantia_inicial", 0] },
                { $divide: ["$cuantia_autorizado", "$cuantia_inicial"] },
                0,
              ],
            },
            100,
          ],
        },
      },
    },
    { $sort: { gastado: 1 } }, // Ordena por menor porcentaje de gasto
    { $limit: 5 }, // Obtiene los 5 con menor gasto
    {
      $project: {
        _id: 0, // Eliminamos `_id`
        programa: 1,
        gastado: { $round: ["$gastado", 2] }, // Redondea a 2 decimales
      },
    },
  ]);
}
