$(function() {
// inspired by http://ensign.editme.com/t43dances
  var width = 500;
  var height = 500;
  var easeparam = "linear";

  var svg = d3.select("#box").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g");

  var circleData = [];

  // inner planet
  var t_circle = d3.map();
  t_circle.set("id", 1);
  t_circle.set("cr", 20);
  t_circle.set("rotr", 107.03);
  t_circle.set("rtype", "circle");
  t_circle.set("offset", 0);
  var timeparam1 = 1957.46;
  var x1 = width/2 + 50;
  var y1 = height/2;

  circleData.push(t_circle);

  // outer planet
  t_circle = d3.map();
  t_circle.set("id", 2);
  t_circle.set("cr", 30);
  t_circle.set("rotr", 200);
  t_circle.set("rtype", "circle");
  t_circle.set("offset", 0);
  var timeparam2 = 5000;
  var x2 = width/2 + 200;
  var y2 = height/2;

  circleData.push(t_circle);



  // Add each of the two circles:
  var circle = svg.selectAll("circle")
    .data(circleData, function(d) { return d.get('id');})
    .enter()
    .append("circle")
    .attr("r", function(d){ return d.get('cr'); });

  var planet1Rotation = function() {
    // Setup each circle with a transition, each transition working on transform attribute,
    // and using the translateFn
    d3.select(circle[0][0])
      .transition()
      .duration(timeparam1)
      .ease(easeparam)
      .attrTween("transform", translateFn());
  }

  var planet2Rotation = function() {
    // Setup each circle with a transition, each transition working on transform attribute,
    // and using the translateFn
    d3.select(circle[0][1])
      .transition()
      .duration(timeparam2)
      .ease(easeparam)
      .attrTween("transform", translateFn());
  }

  var count = 0;
  planet1Rotation();
  planet2Rotation();
  var intervalPlanet1 = setInterval(function() {
    planet1Rotation();
    count++;
    console.log(count);
    if (count == 22) {
      stopInterval();
    }
  }, timeparam1);

  var intervalPlanet2 = setInterval(function() {
    planet2Rotation();
  }, timeparam2);


  var stopInterval = function() {
    clearInterval(intervalPlanet1);
    clearInterval(intervalPlanet2);
  };

  var sampling = 0;
  var colors = [
    '#393b79',
    '#5254a3',
    '#6b6ecf',
    '#9c9ede',
    '#637939',
    '#8ca252',
    '#b5cf6b',
    '#cedb9c',
    '#8c6d31',
    '#bd9e39',
    '#e7ba52',
    '#e7cb94',
    '#843c39',
    '#ad494a',
    '#d6616b',
    '#e7969c',
    '#7b4173',
    '#a55194',
    '#ce6dbd',
    '#de9ed6'
  ]
  var x1_old, x2_old, y1_old, y2_old;

  // The function that actually does the moving:
  function translateFn() {
    // We only use 'd', but list d,i,a as params just to show can have them as params.
    // Code only really uses d and t.
    return function(d, i, a) {
      return function(t) {
        // 't': what's t? T is the fraction of time (between 0 and 1) since the
        // transition began. Handy. 
        var t_offset = d.get('offset');
        var t_x, t_y;
        
        // If the data says the element should follow a circular path, do that.
        if (d.get('rtype') == 'circle'){
          var rotation_radius = d.get('rotr');
          var t_angle = (2 * Math.PI) * t;
          var t_x = rotation_radius * Math.cos(t_angle);
          var t_y = rotation_radius * Math.sin(t_angle);
        }

        var x = (width/2) + t_offset + t_x;
        var y = (height/2 + t_offset + t_y);
        if (d._.id == 1) {
          x1_old = x1;
          y1_old = y1;
          x1 = x;
          y1 = y;
          sampling ++;
          if (sampling % 4 == 0 &&
              (x1_old != x1 && x2_old != x2 &&
               y2_old != y2 && y1_old != y1)) {
            x2_old = x2;
            y2_old = y2;

            var color = colors[sampling % colors.length]
            var line = svg.append('line')
              .attr("x1", x1)
              .attr("y1", y1)
              .attr("x2", x2)
              .attr("y2", y2)
              .attr("stroke-width", 1)
              .attr("stroke", "black");
          }
        } else {
          x2_old = x2;
          y2_old = y2;
          x2 = x;
          y2 = y;
        }
        return "translate(" + x + "," + y + ")";
      };
    };
  }

});
