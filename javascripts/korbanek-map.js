(function ( $j ) {
    //Declare no-conflict
    $j = jQuery.noConflict();
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
        if(config.detectUserPosition){
            this.googleMap.detectUserPosition(this.googleMap.config, function(navigatorPosition){
                that.googleMap.config['mapZoom'] = 9;
                that.googleMap.config['mapPosition'] = navigatorPosition;
                that.googleMap.embedMap();
            });        
        }
        else{
            this.googleMap.embedMap();
        }
    };
    
    function GoogleMap(config){
        this.config = config;
        this.map;
    };
    
    GoogleMap.prototype.embedMap = function(){
        var mapCenter = new google.maps.LatLng(this.config.mapPosition);
        this.map = new google.maps.Map(document.getElementById(this.config.onContainer), this.config.mapOptions);            
        this.map.setCenter(mapCenter);
        this.map.setZoom(this.config.mapZoom);    
    };       
    
    GoogleMap.prototype.detectUserPosition = function(navigatorOptions, callback){
        if (!navigator.geolocation){
            return;
        }
        navigator.geolocation.getCurrentPosition(function(position){
            callback({lat: position.coords.latitude, lng: position.coords.longitude});
        }, function(err){
            console.warn('ERROR(' + err.code + '): ' + err.message);
        }, navigatorOptions);
    };   
    
    function GoogleAPIControler(){
        
    };
}( jQuery ));