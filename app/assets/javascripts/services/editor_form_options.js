app.factory("EditorFormOptions", function() {

  var updateIntervals = [
    { value: 10,    label: "10 sec" },
    { value: 600,   label: "1 min" },
    { value: 6000,  label: "10 min" },
    { value: 36000, label: "1 hour" }
  ];

  var periods = [
    { value: "30-minutes", label: "Last 30 minutes" },
    { value: "60-minutes", label: "Last 60 minutes" },
    { value: "3-hours", label: "Last 3 hours" },
    { value: "12-hours", label: "Last 12 hours" },
    { value: "24-hours", label: "Last 24 hours" },
    { value: "today", label: "Today" },
    { value: "yesterday", label: "Yesterday" },
    { value: "3-days", label: "Last 3 days" },
    { value: "7-days", label: "Last 7 days" },
    { value: "this-week", label: "This Week" },
    { value: "previous-week", label: "Previous Week" },
    { value: "4-weeks", label: "Last 4 weeks" },
    { value: "this-month", label: "This Month" },
    { value: "previous-month", label: "Previous Month" },
    { value: "this-year", label: "This Year" },
    { value: "previous-year", label: "Previous Year" }
  ];

  var sizes = [
    { value: 1, label: "1 Column" },
    { value: 2, label: "2 Column" },
    { value: 3, label: "3 Column" }
  ];

  var graphTypes = [
    { value: "line",  label: "Line Graph" },
    { value: "area",  label: "Area Graph" }
  ];

  var aggregate_functions = [
    { value: "sum",    label: "Sum" },
    { value: "average",   label: "Average" }
  ];

  return {
    updateIntervals: updateIntervals,
    periods: periods,
    sizes: sizes,
    graphTypes: graphTypes,
    aggregate_functions: aggregate_functions
  };
});