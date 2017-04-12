angular
    .module("module-interface2", ['firebase'])
    .controller("controller-interface2", function($firebaseObject){
        var cInterface2 = this
        const rootRef = firebase.database().ref().child('db');
        const ref = rootRef.child('recipes');
        cInterface2.object = $firebaseObject(ref);
        cInterface2.allRecipes = new Object();
        cInterface2.allRecipesAux = new Object();
        cInterface2.extraIngredientsAllowed = 1;

        // Traer todas las recetas
        cInterface2.bringEveryRecipe = function(){
            db.ref('db/recipes').once('value', function(snapshot){
                cInterface2.allRecipes = snapshot.val();
            })
        }

        // Traer solo las recetas que esten coincidentes con el filtro
        cInterface2.bringSomeRecipe = function(){
            for (ingredient in JSON.parse(localStorage.getItem("myData"))){
                db.ref('db/ingredients/' + ingredient + '/recipes').once('value').then(function(snapshot){
                    for (key in snapshot.val()){
                        db.ref('db/recipes/').child(key).once('value', function(snap){
                            cInterface2.allRecipesAux[key] = snap.val().ingredients;
                        })
                    }
                    for (recipe in cInterface2.allRecipesAux){
                        var extraIngredients = 0;
                        for (ingredients in cInterface2.allRecipesAux[recipe]){
                            if (!(localStorage.getItem("myData")).includes(ingredients)){
                                extraIngredients++;
                            }
                        }
                        if (extraIngredients <= cInterface2.extraIngredientsAllowed){
                            cInterface2.allRecipes[recipe] = true;
                            db.ref('db/recipes/').child(recipe).once('value', function(snapshot){
                                cInterface2.allRecipes[recipe] = snapshot.val();
                                
                            })
                        }
                    }
                })
            }
        }

        // Envia al localStorage la receta seleccionada
        cInterface2.selectRecipe = function(index){
            localStorage.setItem("selectedRecipe", Object.keys(cInterface2.allRecipes)[index])
        }

        if (_.isEmpty(JSON.parse(localStorage.getItem("myData")))){
            cInterface2.bringEveryRecipe();
        }else{
            cInterface2.bringSomeRecipe();
        }
    })