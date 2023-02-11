const TEACHING_API_BAZA = "Janez2126";
const SENSEI_RACUN = "0x2f4eD58C97fccB73327e420685ae5d5691cfDa40";

let SENSEI_BC_RPC_URL = "https://sensei.lavbic.net:8546";
let TEACHING_API_BASE_URL =
  "https://teaching.lavbic.net/api/OIS/baza/" + TEACHING_API_BAZA + "/podatki/";
let podatki_trans;
let podatki = [];
let web3 = new Web3("https://sensei.lavbic.net:8546");

/**
 * Generator podatkov za novega uporabnika, ki bo uporabljal aplikacijo. Pri
 * generiranju podatkov je potrebno najprej kreirati nov scenarij s specifičnimi
 * podatki, ki se nanašajo na scenarij.
 *
 * @param stScenarija zaporedna številka scenarija (1, 2 ali 3)
 * @return scenarijId generiranega scenarija
 */

window.addEventListener("load", (event) => {
  vseckaj();
});
function generirajScenarij(stScenarija) {
  scenarijId = "1";
  fetch(
    TEACHING_API_BASE_URL + "azuriraj?kljuc=" + "vreme" + "&elementTabele=true",
    {
      body: JSON.stringify({
        id: "123123",
        mesto: "Ljubljana",
        regija: "Osrednja",
        koordinati: "45.6 12.3",
        predvceraj: "20",
        vceraj: "18",
        danes: "21",
      }),
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      method: "PUT",
    }
  ).then((response) => {
    if (response.status != 204)
      document.getElementById("napaka").innerHTML =
        "Prišlo je do HTTP napake: " + response.status + "!";
    else fetchDataTempCustom();
  });
}
scenarijId = "2";
fetch(
  TEACHING_API_BASE_URL + "azuriraj?kljuc=" + "vreme" + "&elementTabele=true",
  {
    body: JSON.stringify({
      id: "123124",
      mesto: "Maribor",
      regija: "Štajerska",
      koordinati: "50.5 18.14",
      predvceraj: "11",
      vceraj: "15",
      danes: "18",
    }),
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
    },
    method: "PUT",
  }
).then((response) => {
  if (response.status != 204)
    document.getElementById("napaka").innerHTML =
      "Prišlo je do HTTP napake: " + response.status + "!";
  else fetchDataTempCustom();
});
scenarijId = "3";
fetch(
  TEACHING_API_BASE_URL + "azuriraj?kljuc=" + "vreme" + "&elementTabele=true",
  {
    body: JSON.stringify({
      id: "123125",
      mesto: "Koper",
      regija: "Obalna",
      koordinati: "10.5 12.14",
      predvceraj: "21",
      vceraj: "23",
      danes: "27",
    }),
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
    },
    method: "PUT",
  }
).then((response) => {
  if (response.status != 204)
    document.getElementById("napaka").innerHTML =
      "Prišlo je do HTTP napake: " + response.status + "!";
  else fetchDataTempCustom();
});
scenarijId = "4";
fetch(
  TEACHING_API_BASE_URL + "azuriraj?kljuc=" + "vreme" + "&elementTabele=true",
  {
    body: JSON.stringify({
      id: "123126",
      mesto: "Murska Sobota",
      regija: "Pomurska",
      koordinati: "80.5 71.14",
      predvceraj: "12",
      vceraj: "15",
      danes: "18",
    }),
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
    },
    method: "PUT",
  }
).then((response) => {
  if (response.status != 204)
    document.getElementById("napaka").innerHTML =
      "Prišlo je do HTTP napake: " + response.status + "!";
  else fetchDataTempCustom();
});

// TODO: Potrebno implementirati

// TODO: Tukaj implementirate funkcionalnosti, ki jo podpira vaša aplikacija
let AVG_TEMP = [{ x: new Date(), y: 0, color: "transparent" }];
let MORNING_TEMP = [{ x: new Date(), y: 0 }];
let DAY_TEMP = [{ x: new Date(), y: 0 }];
let EVENING_TEMP = [{ x: new Date(), y: 0 }];
let NIGHT_TEMP = [{ x: new Date(), y: 0 }];
fetchDataTempCustom();
prikaziGraf();
web3 = new Web3(SENSEI_BC_RPC_URL);

