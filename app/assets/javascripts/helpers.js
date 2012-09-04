(function($, _, Backbone, bootbox, collections, helpers) {
  "use strict";

  var colorPalette = [
    '#DEFFA1',
    // '#D26771',
    '#6CCC70',
    '#FF8900',
    '#A141C5',
    '#4A556C',
    '#239928'
  ];

  helpers.ColorFactory = {
    currentColorIndex: 0,
    get: function() {
      if (this.currentColorIndex >= colorPalette.length-1) {
        this.currentColorIndex = 0;
      }
      var color = colorPalette[this.currentColorIndex];
      this.currentColorIndex++;
      return color;
    }
  };

  helpers.TimeSelector = {
    getFrom: function(time, rangeString) {
      var range = this.getRange(rangeString);
      return Math.round((time - range) / 1000);
    },

    getPreviousFrom: function(time, rangeString) {
      var range = this.getRange(rangeString) * 2;
      return Math.round((time - range) / 1000);
    },

    getCurrent: function() {
      return Math.round((new Date()).getTime() / 1000);
    },

    getRange: function(rangeString) {
      var range = null;
      switch(rangeString) {
        case "30-minutes":
          range = 60*30;
          break;
        case "60-minutes":
          range = 60*60;
          break;
        case "3-hours":
          range = 60*60*3;
          break;
        case "12-hours":
          range = 60*60*12;
          break;
        case "24-hours":
          range = 60*60*24;
          break;
        case "3-days":
          range = 60*60*24*3;
          break;
        case "7-days":
          range = 60*60*24*7;
          break;
        case "4-weeks":
          range = 60*60*24*7*4;
          break;
        default:
          throw "Unknown rangeString: " + rangeString;
      }
      return range * 1000;
    }
  };

  helpers.FormBuilder = {
    options: function(sources, options) {
      options = options || {};
      var result = "";
      if (options.emptyOption === true) {
        result += "<option></option>";
      }

      _.each(sources, function(source) {
        if (source.available) {
          result += "<option>" + source.name + "</option>";
        } else {
          result += "<option disabled>" + source.name + "</option>";
        }
      });
      return result;
    }
  };

  helpers.FormDefaults = {

    getUpdateIntervalOptions: function() {
      return [
        { val: 10, label: '10 sec' },
        { val: 600, label: '1 min' },
        { val: 6000, label: '10 min' },
        { val: 36000, label: '1 hour' }
      ];
    },

    getPeriodOptions: function() {
      return [
        { val: "30-minutes", label: "Last 30 minutes" },
        { val: "60-minutes", label: "Last 60 minutes" },
        { val: "3-hours", label: "Last 3 hours" },
        { val: "12-hours", label: "Last 12 hours" },
        { val: "24-hours", label: "Last 24 hours" },
        { val: "3-days", label: "Last 3 days" },
        { val: "7-days", label: "Last 7 days" },
        { val: "4-weeks", label: "Last 4 weeks" }
      ];
    }
  };

  // make bootbox available in helper namespace
  helpers.bootbox = bootbox;

  // pool of datapoints targets collection
  // TODO: fetch fresh collection here instead of Backbone View
  helpers.DatapointsTargetsPool = function() {
    this.pool = {};
  };

  helpers.DatapointsTargetsPool.prototype.get = function(source) {
    var result = null;
    if (this.pool[source]) {
      result = this.pool[source];
    } else {
      result = this.pool[source] = new collections.DatapointsTarget({ source: source});
    }

    return result;
  };

})($, _, Backbone, bootbox, app.collections, app.helpers);
