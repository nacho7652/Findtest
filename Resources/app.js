// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#236FA0');

Ti.Geolocation.distanceFilter = 10;
Ti.Geolocation.preferredProvider = "gps";

var lat;
var lon;
var pin;
var mapview;

if (Titanium.Geolocation.locationServicesEnabled === false)
{
	Titanium.UI.createAlertDialog({title:'Kitchen Sink', message:'Your device has geo turned off - turn it on.'}).show();
}

Ti.Geolocation.getCurrentPosition(function(e){
	if(e.error)
	{
		alert('Ha ocurrido un error');
		return;
	}
	lon = e.coords.longitude;
	lat = e.coords.latitude;
	pin = Titanium.Map.createAnnotation({
    	latitude:lat,
    	longitude:lon,
    	title:"Mi posición",
    	subtitle:'donde estoy',
    	pincolor:Titanium.Map.ANNOTATION_RED,
    	animate:true,
    	//leftButton: '../images/appcelerator_small.png',
    	myid:1 // Custom property to uniquely identify this annotation.
	});
	mapview = Titanium.Map.createView({
		mapType: Titanium.Map.STANDARD_TYPE,
		region:{latitude:lat, longitude:lon, latitudeDelta:0.004, longitudeDelta:0.004},
		animate:true,
		regionFit:true,
		userLocation:true,
		annotations:[pin],
		height: 1000,
		top: 200
	});
});

var url2 = "http://192.168.0.109/Findbreak/functionphone/event-response.php?findnear2=1&lat="+lat+"&lng="+lon;
 var client2 = Ti.Network.createHTTPClient({
     // function called when the response data is available
     onload : function(e) {
         Ti.API.info("Received text: " + this.responseText);
         //alert(this.responseText);
         if(this.responseText)
         {
         	//removeAllAnnotations();
         	var data2 = JSON.parse(this.responseText);
         	alert(data2);
         	var i;
         	for(i=0; i<data2.cont; i++)
         	{
         		alert(data2.event[i].nombre);
         		pin = Titanium.Map.createAnnotation({
    				latitude:data2.event[i].lat,
    				longitude:data2.event[i].lon,
    				title:data2.event[i].nombre,
    				image: 'marker1.png',
    				pincolor:Titanium.Map.ANNOTATION_RED,
    				animate:true,
    				//leftButton: '../images/appcelerator_small.png',
    				myid:i+data2.cont // Custom property to uniquely identify this annotation.
         		});
         		mapview.addAnnotation(pin);
         	}
        }
     },
     // function called when an error occurs, including a timeout
     onerror : function(e) {
         Ti.API.debug(e.error);
         alert('error');
     },
     timeout : 5000  // in milliseconds
 });
 // Prepare the connection.
 client2.open("GET", url2);
 // Send the request.
 client2.send();

var windows = Ti.UI.createWindow({
	title: 'Findbreak',
	backgroundColor: '#236FA0'
});

var user = Ti.UI.createTextField({
	borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
  	color: '#336699',
  	hintText: "Email",  	
  	top: 100,
  	width: 600, 
  	height: 120
});

var pass = Ti.UI.createTextField({
	borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
  	color: '#336699',
  	hintText: "Password",
  	passwordMask: true,  	
  	top: 220,
  	width: 600, height: 120
});

var login = Titanium.UI.createButton({
   title: 'Ingresar',
   borderRadius:100,
   top: 340,
   width: 600,
   height: 120
});

login.addEventListener('click',function(e)
{
 var url = "http://192.168.0.109/Findbreak/functionphone/login-response.php?login=1&mail="+user.getValue()+"&pass="+pass.getValue();
 var client = Ti.Network.createHTTPClient({
     // function called when the response data is available
     onload : function(e) {
         if(this.responseText)
         {
         	var data = JSON.parse(this.responseText);
         	if(data.exito)    
         	{
         		alert("logueado con exito");
         		windows2.open();
         		windows.close();
         	}     	
         	else
         	{
         		alert("no funciono");
         	}
        }
     },
     // function called when an error occurs, including a timeout
     onerror : function(e) {
         Ti.API.debug(e.error);
         alert('error');
     },
     timeout : 5000  // in milliseconds
 });
 // Prepare the connection.
 client.open("GET", url);
 // Send the request.
 client.send();
});

windows.add(user);
windows.add(pass);
windows.add(login);
windows.open();

var windows2 = Ti.UI.createWindow({
	title: 'Findbreak',
	backgroundColor: '#236FA0',
	exitOnClose:true
});

var button = Ti.UI.createButton({
    backgroundImage: 'logon5.png',
    width: 500, //Ti.UI.SIZE,
    height: 180,
    left:5,
    top: 0
});

windows2.add(button);
windows2.add(mapview);