function postDataTempCustom() {
  let mesto = document.getElementById("ime_mesta").value;
  let regija = document.getElementById("regija").value;
  let kord = document.getElementById("koordinate").value;

  let pred = document.getElementById("preduciraj").value;
  let vcir = document.getElementById("vceraj").value;
  let danes = document.getElementById("danes").value;

  document.getElementById("napaka").innerHTML = "";

  if (!mesto || !regija || !kord || !pred || !vcir || !danes)
    document.getElementById("napaka").innerHTML =
      "Vnosna polja morajo biti polna!";
  else {
    let err = false;

    let tmp = kord.split(",");
    if (!Number.parseFloat(tmp[0].trim()) || !Number.parseFloat(tmp[1].trim()))
      err = true;
    if (
      !Number.parseFloat(pred) ||
      !Number.parseFloat(vcir) ||
      !Number.parseFloat(danes)
    )
      err = true;

    if (err) {
      document.getElementById("napaka").innerHTML =
        "V vnosnih poljih so napake!";
      return;
    }

    const ID = Math.floor(Date.now() / 1000);

    fetch(
      TEACHING_API_BASE_URL +
        "azuriraj?kljuc=" +
        "vreme" +
        "&elementTabele=true",
      {
        body: JSON.stringify({
          id: ID,
          mesto: mesto,
          regija: regija,
          koordinati: kord,
          predvceraj: pred,
          vceraj: vcir,
          danes: danes,
        }),
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        method: "PUT",
      }
    ).then((response) => {
      if (response.status != 204)
        document.getElementById("napaka").innerHTML =
          "Prišlo je do HTTP napake: " + response.status + "!";
      else fetchDataTempCustom();
    });
  }
}

function fetchDataTempCustom() {
  let select = document.getElementById("selectbox");

  fetch(TEACHING_API_BASE_URL + "vrni/vsi").then((res) => {
    if (res.status != 200)
      document.getElementById("napaka").innerHTML =
        "Prišlo je do HTTP napake pri branju podatkov iz baze: " +
        res.status +
        "!";
    else {
      res.json().then((data) => {
        if (data["vreme"].length != 0) {
          while (select.firstChild) {
            select.removeChild(select.lastChild);
          }
          podatki = data["vreme"];
          data["vreme"].forEach((el) => {
            let datum = new Date(Number.parseInt(el.id) * 1000);
            let text =
              el.mesto +
              " " +
              datum.getDate() +
              "." +
              datum.getMonth() +
              "." +
              datum.getFullYear();

            select.appendChild(new Option(text, el.id));
          });
        }
      });
    }
  });
}
async function napolniDonacije(donacije) {
  let appendString = "";
  var stevec = 1;
  for (donacija in donacije) {
    appendString +=
      `<tr>\
    <th scope="row">` +
      stevec +
      `</th>\
    <td>` +
      donacije[donacija].vzdevek +
      `</td>\
    <td>` +
      donacije[donacija].value +
      `<i class="fa-brands fa-ethereum"></i></td>\
    
  </tr>`;
    stevec++;
  }
  document.getElementById("podatkiEth").innerHTML = appendString;
}
async function vseckaj() {
  (async () => {
    const res = await fetch(TEACHING_API_BASE_URL + "vrni/vsi", {
      headers: { Accept: "application/json" },
    });
    const json = await res.json();
    vsiVsecki = [];
    Object.entries(json).forEach(([key, value]) => {
      if (key.includes("trans_")) {
        vsiVsecki.push(value);
      }
    });

    napolniDonacije(vsiVsecki);
  })();
}

