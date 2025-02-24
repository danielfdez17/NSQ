//
// Bases de datos NoSQL (24/25)
// Práctica 5
//
// Haz que cada función devuelva el resultado indicado
// en el enunciado para el apartado correspondiente.
//

function ejercicio1() {
  return db.feed
    .aggregate(
      {
        $match: { type: "submissions", "data.judgement_type_id": "AC" },
      },
      {
        $group: {
          _id: "$data.problem_id",
          total: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: null,
          arrayForm: { $push: { k: "$_id", v: "$total" } },
        },
      },
      {
        $replaceRoot: { newRoot: { $arrayToObject: "$arrayForm" } },
      }
    )
    .next();
}

function ejercicio2() {
  return db.feed
    .aggregate([
      { $match: { type: "problems" } },
      { $project: { _id: 0, name: "$data.name" } },
      { $sort: { name: 1 } },
    ])
    .toArray()
    .map((doc) => doc.name);
}

function ejercicio3(team_name) {
  return db.feed
    .aggregate([
      // join por team_id
      {
        $lookup: {
          from: "feed",
          localField: "id",
          foreignField: "data.team_id",
          as: "submissions",
        },
      },
      // filtrar para el nombre que queremos
      {
        $match: {
          type: "teams",
          "data.display_name": team_name,
        },
      },
      {
        $unwind: "$submissions",
      },
      {
        $match: {
          "submissions.type": "submissions",
        },
      },
      {
        $sort: {
          "submissions.data.time": 1,
        },
      },
      {
        $limit: 1,
      },
      {
        $project: {
          _id: 0,
          primer_envio: "$submissions.data.time",
        },
      },
    ])
    .toArray()[0].primer_envio;
}

// La respuesta no tiene el tipo esperado.

// Respuesta:

// AggregationCursor

// Esperado: PRUEBA ESO

// Array
function ejercicio4() {
  const aggResult = db.feed
    .aggregate([
      { $match: { type: "submissions" } },
      {
        $project: {
          hour: {
            // Extraemos la subcadena HH del campo data.time
            $toInt: { $substr: ["$data.time", 11, 2] },
          },
        },
      },
      {
        $group: {
          _id: "$hour",
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$count" },
          data: {
            // data será un array de objetos como [{h: 0, c: 5}, {h: 1, c: 2}, ...]
            $push: {
              h: "$_id",
              c: "$count",
            },
          },
        },
      },
    ])
    .toArray();

  // Si no hay resultados (no hay submissions), devolvemos un array de 24 ceros
  if (aggResult.length === 0) {
    return new Array(24).fill(0);
  }

  // 2) Tomamos el primer (y único) documento que nos devolvió el pipeline
  const { total, data } = aggResult[0];
  // Por ejemplo, total = 50, data = [{h:0, c:3}, {h:5, c:10}, ...]

  // 3) Declaramos un array de 24 posiciones, inicializado a 0
  const countsByHour = new Array(24).fill(0);

  // 4) Rellenamos countsByHour con los conteos
  //    Cada objeto data[i] tiene { h: <hora>, c: <count> }
  data.forEach(({ h, c }) => {
    countsByHour[h] = c; // pon el conteo en esa posición
  });

  // 5) Convertimos los conteos en porcentajes
  //    porcentaje = (conteo / total) * 100
  const percentages = countsByHour.map((count) => {
    return (count / total) * 100;
  });

  // 6) Devolvemos el array de porcentajes, que tendrá siempre 24 elementos
  return percentages;
}

function ejercicio5(problem_name) {
  return db.feed
    .aggregate([
      // join por problem_id
      {
        $lookup: {
          from: "feed",
          localField: "id",
          foreignField: "data.problem_id",
          as: "submissions",
        },
      },
      {
        $match: {
          type: "problems",
          "data.name": problem_name,
        },
      },
      {
        $unwind: "$submissions",
      },
      {
        $match: {
          "submissions.type": "submissions",
        },
      },
      {
        $sort: {
          "submissions.data.time": 1,
        },
      },
      {
        $limit: 1,
      },
      // join por display_name
      {
        $lookup: {
          from: "feed",
          localField: "submissions.data.team_id",
          foreignField: "id",
          as: "team",
        },
      },
      {
        $unwind: "$team",
      },
      {
        $project: {
          _id: 0,
          equipo: "$team.data.display_name",
        },
      },
    ])
    .toArray()[0].equipo; // Extrae directamente el nombre del equipo
}

// Respuesta incorrecta en 0._id.

// Respuesta:

// isaper

// Esperado:

// anafer
function ejercicio6() {
  const pipeline = [
    // 1) Solo submissions con AC
    { $match: { type: "submissions", "data.judgement_type_id": "AC" } },

    // 2) Convertimos "data.time" a Date real
    {
      $addFields: {
        parsedTime: { $dateFromString: { dateString: "$data.time" } },
      },
    },

    // 3) Ordenamos por fecha ascendente (de verdad)
    { $sort: { parsedTime: 1 } },

    // 4) Agrupamos por team_id para quedarnos con el primer problema AC
    {
      $group: {
        _id: "$data.team_id",
        first_problem: { $first: "$data.problem_id" },
      },
      // necesitamos el primer equipo que resolvio el problema por primera vez
    },

    // 5) Hacemos lookup para traer el documento del problema
    {
      $lookup: {
        from: "feed",
        localField: "first_problem",
        foreignField: "id",
        as: "problem",
      },
    },
    { $unwind: "$problem" },

    // 6) Proyectamos el nombre completo del problema
    {
      $project: {
        _id: 1, // el team_id
        problema: "$problem.data.name",
      },
    },

    // 7) *** Ordenamos por _id (team_id) para fijar el orden final ***
    { $sort: { _id: 1 } },
  ];

  // Devuelve el array final
  return db.feed.aggregate(pipeline);
}

// Ejercicio 4
// Respuesta incorrecta en 0.

// Respuesta:

// 8

// Esperado:
// en el cuatro me ha dicho que declaremos un array de 24 posiciones y que lo rellenemos con los dato sde la consulta
// 0
// solo falta el 4, rapido, que va a cerrar el juez, TIC TAC

// Ejercicio 6
// La respuesta no tiene el tipo esperado.

// Respuesta:

// Array

// Esperado:

// AggregationCursor HAHAHA
