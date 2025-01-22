// ? Desde la consola: mongoimport --db sample_restaurants --collection restaurants mongodb://localhost restaurants.json

db.cuentas.insertOne({
  nombre: "bertoldo",
  calle: "General Jamón, num. 3.141592",
  cuentas: [
    { num: "001", saldo: 2000, compartida: true },
    { num: "002", saldo: 100, compartida: false },
  ],
  datoscontacto: {
    email: "bertoldo@ucm.es",
    telfs: { fijo: "913421234", movil: ["5655555", "444444"] },
  },
});
