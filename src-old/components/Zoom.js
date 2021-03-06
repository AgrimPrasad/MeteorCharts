(function() {
  var CONTENT_DBLCLICK = 'contentDblclick',
      MIN_ZOOM_SIZE = 20,

      startDistance = null;

  MeteorCharts.Zoom = function(chart) {
    this.chart = chart;
    this.selecting = false;
    this.startX = 0;
    this.startY = 0;
    this.rect = new Kinetic.Rect({listening: false});

    chart.interactionLayer.add(this.rect);

    this._bind();
  };

  MeteorCharts.Zoom.prototype = {
    reset: function() {
      this.rect.setAttrs(MeteorCharts.Util.merge(
        this.chart._view.get('zoom', 'selection'),
        {
          width: 0,
          height: 0
        }
      ));
    },
    _bind: function() {
      var that = this,
          chart = this.chart,
          stage = chart.stage,
          _view = chart._view;

      stage.on(CONTENT_DBLCLICK, function() {
        chart.minX = null;
        chart.minY = null;
        chart.maxX = null;
        chart.maxY = null;
        chart.draw();
      });
    },
    _startZoomSelect: function() {
      var chart = this.chart,
          pos = chart.stage.getPointerPosition(),
          view = chart.view,
          type = chart._view.get('zoom', 'type');

      this.selecting = true;
      this.startX = pos.x;
      this.startY = type === 'box' ? pos.y : chart.dataY;
      this.rect.setPosition(this.startX, this.startY);
    },
    _resizeZoomSelect: function() {
      var rect = this.rect,
          chart = this.chart,
          pos, view, type;

      if (this.selecting) {
          pos = chart.stage.getPointerPosition();
          view = chart.view;
          type = chart._view.get('zoom', 'type');

        this.rect.setWidth(pos.x - this.startX);
        this.rect.setHeight(type === 'box' ? pos.y - this.startY : chart.dataHeight);

        if (!rect.isVisible()) {
          rect.setVisible(true);
        }
      }
    },
    _pinch: function(evt) {
      var touch1 = evt.touches[0],
          touch2 = evt.touches[1],
          dist = 0,
          diff = 0;

      if(touch1 && touch2) {
        dist = MeteorCharts.Util.getDistance({
          x: touch1.clientX,
          y: touch1.clientY
        }, {
          x: touch2.clientX,
          y: touch2.clientY
        });

        if (startDistance === null) {
          startDistance = dist;
        }

        diff = startDistance - dist;

        //alert(diff);
      }
    },
    _endZoomSelect: function() {
      this.selecting = false;
      this._updateMinMax();
      this.startX = 0;
      this.startY = 0;
      this.rect.setSize(0);
      this.rect.setVisible(false);
    },
    _updateMinMax: function() {
      var chart = this.chart,
          bounds = chart.bounds,
          view = chart.view,
          _view = chart._view,
          type = chart._view.get('zoom', 'type');
          pos = chart.stage.getPointerPosition(),
          startX = this.startX,
          startY = this.startY,
          rect = this.rect,
          chartMinX = Math.min(startX, pos.x),
          chartMinY = type === 'box' ? Math.max(startY, pos.y) : chart.dataY + chart.dataHeight,
          chartMaxX = Math.max(startX, pos.x),
          chartMaxY = type === 'box' ? Math.min(startY, pos.y) : chart.dataY,
          min = chart.chartToData({x:chartMinX, y:chartMinY}),
          max = chart.chartToData({x:chartMaxX, y:chartMaxY});

      //console.log(min.x + ',' + max.x);
      //console.log(min.y + ',' + max.y)

      if (Math.abs(chartMaxX - chartMinX) > MIN_ZOOM_SIZE && Math.abs(chartMaxY - chartMinY) > MIN_ZOOM_SIZE) {
        chart.minX = min.x;
        chart.minY = min.y;
        chart.maxX = max.x;
        chart.maxY = max.y;
        chart.draw();
      }

    }
  };
})();