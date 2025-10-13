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

  //devo organizzare i valori per colonna e non più per riga
  //raccolgo i dati nelle singole colonnecreando dei gruppi nuovi
  //raggruppo le colonne in una variabile "data" x poter calcolare le statistiche (è richiesto dalla libreria statistics.js)
  let data = validRows.map(row => ({
    column0: row.getNum('column0'),
    column1: row.getNum('column1'),
    column2: row.getNum('column2'),
    column3: row.getNum('column3'),
    column4: row.getNum('column4')
  }));

  //specifico il che dato è in misura metrica (necessario x statistics.js)
  let columns = {
    column0: 'metric',
    column1: 'metric',
    column2: 'metric',
    column3: 'metric',
    column4: 'metric'
  };

  //dico che stats è un nuovo calcolo statistico con dati e colonne
  let stats = new Statistics(data, columns);

  //calcolo delle statistiche
  let mean0 = stats.arithmeticMean("column0");
  let std1 = stats.standardDeviation("column1");
  let mode2 = stats.mode("column2");
  let median3 = stats.median("column3");
  let mean4 = stats.arithmeticMean("column4");
  let std4 = stats.standardDeviation("column4");

  //visualizzazione testuale in html
  select("#mean0").html(mean0);
  select("#std1").html(std1);
  select("#mode2").html(mode2);
  select("#median3").html(median3);
  select("#mean4").html(mean4);
  select("#std4").html(std4);

  //------------------------------------------RAPPRESENTAZIONI GRAFICHE---------------------------------------------------------------------------------
  //------------MODA COLUMN2----------------
  //creare un'insimee di pallini che rappresentino la frequenza di ogni numero in base alla dimensione diametro

  //1. voglio ottenere un array per cui modes[{number1: count1, n2: f2, ...}]
  let values = validRows.map(row => row.getNum('column2')); //estraggo i valori della colonna 2 dall'array validRows (e lo metto nell'oggetto values)
  //conto ogni volta che un numero viene ripetuto
  let frequency = {}; //oggetto vuoto in cui memorizzo le frequenze
  values.forEach(x => { //scorre tutti gli elementi dell'array values (creato prima) e per ogni elemento x esegue:
    frequency[x] = (frequency[x] || 0) + 1; //se x esiste già in frequency prendi il suo valore, altrimenti prendi 0 e aggiungi 1 -- cioè se "a" è nuovo considera frequency 0 e aggiungi 1, se "a" è già stato utilizzato (ex. 3 volte) riprendi frequency[3] e aggiungi 1
  });
  //ora devo accoppiare questi due valori in un unico array
  let modes = Object.entries(frequency) //trasformo frequency in un array di coppie "modes" strutturato [chiave, valore]
    .map(([number, count]) => ({ number, count })) //devo destrutturare le coppie di prima e assegno i nomi "number" e "count" (in modo che sia più leggibile)
    //ottengo un array con questa struttura:
    //modes = [ 
    // {number: "97", count: 3}, 
    // {number: "98", count: 5}, 
    // ...]     i numbers sono stringhe (non ho bisogno di trasformarli in numeri)
    //infine ordino l'array in base alla frequenza (dal più grande al più piccolo)
    .sort((a, b) => b.count - a.count);

  //2. EFFETTIVA rappresentazione grafica in HTML
  //definisco dimensioni pallino in base a count
  let divModes = select("#graphModes"); //seleziono div dove mettere i pallini
  let maxCount = modes[0].count; //prendo il valore più grande e baso le dimensioni degli altri su quello
  let maxSize = 120; //definisco che il pallino maggiore debba essere così, gli altri saranno più piccolo in proporzione
  modes.forEach(mode => { //per ogni elemento dell'array modes (mode è ogni singolo {number: "", count: x})
    let size = (mode.count / maxCount)*maxSize; //genera un pallino con dimensioni che siano (qt di volte che compare / massimo conteggio generale) * dimensione del pallino massimo

  
  //definiamo la creazione di tanti pallini quanto sono le mode 
  let pallino = createDiv(mode.number); 
  //riferisco che deve basarsi sulla classe pallino fatta in css
  pallino.class("pallino"); 
  pallino.attribute("data-info", `Number ${mode.number} was repeated ${mode.count} times`); //gli dico cosa scrivre in ::after
  //definisco le dimensioni in base alle regole definite prima (let size)
  pallino.style("width", size + "px");
  pallino.style("height", size + "px");
  pallino.style("font-size", size / 3 + "px"); //dimensione del font in base alla dimensione del pallino
  //metto effettivamente il pallino dentro il div
  pallino.parent(divModes);
  });


  //------------MEDIANA COLUMN3-----------------
  
}