// Seznam terminov ciklov vaj
var termini = [];

// Lastnosti posameznih učilnic kjer se izvajajo vaje
var lastnostiUcilnic = {};

// Objekt izbrane učilnice
var izbranaUcilnica;

// SVG objekt risanja
var risanje;

// Seznam skritih nizov v SVG formatu
var seznamSkritihNizov = [];

// Število najdenih zakladov
var najdenihZakladov = 0;

// Velikost načrta
const SIRINA = 800;
const VISINA = 600;

let koordinateZaklada =[]

preberiJSON('https://teaching.lavbic.net/cdn/OIS/DN1/lastnosti_ucilnic.json', (rezultat) => {
  lastnostiUcilnic = rezultat[2]
})

/**
 * Funkcija za generiranje enolične preslikave niza.
 *
 * @returns {zgoscenaVrednost niz}
 */
function preprostaPretvorbaVHashNiz(niz) {
  let hash = 0;
  for (let i = 0; i < niz.length; i++) {
    const znak = niz.charCodeAt(i);
    hash = (hash << 5) - hash + znak;
    hash &= hash;
  }
  return new Uint32Array([hash])[0].toString(36);
}

/**
 * Generiraj niz izbrane dolžine.
 *
 * @param dolzina željena dolžina niza
 * @returns niz željene dolžine
 */
function generirajNiz(dolzina) {
  var rezultat = "";
  var dovoljeniZnaki = "ABCČDEFGHIJKLMNOPQRSŠTUVZŽabcčdefghijklmnopqrsštuvzž";
  for (var i = 0; i < dolzina; i++)
    rezultat += dovoljeniZnaki.charAt(
      Math.floor(Math.random() * dovoljeniZnaki.length)
    );
  return rezultat;
}

/**
 * Omogoči oz. onemogoči vrednosti v izbirnem meniju, glede na izbrano uro
 * začetka cikla.
 *
 * @param zacetekCikla izbrana ura začetka cikla
 */
function pripraviIzbirniMeni(zacetekCikla) {
  if (typeof zacetekCikla == "string") zacetekCikla = parseInt(zacetekCikla);
  Array.from(document.querySelector("#termini").options).forEach(function (
    option_element
  ) {
    if (option_element.value)
      option_element.disabled =
        termini[option_element.value].zacetek != zacetekCikla;
  });
}

/**
 * Omogoči oz. onemogoči 2. korak prikaza dodatnih lastnosti izbrane učilnice.
 */
function obIzbiriTermina() {
  let izbranTermin = document.getElementById("termini").value;
  document.getElementById("drugi").disabled = !izbranTermin;
  prikaziPodatkeUcilnice()
}

/**
 * Funkcija, ki s pomočjo knjižnice SVG.js izriše vektorsko sliko
 * načrta 1. nadstropja na FRI.
 *
 * @param rezultat seznam elementov načrta
 */
function risanjeNacrta(rezultat) {
  risanje = SVG().addTo("nacrt").size(SIRINA, VISINA);
  rezultat.elements.forEach(function (element, i) {
    if (element.polyline) {
      var polyline = risanje
        .polyline(element.polyline)
        .fill("none")
        .stroke({ width: 0.3 });
      let barva = element.style.split(";")[1].split(":")[1];
      if (barva == "RGB(19,155,72)") {
        polyline.addClass("racunalniski-prostor");
        polyline.addClass(element.room);
        polyline.fill("#f0f0f5");
      }
      polyline.stroke({ color: barva, linecap: "round" });
    }
  });
}

/**
 * Ko se stran naloži, se izvedejo ukazi spodnje funkcije.
 */
window.addEventListener("load", function () {
  // Branje terminov vaj
  preberiJSON(
    "https://teaching.lavbic.net/cdn/OIS/DN1/termini_vaj.json",
    (rezultat) => {
      termini = rezultat;
      let dropDownTermini = document.getElementById("termini");
      dropDownTermini.innerHTML = '<option value="">Izberite termin</option>';
      rezultat.forEach(function (element, i) {
        dropDownTermini.innerHTML +=
          "<option value='" +
          i +
          "' disabled>" +
          element.dan +
          " (" +
          element.ucilnica +
          ")</option>";
      });
    }
  );

  // Izvedi ob dogodku spremembe začetne ure
  document
    .getElementById("ura")
    .addEventListener("change", function logKey(event) {
      if (this.value) {
        let stevilo = parseInt(this.value) + 2;
        let uraFormat = stevilo <= 9 ? "0" + stevilo : stevilo;
        document.getElementsByTagName("small")[0].innerHTML = uraFormat;
        pripraviIzbirniMeni(this.value);
      }
    });

  preberiJSON(
    "https://teaching.lavbic.net/cdn/OIS/DN1/prvo_nadstropje.json",
    (rezultat) => risanjeNacrta(rezultat)
  );
});

