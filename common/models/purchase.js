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
};
