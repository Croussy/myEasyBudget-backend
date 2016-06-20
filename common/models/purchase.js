module.exports = function(Purchase) {

  Purchase.observe('after save', function(ctx, next) {
    var GoalCategory = ctx.Model.app.models.GoalCategory;
    var Budget = ctx.Model.app.models.Budget;

    GoalCategory.find({where: {id: ctx.instance.goalCategoryId}}, function(err, data) {
      data[0].amountCateg += ctx.instance.amountPurchase;
      data[0].save();
    });

    Budget.find({where: {id: ctx.instance.budgetId}}, function(err, data) {
      data[0].amount -=  ctx.instance.amountPurchase;
      data[0].save();
    });
    next();
  });

  Purchase.observe('before delete', function(ctx, next) {
    var Purchase = ctx.Model.app.models.Purchase;
    var GoalCategory = ctx.Model.app.models.GoalCategory;
    var Budget = ctx.Model.app.models.Budget;

    Purchase.find({where: {id: ctx.where.id}}, function(err, data) {
      var purchase = data[0];
      GoalCategory.find({where: {id: purchase.goalCategoryId}}, function(err, data) {
        data[0].amountCateg -= purchase.amountPurchase;
        data[0].save();
      });

      Budget.find({where: {id: purchase.budgetId}}, function(err, data) {
        data[0].amount +=  purchase.amountPurchase;
        data[0].save();
      });
    });
    next();
  });
};