/**
 * Prikaži podatke o učilnici v 2. koraku.
 */
function prikaziPodatkeUcilnice() {
  let izbranTermin = document.getElementById("termini").value;
  if (izbranTermin) {
    // Preberi lastnosti izbrane učilnice
    let imeUcilnice = termini[izbranTermin].ucilnica;
    izbranaUcilnica = lastnostiUcilnic[imeUcilnice];
    izbranaUcilnica.ime = termini[izbranTermin].ucilnica;
    // Popravi HTML tabelo na podlagi sledeče kode
    document.querySelector("td.racunalnik").innerHTML =
      izbranaUcilnica.racunalniki;
    document.querySelector("table tbody").rows[2].cells[0].innerText =
      izbranaUcilnica.operacijski_sistem;
    document.querySelector("table tbody").rows[3].cells[1].innerText =
      izbranaUcilnica.dostop_za_invalide ? "dostopno vsem" : "ni dostopno vsem";
    document.querySelector("#seznam_lastnosti td").innerHTML =
      izbranaUcilnica.dodatna_oprema.toString();
    // Omogoči gumb 'Prikaži učilnico'
    document.getElementById("prikazi").disabled = false;
  }
}

/**
 * Generiraj naključni zaklad
 *
 * @returns podatki o generiranem zakladu
 */
function generirajZaklad() {
  const premerZaklada = 20;
  var koordinataX = pridobiNakljucnoCeloStevilo(1, SIRINA - 50);
  var koordinataY = pridobiNakljucnoCeloStevilo(1, VISINA - 20);
  return [premerZaklada, koordinataX, koordinataY];
}

/**
 * Funkcija, ki generira 3 zaklade na načrtu in jih skrije.
 * Uporabnik na načrtu s pomočjo premikanja miške poišče zaklad tako,
 * da se mu z miško približa na manj kot 20px oddaljenosti.
 */
function pripravaIskanjaZaklada() {
  /**
   * Funkcija, ki niz skrije na SVG načrtu.
   *
   * @param niz vhodni niz
   * @return niz v hash obliki
   */
  koordinateZaklada = []
  function skrijNaSVG(niz) {
    // Generiraj zaklad na SVG načrt
    var koordinate = generirajZaklad();

    koordinateZaklada.push(koordinate)

    // Generiraj zaklad v obliki besedila na SVG načrtu
    var tekstSVG = risanje
      .text(niz)
      .fill({ color: "#a80b1d" })
      .stroke({ color: "#a80b1d", width: 1 })
      .font({
        family: "Arial Bold",
        size: "1.5em",
      })
      .move(koordinate[1], koordinate[2]);

    seznamSkritihNizov.push(tekstSVG);

    // Skrij generirano besedilo
    tekstSVG.css("opacity", "0");

    return preprostaPretvorbaVHashNiz(niz);
  }

  document.getElementsByTagName("input").forEach(function (element) {
    if (element.type == "text") {
      let niz = generirajNiz(4);
      element.name = skrijNaSVG(niz);
    }
  });

  var pomagalo = document.getElementById("pomagalo");
  risanje
    .mousemove(function (evt) {
      console.log("Miška se premika nad načrtom.");
    })
    .mouseout(function () {
      pomagalo.innerHTML = "";
      document.getElementsByTagName("h1")[0].style.color = "darkblue";
    });
}

/**
 * Izberi korak delovanja aplikacije, in sicer 1. korak (izbira učilnice),
 * 2. korak (lastnosti izbrane učilnice) in 3. korak (iskanje zaklada).
 *
 * @param izbirniGumb izbirni gumbi levo od načrta 1. nadstropja FRI-ja
 */
function izbiraKoraka(izbirniGumb) {
  document.querySelectorAll("korak").forEach((element) => {
    element.style.borderLeft = "10px solid white";
  });
  // Izbranemu koraku dodeli svetlo sivo ozadje
  document.getElementById(izbirniGumb.value).style.borderLeft =
    "10px solid #b3ffb3";
  switch (izbirniGumb.value) {
    case "ucilnica":
      document.getElementsByTagName("table")[0].style.opacity = 0.2;
      // Omogoči izbirni gumb terminov
      document.querySelector("#termini").disabled = false;
      break;
    case "zaklad":
      document.getElementsByTagName("table")[0].style.opacity = 0.2;
      pripravaIskanjaZaklada();
      break;
    case "lastnosti":
      // Izberi izbirni gumb 'Dodatne lastnosti učilnice'
      document.getElementsByTagName("table")[0].style.opacity = 1;
      // Onemogoči izbirni gumb terminov iz 1. koraka
      document.querySelector("#termini").disabled = true;
      prikaziPodatkeUcilnice();
      break;
  }
}

