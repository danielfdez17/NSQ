//
// Bases de datos NoSQL (24/25)
// Práctica 7
//
// Haz que cada función devuelva el resultado indicado
// en el enunciado para el apartado correspondiente.
//

function ejercicio1() {
  // * OK
  // 2 instrucciones, la segunda devuelve el resultado
  db.comments.createIndex(
    { raw_message: "text" },
    { default_language: "spanish" }
  );
  return db.comments.find({ $text: { $search: "América" } }).count();
}

function ejercicio2() {
  // * OK
  // el resultado debe ser un número
  return db.comments.find({ $text: { $search: "América Europa" } }).count();
}

function ejercicio3() {
  // * OK
  // el resultado debe ser un número
  return db.comments.find({ $text: { $search: "-América Europa" } }).count();
}

function ejercicio4() {
  // * OK
  // el resultado debe ser un objeto con los campos indicados
  return db.comments
    .find(
      { $text: { $search: "peligro" } },
      { raw_message: 1, _id: 0, score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .limit(1)
    .toArray()[0];
}

function ejercicio5() {
  // el resultado debe ser un número
  let totalMentira = db.comments.countDocuments({
    $text: { $search: "mentira" },
  });
  let totalDisgustMentira = db.comments.countDocuments({
    $text: { $search: "mentira" },
    sentiment: "disgust",
  });
  return totalDisgustMentira / totalMentira;
}

function ejercicio6() {
  // * OK
  return db.comments.aggregate([
    { $match: { $text: { $search: "democracia" } } },
    { $group: { _id: "$author.name", veces: { $sum: 1 } } },
    { $sort: { veces: -1 } },
    { $limit: 2 },
  ]);
}

function ejercicio7() {
  /*
	Explicacion:
	Antes del índice:
	-----------------
	totalKeysExamined: 0
	totalDocsExamined: 1700
	executionTimeMillis: 6
	Plan de ejecución: hace un COLLSCAN completo (escanea todos los documentos de la colección para después filtrar y ordenar).
	
	Despues del indice:
	-------------------
 	totalKeysExamined: 169
	totalDocsExamined: 0
	executionTimeMillis: 11
	Plan de ejecución: usa el índice likes_1_createdAt_-1 (etapa de IXSCAN), filtra y ordena directamente por el índice.

	La mejora de fondo está en que, tras crear el índice, apenas se examinan documentos completos (cero) y 
	se reduce el trabajo de lectura de la colección. 
	Esto es lo óptimo desde el punto de vista de lecturas, pues la consulta se resuelve únicamente usando las claves de índice.
  */

  // Antes:
  db.comments
    .find({ likes: { $gt: 10 } }, { createdAt: 1, likes: 1, _id: 0 })
    .sort({ createdAt: -1 })
    .explain("executionStats");
  /* RESULTADOS ANTES DE CREAR EL INDICE 
 {
  explainVersion: '1',
  queryPlanner: {
    namespace: 'ep.comments',
    parsedQuery: {
      likes: {
        '$gt': 10
      }
    },
    indexFilterSet: false,
    queryHash: '849D8EA7',
    planCacheKey: '1350B2EB',
    optimizationTimeMillis: 0,
    maxIndexedOrSolutionsReached: false,
    maxIndexedAndSolutionsReached: false,
    maxScansToExplodeReached: false,
    prunedSimilarIndexes: false,
    winningPlan: {
      isCached: false,
      stage: 'SORT',
      sortPattern: {
        createdAt: -1
      },
      memLimit: 104857600,
      type: 'simple',
      inputStage: {
        stage: 'PROJECTION_SIMPLE',
        transformBy: {
          createdAt: 1,
          likes: 1,
          _id: 0
        },
        inputStage: {
          stage: 'COLLSCAN',
          filter: {
            likes: {
              '$gt': 10
            }
          },
          direction: 'forward'
        }
      }
    },
    rejectedPlans: []
  },
  executionStats: {
    executionSuccess: true,
    nReturned: 169,
    executionTimeMillis: 6,
    totalKeysExamined: 0,
    totalDocsExamined: 1700,
    executionStages: {
      isCached: false,
      stage: 'SORT',
      nReturned: 169,
      executionTimeMillisEstimate: 0,
      works: 1871,
      advanced: 169,
      needTime: 1701,
      needYield: 0,
      saveState: 0,
      restoreState: 0,
      isEOF: 1,
      sortPattern: {
        createdAt: -1
      },
      memLimit: 104857600,
      type: 'simple',
      totalDataSizeSorted: 11323,
      usedDisk: false,
      spills: 0,
      spilledDataStorageSize: 0,
      inputStage: {
        stage: 'PROJECTION_SIMPLE',
        nReturned: 169,
        executionTimeMillisEstimate: 0,
        works: 1701,
        advanced: 169,
        needTime: 1531,
        needYield: 0,
        saveState: 0,
        restoreState: 0,
        isEOF: 1,
        transformBy: {
          createdAt: 1,
          likes: 1,
          _id: 0
        },
        inputStage: {
          stage: 'COLLSCAN',
          filter: {
            likes: {
              '$gt': 10
            }
          },
          nReturned: 169,
          executionTimeMillisEstimate: 0,
          works: 1701,
          advanced: 169,
          needTime: 1531,
          needYield: 0,
          saveState: 0,
          restoreState: 0,
          isEOF: 1,
          direction: 'forward',
          docsExamined: 1700
        }
      }
    }
  },
  command: {
    find: 'comments',
    filter: {
      likes: {
        '$gt': 10
      }
    },
    sort: {
      createdAt: -1
    },
    projection: {
      createdAt: 1,
      likes: 1,
      _id: 0
    },
    '$db': 'ep'
  },
  serverInfo: {
    host: 'DFO-laptop',
    port: 27017,
    version: '8.0.3',
    gitVersion: '89d97f2744a2b9851ddfb51bdf22f687562d9b06'
  },
  serverParameters: {
    internalQueryFacetBufferSizeBytes: 104857600,
    internalQueryFacetMaxOutputDocSizeBytes: 104857600,
    internalLookupStageIntermediateDocumentMaxSizeBytes: 104857600,
    internalDocumentSourceGroupMaxMemoryBytes: 104857600,
    internalQueryMaxBlockingSortMemoryUsageBytes: 104857600,
    internalQueryProhibitBlockingMergeOnMongoS: 0,
    internalQueryMaxAddToSetBytes: 104857600,
    internalDocumentSourceSetWindowFieldsMaxMemoryBytes: 104857600,
    internalQueryFrameworkControl: 'trySbeRestricted',
    internalQueryPlannerIgnoreIndexWithCollationForRegex: 1
  },
  ok: 1
}
 */
  // Creación del índice
  db.comments.createIndex({ likes: 1, createdAt: -1 });
  // Después:
  db.comments
    .find({ likes: { $gt: 10 } }, { createdAt: 1, likes: 1, _id: 0 })
    .sort({ createdAt: -1 })
    .explain("executionStats");
  /* RESULTADOS DESPUES DE CREAR EL INDICE 
    {
  explainVersion: '1',
  queryPlanner: {
    namespace: 'ep.comments',
    parsedQuery: {
      likes: {
        '$gt': 10
      }
    },
    indexFilterSet: false,
    queryHash: '849D8EA7',
    planCacheKey: '544F8913',
    optimizationTimeMillis: 0,
    maxIndexedOrSolutionsReached: false,
    maxIndexedAndSolutionsReached: false,
    maxScansToExplodeReached: false,
    prunedSimilarIndexes: false,
    winningPlan: {
      isCached: false,
      stage: 'SORT',
      sortPattern: {
        createdAt: -1
      },
      memLimit: 104857600,
      type: 'default',
      inputStage: {
        stage: 'PROJECTION_COVERED',
        transformBy: {
          createdAt: 1,
          likes: 1,
          _id: 0
        },
        inputStage: {
          stage: 'IXSCAN',
          keyPattern: {
            likes: 1,
            createdAt: -1
          },
          indexName: 'likes_1_createdAt_-1',
          isMultiKey: false,
          multiKeyPaths: {
            likes: [],
            createdAt: []
          },
          isUnique: false,
          isSparse: false,
          isPartial: false,
          indexVersion: 2,
          direction: 'forward',
          indexBounds: {
            likes: [
              '(10, inf.0]'
            ],
            createdAt: [
              '[MaxKey, MinKey]'
            ]
          }
        }
      }
    },
    rejectedPlans: []
  },
  executionStats: {
    executionSuccess: true,
    nReturned: 169,
    executionTimeMillis: 11,
    totalKeysExamined: 169,
    totalDocsExamined: 0,
    executionStages: {
      isCached: false,
      stage: 'SORT',
      nReturned: 169,
      executionTimeMillisEstimate: 10,
      works: 340,
      advanced: 169,
      needTime: 170,
      needYield: 0,
      saveState: 0,
      restoreState: 0,
      isEOF: 1,
      sortPattern: {
        createdAt: -1
      },
      memLimit: 104857600,
      type: 'default',
      totalDataSizeSorted: 27547,
      usedDisk: false,
      spills: 0,
      spilledDataStorageSize: 0,
      inputStage: {
        stage: 'PROJECTION_COVERED',
        nReturned: 169,
        executionTimeMillisEstimate: 10,
        works: 170,
        advanced: 169,
        needTime: 0,
        needYield: 0,
        saveState: 0,
        restoreState: 0,
        isEOF: 1,
        transformBy: {
          createdAt: 1,
          likes: 1,
          _id: 0
        },
        inputStage: {
          stage: 'IXSCAN',
          nReturned: 169,
          executionTimeMillisEstimate: 10,
          works: 170,
          advanced: 169,
          needTime: 0,
          needYield: 0,
          saveState: 0,
          restoreState: 0,
          isEOF: 1,
          keyPattern: {
            likes: 1,
            createdAt: -1
          },
          indexName: 'likes_1_createdAt_-1',
          isMultiKey: false,
          multiKeyPaths: {
            likes: [],
            createdAt: []
          },
          isUnique: false,
          isSparse: false,
          isPartial: false,
          indexVersion: 2,
          direction: 'forward',
          indexBounds: {
            likes: [
              '(10, inf.0]'
            ],
            createdAt: [
              '[MaxKey, MinKey]'
            ]
          },
          keysExamined: 169,
          seeks: 1,
          dupsTested: 0,
          dupsDropped: 0
        }
      }
    }
  },
  command: {
    find: 'comments',
    filter: {
      likes: {
        '$gt': 10
      }
    },
    sort: {
      createdAt: -1
    },
    projection: {
      createdAt: 1,
      likes: 1,
      _id: 0
    },
    '$db': 'ep'
  },
  serverInfo: {
    host: 'DFO-laptop',
    port: 27017,
    version: '8.0.3',
    gitVersion: '89d97f2744a2b9851ddfb51bdf22f687562d9b06'
  },
  serverParameters: {
    internalQueryFacetBufferSizeBytes: 104857600,
    internalQueryFacetMaxOutputDocSizeBytes: 104857600,
    internalLookupStageIntermediateDocumentMaxSizeBytes: 104857600,
    internalDocumentSourceGroupMaxMemoryBytes: 104857600,
    internalQueryMaxBlockingSortMemoryUsageBytes: 104857600,
    internalQueryProhibitBlockingMergeOnMongoS: 0,
    internalQueryMaxAddToSetBytes: 104857600,
    internalDocumentSourceSetWindowFieldsMaxMemoryBytes: 104857600,
    internalQueryFrameworkControl: 'trySbeRestricted',
    internalQueryPlannerIgnoreIndexWithCollationForRegex: 1
  },
  ok: 1
}
     */
}

function ejercicio8() {
  //   db.prueba.createIndex({ a: 1 }, { name: "ia" });
  //   db.prueba.createIndex({ b: 1 }, { name: "ib" });
  return db.prueba.find({ a: 2, b: 1 }).hint("ib");
}

function ejercicio9() {
  // db.prueba.find({ a: 2, b: 1 }).explain("executionStats")
  /* SIN HINT */
  // IXSCAN, sobre el índice { a: 1 } (nombre "ia") para encontrar los documentos con a = 2.
  // Luego, se realiza un FETCH para obtener los documentos con b = 1.
  // Devolver el conjunto final de documentos.
  /* CON HINT */
  // IXSCAN sobre el índice { b: 1 } (nombre "ib") para encontrar los documentos con b = 1.
  // FETCH para verificar en cada documento si a = 2.
  /*
	El coste en uno u otro caso depende de cuántos valores distintos tengan a y b, y de la cardinalidad de cada condición. 
	Mongo decide por defecto el plan “menos costoso”, pero con hint() obligamos a usar el índice que queramos
  */
}
