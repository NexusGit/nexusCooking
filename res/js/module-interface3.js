angular
    .module("module-interface3", ['firebase'])
    .controller("controller-interface3", function($firebaseObject, $location){
        var cInterface3 = this;
        const rootRef = firebase.database().ref().child('db');
        const ref = rootRef.child('recipes');
        cInterface3.object = $firebaseObject(ref);
        cInterface3.currentRecipe = new Object();
        cInterface3.ingredientsList = new Object();
        cInterface3.stepsList = new Object();
        cInterface3.amount = 4;

        // Ver los ingredientes que existen en la DB
        db.ref('db/recipes/' + $location.hash() + '/ingredients').once('value', function(snapshot){
            for (myIngredient in snapshot.val()){
                db.ref('db/recipes/' + $location.hash() + '/ingredients/' + myIngredient + '/').once('value', function(snapshot){
                    cInterface3.ingredientsList[snapshot.key] = {
                        amount:snapshot.val().amount,
                        name:snapshot.val().name,
                        unit:snapshot.val().unit
                    }
                })
            }
        })

        // Trae la receta actual
        db.ref('db/recipes/' + $location.hash()).once('value', function(snapshot){
            cInterface3.currentRecipe = snapshot.val();
            for(myStep in cInterface3.currentRecipe.steps){
                cInterface3.stepsList[myStep] = cInterface3.currentRecipe.steps[myStep];
            }
        })

        cInterface3.setRecipes = function(snapshot){
            cInterface3.currentRecipe = snapshot.val();
            for(myStep in cInterface3.currentRecipe.steps){
                cInterface3.stepsList[myStep] = cInterface3.currentRecipe.steps[myStep];
            }
            return true
        }

        cInterface3.getRecipe = function(){
            return db.ref('db/recipes/' + $location.hash()).once('value').then(cInterface3.setRecipes);
        }

        cInterface3.getRecipe();

        // Less amount
        cInterface3.lessAmount = function(){
            if (cInterface3.amount > 1){
                cInterface3.amount--;
            }
        }

        // More amount
        cInterface3.moreAmount = function(){
            cInterface3.amount++;
        }
    })