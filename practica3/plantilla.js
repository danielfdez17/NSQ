//
// Bases de datos NoSQL (24/25)
// Práctica 3
//
// Haz que cada función evalúe la consulta del correspondiente
// apartado y devuelva el resultado.
//

function ejercicio1() {
  return db.log.updateMany(
    { country: "Francia" },
    { $set: { country: "España" } }
  );
}

function ejercicio2() {
  return db.log.updateOne(
    { _id: "Sinda" },
    {
      $push: {
        actions: {
          $each: [
            {
              action: "copy file",
              timestamp: "2018-05-24 15:03:21",
              duration: 8,
              success: true,
            },
          ],
          $position: 0,
        },
      },
    }
  );
}

function ejercicio3() {
  return db.log.updateOne(
    { _id: "Herminia" },
    { $set: { "actions.2.success": true, "actions.2.duration": 4 } }
  );
}

function ejercicio4() {
  return db.log.updateOne(
    { _id: "Herminia" },
    { $inc: { "actions.2.duration": 2 } }
  );
}

function ejercicio5() {
  return db.log.updateOne(
    { _id: "Bertoldo" },
    { $addToSet: { IP: "112.56.2.67" } }
  );
}

function ejercicio6() {
  return db.log.updateMany(
    {
      actions: { $elemMatch: { duration: { $gte: 10 }, success: false } },
    },
    {
      $set: { suspicius: true },
    }
  );
}

function ejercicio7() {
  return db.log.updateMany(
    {
      country: { $ne: "Bélgica" },
    },
    {
      $unset: { suspicius: "" },
    }
  );
}

function ejercicio8() {
  return db.log.deleteOne({
    _id: "Fabricio",
    actions: { $not: { $elemMatch: { success: { $exists: false } } } },
  });
}

function ejercicio9() {
  return db.log.updateMany(
    {
      "actions.duration": { $lt: 20 },
    },
    {
      $set: { "actions.$[].reviewed": true },
    }
  );
}

function ejercicio10() {
  return db.log.updateOne(
    { _id: "Aniceto" },
    { $set: { country: "Italia" }, $setOnInsert: { actions: [] } },
    { upsert: true }
  );
}
