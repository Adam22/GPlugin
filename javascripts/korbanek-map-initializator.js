$j = jQuery.noConflict();

$j(document).ready(function(){
    var $maps = $j('div[data-map-config]');

    if (!$maps.length) {
        return;
    }

    var apiKey = 'AIzaSyDdtjd2EThe9VTS2aiCllGq0GzZy28eKKs';
    $j.getScript('https://maps.googleapis.com/maps/api/js?key=' + apiKey, function() {
        $maps.each(function(){
            $j(this).GoogleMapPlugin();
        });
    });
});