function showTempData() {
  let select = document.getElementById("selectbox");
  document.getElementById("napaka2").innerText = "";
  if (select.value == "Izberi mesto")
    document.getElementById("napaka2").innerText =
      "Potrebno je izbrati mesto oz. dodati podatke v bazo!";
  else {
    let table_data = document.getElementById("table_data");

    podatki.forEach((el) => {
      if (el.id == select.value) {
        table_data.innerHTML =
          "<td>" +
          el.mesto +
          "</td>" +
          "<td>" +
          el.regija +
          "</td>" +
          "<td>" +
          el.koordinati +
          "</td>" +
          "<td>" +
          el.predvceraj +
          "°C</td>" +
          "<td>" +
          el.vceraj +
          "°C</td>" +
          "<td>" +
          el.danes +
          "°C</td>";
      }
    });
  }
}

let mestoTMP = "";

function getCityAPI() {
  document.getElementById("napaka3").innerText = "";
  let mesto = document.getElementById("mestoAPI").value;

  if (!mesto) {
    document.getElementById("napaka3").innerText = "Vpišite mesto!";
    retunr;
  } else if (mestoTMP == mesto) return;
  mestoTMP = mesto;

  fetch(
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
      mesto +
      "&limit=5&appid=a4649d8c913ec659a35da23112090366"
  ).then((res) => {
    if (res.status != 200) {
      document.getElementById("napaka3").innerText =
        "Prišlo je do HTTP napake: " + res.status + "!";

      return;
    }

    res.json().then((data) => {
      let select = document.getElementById("city");

      if (data.length != 0) {
        while (select.firstChild) {
          select.removeChild(select.lastChild);
        }

        data.forEach((el) => {
          let text = el.name + ", " + el.country;
          let id = el.lat + ":" + el.lon;
          select.appendChild(new Option(text, id));
        });
      }
    });
  });
}

function getWeatherAPI() {
  document.getElementById("napaka3").innerText = "";
  let mesto = document.getElementById("city").value;

  if (mesto == "Poiščite mesto!") {
    document.getElementById("napaka3").innerText =
      "Vpišite ime mesta in kliknite 'Išči'!";
    return;
  }

  let cords = mesto.split(":");

  fetch(
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
      cords[0] +
      "&lon=" +
      cords[1] +
      "&appid=e60cf206c9dc4dfbf43f3f32312409ec&exclude=current,minutely,hourly,alerts&units=metric"
  ).then((res) => {
    if (res.status != 200) {
      document.getElementById("napaka3").innerText =
        "Prišlo je do HTTP napake: " + res.status + "!";

      return;
    }

    res
      .json()
      .then((data) => {
        console.log(data);
        AVG_TEMP = [];
        MORNING_TEMP = [];
        DAY_TEMP = [];
        EVENING_TEMP = [];
        NIGHT_TEMP = [];
        data.daily.forEach((el) => {
          let dat = el.temp;
          AVG_TEMP.push({
            y: (dat.max + dat.min) / 2,
            x: new Date(el.dt * 1000),
          });
          MORNING_TEMP.push({
            y: dat.morn,
            x: new Date(el.dt * 1000),
          });
          DAY_TEMP.push({
            y: dat.day,
            x: new Date(el.dt * 1000),
          });
          EVENING_TEMP.push({
            y: dat.eve,
            x: new Date(el.dt * 1000),
          });
          NIGHT_TEMP.push({
            y: dat.night,
            x: new Date(el.dt * 1000),
          });
        });
      })
      .then(() => {
        console.log(AVG_TEMP);
        prikaziGraf();
      });
  });
}

