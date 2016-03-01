(function ( $j ) {
    //Declare no-conflict
    $j = jQuery.noConflict();
    var o = $j({});
    $j.subscribe = function(){
        o.bind.apply(o, arguments);
    };
    $j.unsubscribe = function(){
        o.unbind.apply(o, arguments);
    };
    $j.publish = function(){
        o.trigger.apply(o, arguments);
    };
    $j(document).ready(function(){
        $j('div[data-' + defaults.mapSettingsDataAttr + ']').each(function(){            
            $j(this).GoogleMapPlugin();
        });
    });  
    
     var defaults = {

        //Events
        startSearchOn: 'click',
        openInfoWindowOn: 'click',        

        //Selectors
        defaultContainerID: 'map',
        markersSourceClass: '.dealer',
        centralMarkerClass: '.central',
        addressInputId: 'address',
        mapSettingsDataAttr:'map-config',
        bindSearchFeatureTo: 'submit',

        //Form css Classes
        searchFormClassSet: null,  // Css classes for <form>
        formControlsCssSet: null,  // Css classes for inside <div>
        labelCssSet: null, // Css classes for form label
        inputCssSet: null, // Css classes for form input field
        buttonCssSet:null, // Css classes for form button
        buttonSpanClassSet: null, // Css classes for button text
        inputLabel: 'Address', // Input Label
        inputText: 'text',  // Input Placeholder
        searchButtonText: 'Search',  // Button Text

        //Map Default Settings
        detectUserPosition: true,
        showAll: false,
        filterZipCode: true,
        searchFeature: false,
        activeInfoWindows: true,
        mapZoom: 7,        
        defaultMarkerSet: [],
        centralMarkerIcon: {
            url: 'images/marker-central.png', 
            size: new google.maps.Size(19,31),  // central marker icon source
            origin: new google.maps.Point(0,0),
            anchor: new google.maps.Point(9,31)
        },
        defaultMarkerIcon: {
            url: 'images/marker-central.png', // default marker icon source
            size: new google.maps.Size(19,31),
            origin: new google.maps.Point(0,0),
            anchor: new google.maps.Point(9,31)
        },
        mapPosition: {  //  map center on start
            lat: 52.265472, 
            lng: 19.305168
        },
        mapOptions: {
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            scrollwheel: false,
            disableDefaultUI: true
        },

        //Navigatot Settings
        navigatorOptions:{
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
        }
    };

    //Plugin Definition
    $j.fn.GoogleMapPlugin = function(){               
        //Retrive Data From Html
        var options = $j(this).data(defaults.mapSettingsDataAttr);
        //Container ID
        options['onContainer'] = $j(this).attr('id');  
        //Info Window Open event
        options['openInfoWindowOn'] = null;
        //Start Search On event
        options['startSearchOn'] = null;
        //Detect User Position from Browser
        var mapOptions = $j.extend({}, defaults, options);
        var that = this;
        $j(this).GoogleMapPlugin.searchFeatureUI(mapOptions, that).initializeMap(mapOptions);        
    };
    
    //Insert Search Field
    $j.fn.GoogleMapPlugin.searchFeatureUI = function(mapOptions, element){
        if(mapOptions.searchFeature){
            $j(element).parent().before(
                '<form class="' + mapOptions.searchFormClassSet + '" role="form">\n\
                    <div class="form-group ' + mapOptions.formControlsCssSet + '>\n\
                        <label class="' + mapOptions.labelCssSet + '" for="' + mapOptions.bindSearchFeatureTo + '">' + mapOptions.inputLabel + '</label>\n\
                        <input type="text" class="form-control ' + mapOptions.inputCssSet + '" id="address" placeholder="' + mapOptions.inputText + '">\n\
                        <button id="' + mapOptions.bindSearchFeatureTo + ' type="submit" class="btn btn-default ' + mapOptions.buttonCssSet + '><span class="' + mapOptions.buttonSpanClassSet + '">' + mapOptions.searchButtonText + '</span></button>\n\                        \n\
                    </div>\n\
                </form>');
        }
        return this;
    };
    
    $j.fn.GoogleMapPlugin.initializeMap = function(config){ 
        this.googleMap = new GoogleMap(config);
        this.apiControler = new GoogleAPIControler();
        var that = this;  
        $j.subscribe('geolocationDenied', this.googleMap.setupNewMap());
        $j.subscribe('positionRetrived', function(e, navigatorPosition){
            if(config.detectUserPosition){
                that.googleMap.config['mapZoom'] = 9;
                that.googleMap.config['mapPosition'] = navigatorPosition;
            }      
            that.googleMap.setupNewMap();
        });
        this.googleMap.detectUserPosition(this.googleMap.config, function(navigatorPosition){
            $j.publish('positionRetrived', navigatorPosition);
        }, function(){
            $j.publish('geolocationDenied', {});
        });                
    };
    
    function GoogleMap(config){
        this.config = config;
        this.map;
        this.markerSet;
    };
    
    GoogleMap.prototype.setupNewMap = function(){
        var mapCenter = new google.maps.LatLng(this.config.mapPosition);
        this.map = new google.maps.Map(document.getElementById(this.config.onContainer), this.config.mapOptions);            
        this.map.setCenter(mapCenter);
        this.map.setZoom(this.config.mapZoom);    
    };       
    
    GoogleMap.prototype.detectUserPosition = function(navigatorOptions, retrievePosition, geolocationDenied){
        navigator.geolocation.getCurrentPosition(function(position){
            retrievePosition({lat: position.coords.latitude, lng: position.coords.longitude});
        }, function(err){
            console.log('ERROR(' + err.code + '): ' + err.message);
            geolocationDenied();
        }, navigatorOptions);
    };   
    
    GoogleMap.prototype.putMarker = function(icon, position, map){
        return new google.maps.Marker({
            map: map,
            icon: icon,
            animation: google.maps.Animation.DROP,
            position: position,
            title: 'korbanek-map'
        });        
    };
    
    GoogleMap.prototype.mapResize = function(map){
        google.maps.event.addDomListener(window, "resize", function() {
            var center = map.getCenter();
            google.maps.event.trigger(map, "resize");
            map.setCenter(center); 
        });
    };
    
    GoogleMap.prototype.getMarkersLatLng = function(from){
        var destinations = new Array();
        $j(from).each(function(){
            var position = new google.maps.LatLng({lat: $j(this).data('lat'), lng: $j(this).data('lng')});
            destinations.push(position);
        });
        return destinations;
    };
    
    GoogleMap.prototype.getInfoWindowContent = function(lat, lng){        
        var selector = '[data-lat="' + lat + '"][data-lng="' + lng + '"]';
        var content;
        content = $j(selector).html();
        return content;
    };
    
    GoogleMap.prototype.setInfoWindowEvent = function(map, marker, event, infoWindow){
        marker.addListener(event, function(){   
            infoWindow.open(map, marker);
        });
    };
    
    GoogleMap.prototype.setInfoWindow = function(content){
        var infoWindow = new google.maps.InfoWindow({
            content: content
        });
        return infoWindow;
    };
    
    GoogleMap.prototype.createMarkers = function(icon, sourceSet){
        var markers = Array();
        for(var i = 0; i < sourceSet.length; i++){
            var marker = this.putMarker(icon, sourceSet[i], null);
            if(this.config.activeInfoWindows){
                var infoWindow = this.setInfoWindow(this.getInfoWindowContent(marker.getPosition().lat(), marker.getPosition().lng()));            
                this.setInfoWindowEvent(marker, this.config.openInfoWindowOn, infoWindow);
            }
            this.markerSet.push(marker);                
        };
        return markers;
    };
    
       
    function GoogleAPIControler(){
        
    };
    
}( jQuery ));