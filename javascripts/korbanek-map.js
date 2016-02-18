(function ( $j ) {
    //Declare no-conflict
    $j = jQuery.noConflict();
    //Strict mode
    'use strict';
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

        //Map Default Settings
        detectUserPosition: true,
        showAll: false,
        filterZipCode: true,
        searchFeature: false,
        activeInfoWindows: true,
        mapZoom: 7,        
        inputLabel: 'Address', // Input Label
        inputText: 'text',  // Input Placeholder
        searchButtonText: 'Search',  // Button Text
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
        var self = this;
        //Retrive Data
        var options = $j(this).data(defaults.mapSettingsDataAttr);
        //Container ID
        options['onContainer'] = $j(this).attr('id');  
        //Info Window Open event
        options['openInfoWindowOn'] = $j.fn.GoogleMapPlugin.prototype.obtainOnClickEvent();
        //Start Search On event
        options['startSearchOn'] = $j.fn.GoogleMapPlugin.prototype.obtainOnClickEvent();
        //Detect User Position from Browser        
        if(options.detectUserPosition){
            $j.fn.GoogleMapPlugin.prototype.retriveUserPosition(options, self, function(){
                //Compose Settings Object
                var mapOptions = $j.extend({}, defaults, options);
                //Start jQuery Plugin Chain
                $j(this).GoogleMapPlugin.searchFeatureUI(mapOptions, $j(self)).createMap(mapOptions);
            });
        }else{
            //Compose Settings Object
            var mapOptions = $j.extend({}, defaults, options);
            //Start jQuery Plugin Chain
            $j(this).GoogleMapPlugin.searchFeatureUI(mapOptions, $j(self)).createMap(mapOptions);            
        }
    };
    
    //Insert Search Field
    $j.fn.GoogleMapPlugin.searchFeatureUI = function(mapOptions, element){
        if(mapOptions.searchFeature){
            $j(element).parent().before(
                '<div class="form-group">\n\
                    <label for="' + mapOptions.bindSearchFeatureTo + '">' + mapOptions.inputLabel + '</label>\n\
                    <input type="text" class="form-control" id="address" placeholder="' + mapOptions.inputText + '">\n\
                    <input class="btn btn-default" type="submit" id="' + mapOptions.bindSearchFeatureTo + '" value="' + mapOptions.searchButtonText + '">\n\
                </div>');
        }
        return this;
    };
    
    $j.fn.GoogleMapPlugin.createMap = function(options){        
        //Apply GoogleMap on source element
        this.korbanekMap = new KorbanekMap(options);        
        this.korbanekMap.embedMap();        
        this.korbanekMap.mapResize(this.korbanekMap.map);
        //Define default markers set
        if (this.korbanekMap.config.showAll){
            this.korbanekMap.config.defaultMarkerSet = this.korbanekMap.markerSet;
        }else{
            this.korbanekMap.config.defaultMarkerSet = this.korbanekMap.centralMarker;
        }
        //Put markers on the map
        this.korbanekMap.setupMarkersOnMap(this.korbanekMap.config.defaultMarkerSet, this.korbanekMap.map);
        
        return this;
    };
    
    $j.fn.GoogleMapPlugin.prototype.obtainOnClickEvent = function(){        
        var event = navigator.userAgent.match(/iphone|ipad/gi)
                ? "touchstart" 
                : "click";
        return event;
    };   
    
    $j.fn.GoogleMapPlugin.prototype.detectUserPosition = function(callback, navigatorOptions){   
        if (navigator.geolocation){
            navigator.geolocation.getCurrentPosition(function(position){
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                if (typeof callback !== 'function') {
                    callback = false;
                }
                else{                            
                    callback(pos);
                }
            }, function(err){
                console.warn('ERROR(' + err.code + '): ' + err.message);
                callback();
            }, navigatorOptions);                                                
        }
    };
        
    $j.fn.GoogleMapPlugin.prototype.retriveUserPosition = function(options, self, callback){
        this.detectUserPosition(function(pos){
            if(pos){
                options['mapZoom'] = 9;
                options['mapPosition'] = pos;
            }
            callback(self);
        }, defaults.navigatorOptions);        
    };   
    
  
}( jQuery ));