function prikaziGraf() {
  var chart = new CanvasJS.Chart("chartContainer", {
    animationEnabled: true,
    title: {
      text: "Dnevne temperature",
    },
    axisX: {
      valueFormatString: "DD MMM,YY",
    },
    axisY: {
      title: "Temperatura v °C",
      suffix: " °C",
    },
    legend: {
      cursor: "pointer",
      fontSize: 16,
      itemclick: toggleDataSeries,
    },
    toolTip: {
      shared: true,
    },
    data: [
      {
        type: "line",
        axisYType: "secondary",
        name: "Povrečna temp.",
        yValueFormatString: "#0.## °C",
        markerSize: 0,
        dataPoints: AVG_TEMP,
        lineColor: "transparent",
      },
      {
        name: "Jutranja temp.",
        type: "spline",
        yValueFormatString: "#0.## °C",
        showInLegend: true,
        dataPoints: MORNING_TEMP,
      },
      {
        name: "Dnevna temp.",
        type: "spline",
        yValueFormatString: "#0.## °C",
        showInLegend: true,
        dataPoints: DAY_TEMP,
      },
      {
        name: "Popoldanska temp.",
        type: "spline",
        yValueFormatString: "#0.## °C",
        showInLegend: true,
        dataPoints: EVENING_TEMP,
      },
      {
        name: "Nočna temp.",
        type: "spline",
        yValueFormatString: "#0.## °C",
        showInLegend: true,
        dataPoints: NIGHT_TEMP,
      },
    ],
  });
  chart.render();

  function toggleDataSeries(e) {
    if (typeof e.dataSeries.visible === "undefined" || e.dataSeries.visible) {
      e.dataSeries.visible = false;
    } else {
      e.dataSeries.visible = true;
    }
    chart.render();
  }
}

async function ethLogIn() {
  console.log(web3);
  web3.eth.personal
    .importRawKey(
      document.getElementById("id_denarnice").value,
      document.getElementById("geslo_denarnice").value
    )
    .then(console.log("Account unlocked!"))
    .catch((document.getElementById("napaka4").style.display = "block"));
}
function generiraj() {
  generirajScenarij(1);
  generirajScenarij(2);
  generirajScenarij(3);
  generirajScenarij(4);
}

async function prijava() {
  var denarnica;
  denarnica = $("#racunVnos").val();
  var geslo = $("#gesloVnos").val();
  web3 = new Web3("wss://sensei.lavbic.net:8546");
  try {
    web3.eth.personal.unlockAccount(denarnica, geslo, 300).then(
      (value) => {
        modalnoOknoPrijavaDrugic();
      },
      (reason) => {
        document.getElementById("message").innerHTML = "Napačen vnos podatkov";
      }
    );
  } catch (error) {
    document.getElementById("message").innerHTML = "Napačen vnos podatkov";
  }
}

async function modalnoOknoPrijavaDrugic() {
  var tabelca = `<div class="panel panel-default">\
<div class="panel-heading">\
  <div class="row">\
    <div class="col">Vnesi Ime pošiljatelja</div>\
  </div>\
</div>\
<div class="panel-body">\
Ime pošiljatelja <input id="vzdevekVnos" type="text" class="form-control input-mini" placeholder="Ime pošiljatelja">\
  Donacija: <input id="donacija" type="number"   min="0.1" max="1" step="0.05" oninput="document.getElementById('don').innerHTML=' '+this.value">\
  <br>\
  <div>Donacija: <p id="don" ></p></div>\
  <button type="button"  onclick="doniraj()">Všečkaj</button><span id="error"></span>\
  </div>\
</div>`;
  document.getElementById("vseckanje").innerHTML = tabelca;
}

async function doniraj() {
  var value = $("#donacija").val();
  var thash;
  var ime = Math.floor(Math.random() * 101);
  try {
    await web3.eth
      .sendTransaction({
        from: denarnica,
        to: "0x2f4eD58C97fccB73327e420685ae5d5691cfDa40",
        value: "" + value * Math.pow(10, 18),
      })
      .on("transactionHash", function (hash) {
        thash = hash;
      });
    podatki_trans = {
      id: thash,
      Imeposiljatelja: ime,
      value: value,
    };
    postData("azuriraj/?kljuc=" + "trans_" + thash, podatki_trans);

    var tabelca = `<div class="panel panel-default">\
  <div class="panel-body">\
    <b>Hvala</b>\
  </div>`;
    vseckaj();
    document.getElementById("vseckanje").innerHTML = tabelca;
  } catch {
    vseckaj();
    document.getElementById("error").innerHTML =
      " <b>Sensei je down probably</b>";
  }
  vseckaj();
}
