window.addEventListener('load', function(){

  var httpRequest;
  function makeRequest(){
    httpRequest = new XMLHttpRequest();
    if (!httpRequest) {
      console.log('Giving up :( Cannot create an XMLHTTP instance');
      return false;
    }
    httpRequest.onreadystatechange = getContents;
    httpRequest.open('GET', 'js/geo.json');
    httpRequest.send();
  };

  function getContents(){
    try {
      if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
          var data = JSON.parse(httpRequest.response);
          initMap(data);
          createList(data);
        } else {
          console.log('There was a problem with the request.');
        }
      }
    }
    catch( e ) {
      console.log('Caught Exception: ' + e.description);
    }
  }

  function initMap(data){
    	var mymap = L.map('mapid')
                   .setView([data.bounds.long, data.bounds.lat], 16);
      // mymap.dragging.disable();
    	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={access_token}', {
    		maxZoom: 18,
    		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
    			'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    		id: 'mapbox.streets',
        access_token: 'pk.eyJ1IjoicGV0ZWhhdWdoaWUiLCJhIjoiY2p5cWNvY3IxMDB6czNscDR3Yzg5dTZpMCJ9.JXNG0wrSHLWkLBCMIj38jA'
    	})
      .addTo(mymap);
      for (var i = 0; i < data.locations.length; i++) {
        var loc = data.locations[i];
        L.marker([loc.long, loc.lat], {title: loc.title, alt: loc.description})
        .addTo(mymap);
      }
  }

  function createList(data){
    var index = 0;
    var markers = document.getElementsByClassName("leaflet-marker-icon");
    var shadows = document.getElementsByClassName("leaflet-marker-shadow");
    var locations = document.getElementById("locations");
    var navigation = document.createElement("OL");
    navigation.classList.add("nav");
    var prev = document.createElement("LI");
    var next = document.createElement("LI");
    prev.innerText = "<";
    prev.classList.add("prev");
    prev.classList.add("end");
    prev.onclick = function(){
      if (index != 0) {
        index -= 1;
        activeStates(markers, shadows, index);
      }
      if (index === 0) {
        prev.classList.add("end");
      } else {
        prev.classList.remove("end");
      }
      next.classList.remove("end");
    }
    next.innerText = ">";
    next.classList.add("next");
    next.onclick = function(){
      if (index < data.locations.length - 1) {
        index += 1;
        activeStates(markers, shadows, index);
      }
      if (index === data.locations.length - 1) {
        next.classList.add('end')
      } else {
        next.classList.remove("end");
      }
      prev.classList.remove("end");
    }
    navigation.appendChild(prev);
    navigation.appendChild(next);
    locations.appendChild(navigation);
    var list = document.createElement("DIV");
    list.id = "locationsDescription";
    for (var i = 0; i < data.locations.length; i++) {
      var loc = data.locations[i];
      var listItem = document.createElement("DIV");
      if (i == 0) {
        listItem.classList.add("active");
      }
      for (var j = 0; j < markers.length; j++) {
        if (j !== 0)
          markers[j].classList.add("hidden");
          shadows[j].classList.add("hidden");
      }
      var header = document.createElement("H3");
      if (loc.form) {
        var form = document.createElement("IFRAME");
        form.src = loc.form;
        form.innerHTML = "Loading&hellip;";
        form.setAttribute("frameborder", 0);
        form.setAttribute("marginheight", 0);
        form.setAttribute("marginwidth", 0);
        form.setAttribute("tabindex", 0);
        listItem.append(form);
      }
      listItem.id = i;
      list.appendChild(listItem);
    }
    locations.appendChild(list);
  }

  function activeStates(markers, shadows, index) {
    var listItems = document.getElementById("locationsDescription")
                            .getElementsByTagName("DIV");
    for (var i = 0; i < markers.length; i++){
      listItems[i].classList.remove('active');
      markers[i].classList.add('hidden')
      shadows[i].classList.add("hidden");
    }
    listItems[index].classList.add('active');
    markers[index].classList.remove("hidden");
    shadows[index].classList.remove("hidden");
  }

  makeRequest();
});
