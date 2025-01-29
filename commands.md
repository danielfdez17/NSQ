# COLECCIONES
### Importar colecciones
 ```mongoimport --db test -c restaurants mongodb://localhost restaurants.json```
### Listar colecciones
 ```show collections```
### Borrar colección
```db.coord.drop()```

# INSERCIONES
### Insertar un elemento
 ```db.insertOne({})```
### Insertar varios elementos
 ```db.insertMany({})```

# CONSULTAS
### Buscar elementos
```db.coord.find({filetrs}, {projection})```
```db.coord.findOne({filetrs}, {projection})```
### Contar elementos
```db.coord.find().count()```
### Mostrar x elementos
```db.coord.find().limit(3)```
### Saltar x elementos
```db.coord.find().skip(100)```
### Ordenar elementos
```db.coord.find({},{}).sort({})```

# ACTUALIZACIONES
### Actualizar un elemento
```db.coord.updateOne({})```
### Actualizar varios elementos
```db.coord.updateMany({})```

# BORRADOS


# OTROS
### Conectarse a servidor mongo
```mongosh mongodb://localhost```

### Devolver un array
```db.find({},{}).toArray()```

### El principio de la cadena empieza por 'str'
```^str```

### El final de la cadena termina por 'str'
```str$```

### Busca las cadenas 'str' seguidas por los caracteres contenidos en 'char'
```str[char]```

### Busca las cadenas 'str' no seguidas por los caracteres contenidos en 'char'
```[^str]```

### La cadena 'str' puede repetirse 0 o más veces 
```str*```

### La cadena 'str' puede repetirse 1 o más veces
```str+```