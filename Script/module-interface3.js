angular
    .module("module-interface3", [])
    .controller("controller-interface3", function(){
        var cInterface3 = this;
        cInterface3.ingredientsList = new Object();
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
        
        setTimeout(function(){
            for(var ingredient in cInterface3.ingredientsList){
                console.log(cInterface3.ingredientsList[ingredient]);
            }
        }, 3000);
    })