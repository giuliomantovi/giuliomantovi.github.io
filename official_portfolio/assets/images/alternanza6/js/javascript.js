$(document).ready(function () {
	initPage();
	});
	
function initPage() {
	console.log("initPage Start");
	$("#WebService").val("JSONObject1.json");	//valore predefinito
}

function jsonCall() {
	//Svuotiamo i campi in cui mostreremo il risultato
	
	//Chiamata AJAX al web service che restituisce il file di esempio JSON:
	
	var webService = "http://api.openweathermap.org/data/2.5/forecast";
	var parameters = {
		APPID: "926fce3e6b31cdca118412d27bb2d213",
		q:$("#città").val(),
		units:$("#misura").val(),
	};
	
	$.getJSON(webService, 
		parameters, 
		function(data) {
			//Success !
			console.log("Success !!");
			manageResponseData(data);
		}
	)
	.error(function(jqXHR, textStatus, errorThrown) {
		console.log("ERRORE AJAX: " + errorThrown);
		$("#città").val(errorThrown);
		$("#dati").val(errorThrown);
		
		alert("ERRORE AJAX: " + errorThrown);
		//debugger;
	});
}

// Funzione deputata all'elaborazione dei dati ricevuti dal web service
function manageResponseData(data) {
	//debugger;
	if (data){
		$("#città").val(data.city.name);
		$("#nazione").val(data.city.country);
		$("#latitudine").val(data.city.coord.lat);
		$("#longitudine").val(data.city.coord.lon);
		var dati="Città: 				 "+data.city.name+
		"\n"+    "Nazione:			 "+data.city.country+
		"\n"+    "Latitudine:			 "+data.city.coord.lat+
		"\n"+    "Longitudine:	 		 "+data.city.coord.lon+"\n\n";
		for(var i=0;i<data.list.length;i++)
			{
				if(i%8==0){
					dati+="ORARIO: 		    	 "+data.list[i].dt_txt+"\n"
					+	  "Temperatura media:               "+data.list[i].main.temp+"°C\n"
					+     "Temperatura minima:              "+data.list[i].main.temp_min+"°C\n"
					+     "Temperatura massima:             "+data.list[i].main.temp_max+"°C\n"
					+     "Clima: 		                 "+data.list[i].weather[0].description+"\n"
					+     "Vel. vento: 			 "+data.list[i].wind.speed+" m/s\n\n";
				}
		}
		$("#dati").val(dati);
	}
}

