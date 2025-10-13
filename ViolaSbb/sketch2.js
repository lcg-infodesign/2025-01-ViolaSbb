let table;
let validRows = [];

function preload() {
  table = loadTable("dati/dataset.csv", "csv", "header");
}

function setup() {
  noCanvas();

  // Filtro le righe secondo le nuove regole
  for (let r = 0; r < table.getRowCount(); r++) {
    let row = table.getRow(r);
    let column2 = row.getNum("column2");
    let column3 = row.getNum("column3");

    let rule1 = Number.isInteger(column3) && column3 >= 30 && column3 < 42;
    let rule2 = column2 > 60;

    if (rule1 && rule2) {
      validRows.push(row);
    }
  }

  // Visualizzazione del conteggio delle righe
  select("#totalRows").html(table.getRowCount());
  select("#validRows").html(validRows.length);

  computeStats();
}

function computeStats() {
  if (validRows.length === 0) return;

  // Trasformazione per statistics.js
  let data = validRows.map(row => ({
    column0: row.getNum('column0'),
    column1: row.getNum('column1'),
    column2: row.getNum('column2'),
    column3: row.getNum('column3'),
    column4: row.getNum('column4')
  }));

  let columns = {
    column0: 'metric',
    column1: 'metric',
    column2: 'metric',
    column3: 'metric',
    column4: 'metric'
  };

  let stats = new Statistics(data, columns);

  // Statistiche richieste
  let mean0 = stats.arithmeticMean("column0");
  let std1 = stats.standardDeviation("column1");
  let mode2 = stats.mode("column2");
  let median3 = stats.median("column3");
  let mean4 = stats.arithmeticMean("column4");
  let std4 = stats.standardDeviation("column4");

  // Visualizzazione (testuale esempio)
  select("#mean0").html(mean0);
  select("#std1").html(std1);
  select("#mode2").html(mode2);
  select("#median3").html(median3);
  select("#mean4").html(mean4);
  select("#std4").html(std4);

}