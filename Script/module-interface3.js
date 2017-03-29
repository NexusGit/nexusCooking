angular
    .module("module-interface3", [])
    .controller("controller-interface3", function(){
        var cInterface3 = this;
        cInterface3.currentRecipe = new Object();
        cInterface3.ingredientsList = new Object();
        cInterface3.stepsList = new Object();

        // Ver los ingredientes que existen en la DB
        db.ref('db/recipes/testingRecipe/ingredients').once('value', function(snapshot){
            for (myIngredient in snapshot.val()){
                db.ref('db/recipes/testingRecipe/ingredients/' + myIngredient + '/').once('value', function(snapshot){
                    cInterface3.ingredientsList[snapshot.key] = {
                        amount:snapshot.val().amount,
                        name:snapshot.val().name,
                        unit:snapshot.val().unit
                    }
                })
            }
        })

        // Trae la receta actual
        db.ref('db/recipes/testingRecipe').once('value', function(snapshot){
            cInterface3.currentRecipe = snapshot.val();
            for(myStep in cInterface3.currentRecipe.steps){
                cInterface3.stepsList[myStep] = cInterface3.currentRecipe.steps[myStep];
            }
        })
    })