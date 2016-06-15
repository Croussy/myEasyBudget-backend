module.exports = function(Purchase) {

  Purchase.observe('after save', function(ctx, next) {
    var GoalCategory = ctx.Model.app.models.GoalCategory;
    GoalCategory.find({where: {id: ctx.instance.goalCategoryId}}, function(err, data) {
      for(var i = 0; i < data.length; i++) {
        data[i].amountCateg = data[i].amountCateg + ctx.instance.amountPurchase;
        data[i].save();
      }
    });
    next();
  });
};
