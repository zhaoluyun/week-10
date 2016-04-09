


/** Find all points within the box constructed */
function pointsWithin(rect) {
  // Grab the southwest and northeast points in this rectangle
  var sw = rect[0];
  var ne = rect[2];

  var sql = 'SELECT * FROM storefront_improvement WHERE the_geom @ ST_MakeEnvelope(' +
    sw.lng + ','+ sw.lat + ',' + ne.lng + ',' + ne.lat + ', 4326)';

  $.ajax('https://zhaoluyun.cartodb.com/api/v2/sql/?q=' + sql).done(function(results) {
    //console.log('pointsWithin:', results);
    addRecords(results);
  });
}



/** Filter by numeric-input*/
var sublayer= [];

$( "#go" ).click(function() {
  var sql = 'SELECT * FROM storefront_improvement WHERE (project_cost >= ' + $('#numeric-input').val() + ')';
  console.log(sql);
  $.ajax('https://zhaoluyun.cartodb.com/api/v2/sql/?q=' + sql).done(function(results) {
    addRecords(results);
  });

var layerUrl2 = 'https://zhaoluyun.cartodb.com/api/v2/viz/49be8078-fe87-11e5-aa42-0e3ff518bd15/viz.json';
  cartodb.createLayer(map, layerUrl2)
    .addTo(map)
    .on('done', function(layer) {
      sublayer = layer.getSubLayer(0);
      sublayer.setSQL('SELECT * FROM storefront_improvement WHERE (project_cost >= ' + $('#numeric-input').val() + ')');
      sublayer.on('featureClick', function(e, latlng, pos, data) {
      });
    }).on('error', function(err) {
      // console.log(err):
    });

});

$( "#clear" ).click(function() {
sublayer.remove();
$('#project-list').text('');
});



/**
 * function for adding one record
 *
 * The pattern of writing the function which solves for 1 case and then using that function
 *  in the definition of the function which solves for N cases is a common way to keep code
 *  readable, clean, and think-aboutable.
 */
function addOneRecord(rec) {
  var name = $('<p></p>')
    .text('Name: ' + rec.business_name);

  var corridor = $('<p></p>')
    .text('Location: ' + rec.corridor);

  var check_amount = $('<p></p>')
    .text('Check Amount: ' + rec.check_amount);


  var recordElement = $('<li></li>')
    .addClass('list-group-item')
    .append(name)
    .append(corridor)
    .append(check_amount);

  $('#project-list').append(recordElement);
}

/** Given a cartoDB resultset of records, add them to our list */
function addRecords(cartodbResults) {
  $('#project-list').empty();
  _.each(cartodbResults.rows, addOneRecord);
}
