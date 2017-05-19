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
        cInterface3.currentTimeType = "";
        cInterface3.currentUploaded = "";
        cInterface3.currentRegion = "";
        cInterface3.currentDifficulty = "";
        cInterface3.currentCategory = "";
        cInterface3.currentAuthor = "";

        // Ver los ingredientes que existen en la DB
        if ($location.hash().length > 0){
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
        }

        // Trae la receta actual
        if ($location.hash().length > 0){
            db.ref('db/recipes/' + $location.hash()).once('value', function(snapshot){
                cInterface3.currentRecipe = snapshot.val();
                for(myStep in cInterface3.currentRecipe.steps){
                    cInterface3.stepsList[myStep] = cInterface3.currentRecipe.steps[myStep];
                }
                cInterface3.addView();
                cInterface3.currentTimeType = Object.keys(cInterface3.currentRecipe.timeType)[0].charAt(0).toUpperCase() + Object.keys(cInterface3.currentRecipe.timeType)[0].slice(1);
                cInterface3.currentRegion = Object.keys(cInterface3.currentRecipe.region)[0].charAt(0).toUpperCase() + Object.keys(cInterface3.currentRecipe.region)[0].slice(1);
                cInterface3.currentDifficulty = Object.keys(cInterface3.currentRecipe.difficulty)[0].charAt(0).toUpperCase() + Object.keys(cInterface3.currentRecipe.difficulty)[0].slice(1);
                cInterface3.currentCategory = Object.keys(cInterface3.currentRecipe.category)[0].charAt(0).toUpperCase() + Object.keys(cInterface3.currentRecipe.category)[0].slice(1);
                cInterface3.currentAuthor = Object.keys(cInterface3.currentRecipe.author)[0].charAt(0).toUpperCase() + Object.keys(cInterface3.currentRecipe.author)[0].slice(1);
                cInterface3.currentUploaded = "" + new Date(cInterface3.currentRecipe.date).getDate() + "/" + (new Date(cInterface3.currentRecipe.date).getMonth() + 1) + "/" + new Date(cInterface3.currentRecipe.date).getFullYear();
            })
        }

        // Separa los pasos de las recetas para visualizarlos correctamente.
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

        if ($location.hash().length > 0){
            cInterface3.getRecipe();
        }

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

        // Incrementar la cantidad de vistas
        cInterface3.addView = function(){
            db.ref('db/recipes/' + $location.hash() + '/views').once('value').then(function(snapshot){
                var views = snapshot.val();
                ++views;
                db.ref('db/').child('recipes/' + $location.hash()).update({views:views});
            })
        }
        
    })
