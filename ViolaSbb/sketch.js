//----------------------------------------------VARAIBILI---------------------------------------------------------------------------
let table; //dico che esiste una variabile tabella
let validRows = []; //dico che validRows è un array (in cui metterò tutte le righe valide)

//-----------------------------------------------PRELOAD-----------------------------------------------------------------------------
function preload() { //funzione che mi fa caricare i file esterni
  table = loadTable("dati/dataset.csv", "csv", "header"); //gli definisco cosa intendo con tabella
  // "titolo", "tipo di file", "skip prima colonna xké è un header"
}

//-----------------------------------------------SETUP------------------------------------------------------------------------------------------------
function setup() {
  noCanvas();

  //------------------FILTRARE TABELLA--------------------------------
  //solo le righe che rispettino entrambe le regole
  //1. column3 is integer 30 <= x < 42
  //2. column2 > 60
  for (let r = 0; r < table.getRowCount(); r++) {
    let row = table.getRow(r); //gli dico che row è una riga della tabella
    let column2 = row.getNum(2); // colonna 2
    let column3 = row.getNum(3); // colonna 3

    //applicazione delle regole
    let rule1 = Number.isInteger(column3) && column3 >= 30 && column3 < 42; //isInteger: verifica che il numero sia intero, regola per la colonna 3
    let rule2 = column2 > 60;

    if (rule1 && rule2) { //se le regole sono verificate
      validRows.push(row); //pusho la riga nell'array "validRows"
    }
  }
  //per visualizzare in html
  select("#totalRows").html(table.getRowCount()); //dico di inderire tutte le row della tabella
  select("#validRows").html(validRows.length);

  computeStats();
}

//----------------- CREO FUNZIONE PER CALCOLARE LE STATISTICHE--------------------------
//visto che le funzioni statistiche vogliono solo imput di array di numeri dobbiamo dirglielo
//devo organizzare i dati non più in righe ma in colonne
function computeStats() {
  if (validRows.length === 0) return; //se la riga è vuota non calcolarla

  let clmn = [[], [], [], [], []]; //clmn è un array di array, contiene tutte le colonne (che sono a loro volta degli array contententi i dati delle singole colonne)

  //devo organizzare i valori per colonna e non più per riga
  //needing 2 cicli
  for (let row of validRows) { //prendendo una riga da validRows
    for (let i = 0; i < 5; i++) { //per ogni i (quindi ogni valore nella riga), scorri i dati da clmn0 fino a clmn4
      clmn[i].push(row.getNum(i)); //prendi i (row.getNum(i)) & pusha valore nell'array corrispondente (clmn[i])
    }
  } //quindi ora grazie al doppio ciclo ottengo che in ogni array [] ho tutti i valori della stessa colonna

  //calcoliamo le statistiche
  //utilizzo la libreria statistics.min.js, creata da "thisancog" su Github
  let mean0 = stats.mean(clmn[0]); //media colonna 0
  let std1 = stats.standardDeviation(clmn[1]); //deviazione std colonna 1
  let mode2 = stats.mode(clmn[2]); //moda colonna 2
  let median3 = stats.median(clmn[3]); //mediana colonna 3
  let mean4 = stats.mean(clmn[4]); //media colonna 4
  let std4 = stats.standardDeviation(clmn[4]); //deviazione std colonna 4

  //mostrare i risultati in html
  select("#mean0").html(nf(mean0, 1, 2)); //associa valore all'id mean0, nf=number format quindi nf(valore(calcolato prima nelle stats), n°cifre intere, n°cifere decimali)
  select("#std1").html(nf(std1, 1, 2));
  select("#mode2").html(Array.isArray(mode2) ? mode2.map(m => nf(m, 1, 2)).join(', ') : nf(mode2, 1, 2)); //la moda è un po' particolare xké è può essere un numero singolo o un array (se ci sono più mode)
  select("#median3").html(nf(median3, 1, 2));
  select("#mean4").html(nf(mean4, 1, 2));
  select("#std4").html(nf(std4, 1, 2));
}
