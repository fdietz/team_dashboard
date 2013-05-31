app.factory("Dashboard", ["$resource", function($resource) {
  return $resource("/api/dashboards/:id", { id: "@id" },
  {
    'create':  { method: 'POST' },
    'index':   { method: 'GET', isArray: true },
    'show':    { method: 'GET', isArray: false },
    'update':  { method: 'PUT' },
    'destroy': { method: 'DELETE' }
  });
}]);