/**
 * Branje JSON datotek iz podanega naslova.
 *
 * @param datoteka naslov datoteke
 * @param callback povratni klic z vsebino datoteke
 */
function preberiJSON(datoteka, callback) {
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open("GET", datoteka, true);
  xobj.onreadystatechange = function () {
    // Rezultat ob uspešno prebrani datoteki
    if (xobj.readyState == 4 && xobj.status == "200") {
      var json = JSON.parse(xobj.responseText);
      // Vrnemo rezultat
      callback(json);
    }
  };
  xobj.send(null);
}

/**
 * Pridobi naključno celo število v podanem območju od
 * vključno min števila do max števila, npr. [min,max).
 *
 * @param min najmanjša vrednost
 * @param max največja vrednost
 * @return celo število
 */
function pridobiNakljucnoCeloStevilo(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Funkcija na podlagi izbrane učilnice (globalna spremenljivka
 * 'izbranaUcilnica') označi na SVG načrtu ustrezen prostor z barvo
 * spremenljivke 'aktivnaBarva', sicer z barvo spremenljivke 'obicajnaBarva'.
 *
 * @param obicajnaBarva običajna barva
 * @param aktivnaBarva aktivna barva
 */
function prikaziUcilnicoNaNacrtu(aktivnaBarva, obicajnaBarva) {
  let seznamUcilnicSVG = SVG.find(".racunalniski-prostor");
  seznamUcilnicSVG.forEach((element) => {
    element.node.style.fill = obicajnaBarva
  })
  document.getElementsByClassName("racunalniski-prostor "+izbranaUcilnica.ime)[0].style.fill = aktivnaBarva
  alert("Učilnica " + izbranaUcilnica.ime + " (" + izbranaUcilnica.racunalniki +  " računalnikov) je na načrtu prikazana z rumeno-zeleno barvo!")
}

function miska(e){
  if(najdenihZakladov == 3) return true
  var rect = e.target.getBoundingClientRect();
  let x = e.clientX - 355
  let y = e.clientY - 9 

  //oddaljenostTock(x, y, seznamSkritihNizov[1])
  if(seznamSkritihNizov.length == 0){
    pripravaIskanjaZaklada()
  }

  let oddaljenost = oddaljenostTock(x, y, koordinateZaklada[najdenihZakladov][1], koordinateZaklada[najdenihZakladov][2])

  if (oddaljenost > 255){
    document.getElementsByTagName("h1")[0].style.color = "rgb(0,0,255)"
  }
  else {
    document.getElementsByTagName("h1")[0].style.color = "rgb(" + (255 - oddaljenost) + ",0," + oddaljenost + ")"
  }
 // document.getElementsByTagName("h1")[0].style.color =  

  if(oddaljenost < 20){
    document.getElementsByTagName("text")[najdenihZakladov].style.opacity = 1
    najdenihZakladov++
    document.getElementById("odkritih_zakladov").innerHTML = najdenihZakladov + " odkritih zakladov"
  }

  document.getElementById("pomagalo").innerHTML = "Iskanje " + Math.ceil(najdenihZakladov+1) + ". zaklada na (" + Math.ceil(koordinateZaklada[najdenihZakladov][1]) + ", " + Math.ceil(koordinateZaklada[najdenihZakladov][2]) + "). Trenutno si oddaljen " + Math.ceil(oddaljenost) + ", saj se nahajaš na (" + Math.ceil(x) + ", " + Math.ceil(y) + ")"

}

document.getElementById("preveri").onclick = (e) =>{
  var zakladI = (preprostaPretvorbaVHashNiz(document.getElementById("zakladicek").childNodes[3].value) == preprostaPretvorbaVHashNiz(document.getElementsByTagName("text")[0].childNodes[0].innerHTML))
  var zakladII = (preprostaPretvorbaVHashNiz(document.getElementById("zakladicek").childNodes[5].value) == preprostaPretvorbaVHashNiz(document.getElementsByTagName("text")[1].childNodes[0].innerHTML))
  var zakaldIII = (preprostaPretvorbaVHashNiz(document.getElementById("zakladicek").childNodes[7].value) == preprostaPretvorbaVHashNiz(document.getElementsByTagName("text")[2].childNodes[0].innerHTML))
  if (zakladI && zakladII && zakaldIII) {
    document.getElementById("zakladicek").childNodes[3].style.background = "#e3fbe3"
    document.getElementById("zakladicek").childNodes[5].style.background = "#e3fbe3"
    document.getElementById("zakladicek").childNodes[7].style.background = "#e3fbe3"
    preberiJSON("https://teaching.lavbic.net/api/pregovori/nakljucni", (res) =>{
      document.getElementById("odkritih_zakladov").innerHTML = res["pregovor"]
    })
  }
}