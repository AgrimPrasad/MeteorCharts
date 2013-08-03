(function() {
  var DEFAULT = {
    backgroundColor: 'black',
    width: 900,
    height: 450,
    text: {
      fill: '#ccc',
      fontSize: 16
    },
    title: {
      text: {
        fontSize: 24
      }
    },
    legend: {
      text: {
        fontSize: 20
      },
      spacing: 20
    },
    xAxis: {
      min: 'auto',
      max: 'auto',
      maxNumberOfLabels: 10,
      lines: {
        stroke: '#555',
        strokeWidth: 2
      }
    },
    yAxis: {
      min: 'auto',
      max: 'auto',
      maxNumberOfLabels: 8,
      lines: {
        stroke: '#555',
        strokeWidth: 2
      }
    },
    data: [
      {
        stroke: '#afe225' // light green
      },
      {
        stroke: '#76d0ff' // light blue
      },
      {
        stroke: '#fc009a' // pink
      }
    ],
    tooltip: {
      text: {
        fill: 'black',
        fontSize: 16,
        padding: 2
      },
      tag: {
        fill: '#e8e8e8'
      }
    },
    zoom: {
      type: 'box',
      selection: {
        fill: 'white',
        opacity: 0.3
      }
    }
  };

  MeteorCharts.View = function(chart) {
    this.chart = chart;
  };

  MeteorCharts.View.prototype = {
    /*
    * @example get('tooltip', 'text', 'fill');
    */
    get: function() {
      var config = this.chart.view,
          len = arguments.length,
          n, obj;

      // try to access config attr
      obj = config;
      for (n=0; n<len; n++) {
        obj = obj[arguments[n]];
        if (obj === undefined) {
          break;
        }
      }

      if (n === len) {
        return obj;
      }

      // try to access default attr
      obj = DEFAULT;
      for (n=0; n<len; n++) {
        obj = obj[arguments[n]];
        if (obj === undefined) {
          break;
        }
      }

      if (n === len) {
        return obj;
      }

      // invalid attr path
      else {
        return null;
      }
    },
    getText: function() {
      var textObj = this.get.apply(this, arguments);
      return MeteorCharts.Util.merge(this.get('text'), textObj);
    },
    /*
    * @example set('legend', 'text', 'fontSize', 16);
    */
    set: function() {
      var view = this.chart.view,
          a0 = arguments[0],
          a1 = arguments[1],
          a2, a3;

      switch (arguments.length) {
        case 2: 
          view[a0] = a1;
          break;
        case 3: 
          a2 = arguments[2];
          if (view[a0] === undefined) {
            view[a0] = {};
          }
          view[a0][a1] = a2;
          break;
        case 4:
          a2 = arguments[2];
          a3 = arguments[3];
          if (view[a0] === undefined) {
            view[a0] = {};
          }
          if (view[a0][a1] === undefined) {
            view[a0][a1] = {};
          }
          view[a0][a1][a2] = a3;
          break; 
      }

    },
    getDataStyle: function(n) {
      var data = this.get('data'),
          len = data.length;

      return data[n % len];
    },
  };
})();