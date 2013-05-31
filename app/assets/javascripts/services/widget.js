app.factory("Widget", ["$resource", function($resource) {
  return $resource("/api/dashboards/:dashboard_id/widgets/:id", { id: "@id", dashboard_id: "@dashboard_id" },
    {
      'create':  { method: 'POST' },
      'index':   { method: 'GET', isArray: true },
      'show':    { method: 'GET', isArray: false },
      'update':  { method: 'PUT' },
      'destroy': { method: 'DELETE' }
    }
  );
}]);