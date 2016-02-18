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
        $j(this).GoogleMapPlugin.searchFeatureUI(mapOptions, that)
    };
    
    //Insert Search Field
    $j.fn.GoogleMapPlugin.searchFeatureUI = function(mapOptions, element){
        if(mapOptions.searchFeature){
            $j(element).parent().before(
                '<form role="form">\n\
                    <div class="form-group">\n\
                        <label for="' + mapOptions.bindSearchFeatureTo + '">' + mapOptions.inputLabel + '</label>\n\
                        <input type="text" class="form-control" id="address" placeholder="' + mapOptions.inputText + '">\n\
                        <button id="' + mapOptions.bindSearchFeatureTo + ' type="submit" class="btn btn-default">' + mapOptions.searchButtonText + '</button>\n\                        \n\
                    </div>\n\
                </form>');
        }
        return this;
    };
}( jQuery ));