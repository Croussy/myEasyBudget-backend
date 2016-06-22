module.exports = function(Budget) {
  Budget.updateAmount = function(id, amount, cb) {
    Budget.find({where: {id: id}}, function(err, data) {
      data[0].amount += amount;
      data[0].save();
    });
    cb(null, 'Done !');
  };

  Budget.remoteMethod(
    'updateAmount',
    {
      accepts: [
        {arg: 'id', type: 'string', required: true},
        {arg: 'amount', type: 'number', required: true}
      ] ,
      returns: {arg: 'greeting', type: 'string'}
    }
  );
};
