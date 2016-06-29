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

  Budget.observe('after save', function(ctx, next) {
    if(ctx.isNewInstance) {
      var GoalCategory = ctx.Model.app.models.GoalCategory;
      var Category = ctx.Model.app.models.Category;

      Category.find({where: {nameCategory: "Autre catégorie"}}, function(err, data) {
        GoalCategory.updateOrCreate({
         "targetAmountCateg": ctx.instance.amount,
         "amountCateg": null,
         "nameCategory": data[0].nameCategory,
         "budgetId": ctx.instance.id,
         "categoryId": data[0].id
        });
      });
    }
    next();
  });
};
