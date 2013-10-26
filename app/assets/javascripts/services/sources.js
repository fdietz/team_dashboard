app.factory("Sources", ["System", function(System) {

    // TODO: kind mismatch graph/datapoints
  function kindMapping(kind) {
    if (kind === "graph") kind = "datapoints";
    if (kind === "meter") kind = "number";
    return kind;
  }

  function sourceConfig(widget) {
    return System.sources[kindMapping(widget.kind)][widget.source];
  }

  function sourceMapping(source) {
    return {
      value: source.name,
      label: source.name,
      disabled: !source.available,
      supports_functions: source.supports_functions,
      supports_target_browsing: source.supports_target_browsing
    };
  }

  // TODO: handle disabled sources
  // disabled attribute not available in current Angular select ng-options directive
  function availableSources(kind) {
    var sources = System.sources[kindMapping(kind)];

    return _.compact(_.map(sources, function(source) {
      if (source.available) return sourceMapping(source);
    }));
  }

  function supportsTargetBrowsing(widget) {
    var config = sourceConfig(widget);
    return config ? config.supports_target_browsing : false;
  }

  return {
    kindMapping: kindMapping,
    availableSources: availableSources,
    supportsTargetBrowsing: supportsTargetBrowsing
  };

}]);
