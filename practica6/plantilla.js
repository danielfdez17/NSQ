//
// Bases de datos NoSQL (24/25)
// Práctica 6
//
// Haz que cada función devuelva el resultado indicado
// en el enunciado para el apartado correspondiente.
//

// db.lugares.insertMany([
//   {
//     nombre: "Informática-UCM",
//     tipo: "facultad",
//     pais: "España",
//     posicion: { type: "Point", coordinates: [-3.7353797, 40.450305] },
//   },
//   {
//     nombre: "Metropolitano",
//     tipo: "metro",
//     pais: "España",
//     posicion: { type: "Point", coordinates: [-3.7202654, 40.4465915] },
//   },
//   {
//     nombre: "Ciudad Universitaria",
//     tipo: "metro",
//     pais: "España",
//     posicion: { type: "Point", coordinates: [-3.7289768, 40.4435602] },
//   },
//   {
//     nombre: "Pabellón de Plata",
//     tipo: "templo",
//     pais: "Japón",
//     posicion: { type: "Point", coordinates: [135.7982058, 35.0270213] },
//   },
//   {
//     nombre: "María Zambrano",
//     tipo: "biblioteca",
//     pais: "España",
//     posicion: { type: "Point", coordinates: [-3.733006, 40.449405] },
//   },
// ]);

function ejercicio1() {
  db.lugares.insertOne({
    nombre: "María Zambrano",
    tipo: "biblioteca",
    pais: "España",
    posicion: {
      type: "Point",
      coordinates: [-3.733006, 40.449405],
    },
  });
  db.lugares.createIndex({ posicion: "2dsphere" });
}

function ejercicio2() {
  return db.lugares.find(
    {
      posicion: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [-3.7251149, 40.4381963],
          },
          $minDistance: 1500,
        },
      },
    },
    { nombre: 1, tipo: 1, _id: 0 }
  );
}

function ejercicio3(team_name) {
  db.plano.createIndex({ punto: 1 }, { name: "ipunto" });
  db.plano.createIndex({ desc: 1 }, { name: "idesc" });

  // Instrucciones (no copies la creación de la colección plano):
  // Respuesta a la pregunta:
  // db.plano.stats();
  // indexSizes: { _id_: 491520, ipunto: 446464, idesc: 421888 }
  // El indice ipunto ocupa mas que idesc porque:
  /*
 	Lo más habitual es que el índice sobre desc (que es un texto con paréntesis, espacios, etc.) sea más grande que el de punto, 
	que contiene únicamente valores numéricos. 
	El índice de tipo string puede requerir más almacenamiento para guardar cada cadena y las referencias correspondientes, de ahí que ocupe más. 
  */
}

function ejercicio4() {
  return db.plano.countDocuments({ "punto.0": { $gt: 480 } });
}

function ejercicio5() {
  // Respuesta a la pregunta: Si, utilizara solo el ipunto
}

function ejercicio6() {
  return db.plano.find({
    punto: {
      $geoWithin: {
        $geometry: {
          type: "Polygon",
          coordinates: [
            [
              [0, 0],
              [3, 0],
              [3, 3],
              [0, 3],
              [0, 0],
            ],
          ],
        },
      },
    },
  });
}

function ejercicio7() {
  return db.plano.createIndex({ punto: "2d" });
}
function ejercicio8() {
  // Respuesta a la pregunta: aparentemente no. Da el error Index build failed: 6cb4e045-2c61-486c-b4f4-8c46b587c744: Collection lugares.plano ( a823cebb-57cb-4c18-8d24-09b2b48a27bd ) :: caused by :: collection scan stopped. totalRecords: 90; durationMillis: 0ms; phase: collection scan; collectionScanPosition: RecordId(90); readSource: kNoTimestamp :: caused by :: point not in interval of [ -180, 180 ] :: caused by :: { _id: ObjectId('67c5ba1991ea7146d9187f78'), dz
  // No se puede porque hay un punto que está fuera del rango [ -180, 180 ]
}

function ejercicio9() {
  // Explicación o instrucción de creación del índice
  return db.plano.createIndex({ punto: 1, desc: 1 }, { name: "ipunto_desc" });
}

function ejercicio10() {
  // * PROBADO/HECHO
  return db.lugares
    .aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [-3.7251149, 40.4381963],
          },
          key: "posicion",
          spherical: true,
          distanceField: "distancia",
          query: { nombre: "María Zambrano" }, // Se mueve el $match aquí
        },
      },
      {
        $project: {
          _id: 0,
          nombre: 1,
          distancia: 1,
        },
      },
    ])
    .toArray()[0].distancia;
}
