module.exports = function(GoalCategory) {
  GoalCategory.updateAmountOtherGoalCategory = function(budget_id, amount, cb) {
    GoalCategory.find({where: {nameCategory: "Autre catégorie", budgetId: budget_id}}, function(err, data) {
      data[0].targetAmountCateg += amount;
      data[0].save();
    });
    cb(null, 'Done !');
  };

  GoalCategory.remoteMethod(
    'updateAmountOtherGoalCategory',
    {
      accepts: [
        {arg: 'budget_id', type: 'string', required: true},
        {arg: 'amount', type: 'number', required: true}
      ] ,
      returns: {arg: 'greeting', type: 'string'}
    }
  );

  GoalCategory.observe('after save', function(ctx, next) {
    if(ctx.instance.nameCategory != 'Autre catégorie') {
      GoalCategory.find({where: {nameCategory: "Autre catégorie", budgetId: ctx.instance.budgetId}}, function(err, data) {
        data[0].targetAmountCateg -= ctx.instance.targetAmountCateg;
        data[0].save();
      });
    }
    next();
  });

  GoalCategory.observe('before delete', function(ctx, next) {
    if(ctx.where.id) {
      var GoalCategoryModel = ctx.Model.app.models.GoalCategory;
      GoalCategoryModel.find({where: {id: ctx.where.id}}, function(err, data) {
        var goal = data[0];
        if(goal.nameCategory != "Autre catégorie") {
          GoalCategoryModel.find({where: {nameCategory: "Autre catégorie", budgetId: goal.budgetId}}, function(err, data) {
            data[0].targetAmountCateg += goal.targetAmountCateg;
            data[0].save();
          });
        }
      });
    }
    next();
  });
};
