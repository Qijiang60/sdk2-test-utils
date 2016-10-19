describe('Rally.example.test.Grid', function() {

  var query;

  beforeEach(function() {
    query = Rally.test.Mock.ajax.whenQuerying('defect').respondWithCount(3);
  });

  pit('should query for blocked defects', function() {
    var app = Rally.test.Harness.launchApp('Rally.example.test.Grid');
    return onceFired(app, 'ready').then(function() {
      expect(query).toHaveBeenCalledOnce();
      var queryCall = query.firstCall.args[0];
      expect(queryCall.params.query).toBe('(Blocked = true)');
    });
  });

  pit('should query for blocked defects in a specific timebox scope', function() {
    var iteration = Rally.test.Mock.dataFactory.getRecord('iteration');
    var timeboxScope = Ext.create('Rally.app.TimeboxScope', { record: iteration });
    var appContext = Rally.test.Harness.getAppContext({
      timebox: timeboxScope
    });
    var app = Rally.test.Harness.launchApp('Rally.example.test.Grid', { context: appContext });
    return onceFired(app, 'ready').then(function() {
      expect(query).toHaveBeenCalledOnce();
      var queryCall = query.firstCall.args[0];
      expect(queryCall.params.query).toBe('((Blocked = true) AND ' + timeboxScope.getQueryFilter().toString() + ')');
    });
  });

  pit('should refresh when timebox scope changes', function() {
    var iteration = Rally.test.Mock.dataFactory.getRecord('iteration');
    var timeboxScope = Ext.create('Rally.app.TimeboxScope', { record: iteration });
    var appContext = Rally.test.Harness.getAppContext({
      timebox: timeboxScope
    });
    var app = Rally.test.Harness.launchApp('Rally.example.test.Grid', { context: appContext });
    return onceFired(app, 'ready').then(function() {
      var newIteration = Rally.test.Mock.dataFactory.getRecord('iteration');
      var newTimeboxScope = Ext.create('Rally.app.TimeboxScope', { record: newIteration });
      app.onTimeboxScopeChange(newTimeboxScope);
      return onceFired(app, 'ready').then(function() {
        expect(query).toHaveBeenCalledTwice();
        var queryCall = query.secondCall.args[0];
        expect(queryCall.params.query).toBe('((Blocked = true) AND ' + newTimeboxScope.getQueryFilter().toString() + ')');
      });
    });
  });
});
