angular
    .module("module-interface2", ['firebase'])
    .controller("controller-interface2", function($firebaseObject){
        var cInterface2 = this
        const rootRef = firebase.database().ref().child('db');
        const ref = rootRef.child('recipes');
        cInterface2.object = $firebaseObject(ref);
        cInterface2.allRecipes = new Object();
        cInterface2.allRecipesAux = new Object();

        // Traer todas las recetas
        cInterface2.bringEveryRecipe = function(){
            db.ref('db/recipes').once('value', function(snapshot){
                cInterface2.allRecipes = snapshot.val();
            })
        }

        // Traer solo las recetas que esten coincidentes con el filtro
        cInterface2.bringSomeRecipe = function(){
            for (ingredient in JSON.parse(localStorage.getItem("myData"))){
                db.ref('db/ingredients/' + ingredient + '/recipes').once('value', function(snapshot){
                    alert(ingredient);
                    for (key in snapshot.val()){
                        db.ref('db/recipes').child(key).once('value', function(snapshot){
                            cInterface2.allRecipes[key] = snapshot.val();
                        })
                    }
                })
            }
        }

/*
        db.ref('db/recipes').once('value').then(function(snapshot){
            for ()
            cInterface2.allRecipes[Object.keys(snapshot.val())] = {
                ingredients
            }
            console.log(snapshot.val());
        })
*/

        // Funcion para probar cosas con el boton
        cInterface2.testApp = function(){
            for (recipe in cInterface2.allRecipesAux){
                db.ref('db/recipes/' + recipe).once('value', function(snapshot){
                    cInterface2.allRecipes[recipe] = snapshot.val();
                })
            }
            console.log(JSON.parse(localStorage.getItem("myData")));
        }

        if (_.isEmpty(JSON.parse(localStorage.getItem("myData")))){
            cInterface2.bringEveryRecipe();
        }else{
            cInterface2.bringSomeRecipe();
        }

        // Envia al localStorage la receta seleccionada
        cInterface2.selectRecipe = function(index){
            localStorage.setItem("selectedRecipe", Object.keys(cInterface2.allRecipes)[index])
        }
    })