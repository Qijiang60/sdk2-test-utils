describe('Rally.example.test.Crud', function() {

  var defect = {
    _ref: '/defect/12345',
    ObjectID: 12345,
    Name: 'Server crash',
    State: 'Open',
    Description: 'Worst defect ever'
  };

  var create, read, update;

  beforeEach(function() {
    create = Rally.test.Mock.ajax.whenCreating('defect').respondWith(defect);

    read = Rally.test.Mock.ajax.whenReading('defect', defect.ObjectID).respondWith(defect);

    update = Rally.test.Mock.ajax.whenUpdating('defect', defect.ObjectID)
      .respondWith(Ext.apply({}, defect, { State: 'Fixed'}));
  });

  pit('should create a defect', function() {
    var app = Rally.test.Harness.launchApp('Rally.example.test.Crud');
    return onceCalled(create).then(function() {
      var createCall = create.firstCall.args[0];
      expect(createCall.jsonData.Defect.Name).toBe('Server crash');
    });
  });

  pit('should read the defect', function() {
    var app = Rally.test.Harness.launchApp('Rally.example.test.Crud');
    return onceCalled(read).then(function() {
      var readCall = read.firstCall.args[0];
      expect(readCall.params.fetch.split(',')).toEqual(['Name', 'State', 'Owner']);
    });
  });

  pit('should update the defect', function() {
    var app = Rally.test.Harness.launchApp('Rally.example.test.Crud');
    return onceCalled(update).then(function() {
      var updateCall = update.firstCall.args[0];
      expect(updateCall.jsonData.Defect.State).toBe('Fixed');
    });
  });

  describe('when deleting the defect', function() {
    var del;
    
    pit('should handle success', function() {
      del = Rally.test.Mock.ajax.whenDeleting('defect', defect.ObjectID).respondWith();
      var onDeleteSuccess = Rally.test.Mock.stub();
      var onDeleteFail = Rally.test.Mock.stub();
      var app = Rally.test.Harness.launchApp('Rally.example.test.Crud', {
        listeners: {
          complete: onDeleteSuccess,
          error: onDeleteFail
        }
      });
      return onceCalled(del).then(function() {
        expect(onDeleteSuccess).toHaveBeenCalledOnce();
        expect(onDeleteFail).not.toHaveBeenCalled();
      });
    });

    pit('should handle error', function() {
      del = Rally.test.Mock.ajax.whenDeleting('defect', defect.ObjectID).errorWith('something bad happened');
      var onDeleteSuccess = Rally.test.Mock.stub();
      var onDeleteFail = Rally.test.Mock.stub();
      var app = Rally.test.Harness.launchApp('Rally.example.test.Crud', {
        listeners: {
          complete: onDeleteSuccess,
          error: onDeleteFail
        }
      });
      return onceCalled(del).then(function() {
        expect(onDeleteFail).toHaveBeenCalledOnce();
        expect(onDeleteSuccess).not.toHaveBeenCalled();
      });
    });
  });
});
