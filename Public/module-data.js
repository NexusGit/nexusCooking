angular
    .module("module-data", [])
    .controller("controller-data", function(){
        var cData = this;
        cData.difficulty_=0;
        cData.image_="";
        cData.name_="";
        cData.regions_="";
        cData.steps_="";
        cData.time_=0;
        cData.timeType_="";
        cData.category_="";
        cData.ingredientsList = [];
        cData.ingredientsListAdded = [];

        cData.addIngredients = function(){
            var data = cData.ingredient_;
            cData.ingredientsListAdded.push(data);
            cData.ingredientsList.splice(cData.ingredientsList.indexOf(data), 1);
        }

        cData.getRecipe = function(){
            db.ref('db/recipes/').once('value', function(snapshot){
                for (myRecipe in snapshot.val()){
                    db.ref('db/recipes/' + myRecipe + '/').once('value', function(snapshot){
                        console.log(snapshot.val());
                    })
                }
            })
        }

        cData.getIngredient = function(){
            db.ref('db/ingredients/').once('value', function(snapshot){
                for (myIngredient in snapshot.val()){
                    db.ref('db/ingredients/' + myIngredient + '/').once('value', function(snapshot){
                        cData.ingredientsList.push(snapshot.val().name);
                    })
                }
            })
        }

// Falta ingredients
// date: Firebase.ServerValue.TIMESTAMP
// ref.orderByChild('date').on('child_added', function(snapshot) {});
// gramos, mililitros, cucharada(s), taza(s), pizca(s)

        cData.addRecipe = function(){
            var newRecipe = {
                author:{
                    admin:true
                },
                favorites:0,
                image:cData.image_,
                ingredients:{},//loop in array from front
                name:cData.name_,
                stars:0,
                steps:cData.steps_,
                time:cData.time_,
                votes:0,
                difficulty:{
                    [cData.difficulty_]:true
                },
                region:{
                    [cData.regions_]:true
                },
                category:{
                    [cData.category_]:true
                },
                timeType:{
                    [cData.timeType_]:true
                }
            };

            var newRecipeKey = db.ref('db/').child('recipes').push().key;
            db.ref('db/recipes/' + newRecipeKey).update(newRecipe);

            db.ref('db/difficulties/' + cData.difficulty_ + '/recipes').update({[newRecipeKey]:true})
            db.ref('db/regions/' + cData.regions_ + '/recipes').update({[newRecipeKey]:true})
            db.ref('db/timeTypes/' + cData.timeType_ + '/recipes').update({[newRecipeKey]:true})
            db.ref('db/categories/' + cData.category_ + '/recipes').update({[newRecipeKey]:true})
/*
            // Difficulties
            db.ref('db/recipes/' + newRecipeKey + '/difficulty/' + cData.difficulty_ + '/').update({isValue:true})
            db.ref('db/difficulties/' + cData.difficulty_ + '/recipes/' + newRecipeKey).update({isValue:true})
            // Regions
            db.ref('db/recipes/' + newRecipeKey + '/region/' + cData.regions_ + '/').update({isValue:true})
            db.ref('db/regions/' + cData.regions_ + '/recipes/' + newRecipeKey).update({isValue:true})
            // TimeTypes
            db.ref('db/recipes/' + newRecipeKey + '/timeType/' + cData.timeType_ + '/').update({isValue:true})
            db.ref('db/timeTypes/' + cData.timeType_ + '/recipes/' + newRecipeKey).update({isValue:true})
            // Categories
            db.ref('db/recipes/' + newRecipeKey + '/category/' + cData.category_ + '/').update({isValue:true})
            db.ref('db/categories/' + cData.category_ + '/recipes/' + newRecipeKey).update({isValue:true})
*/

/*
                .then(function(){
                    alert("Se cargo con exito la receta.");
                })
                .catch(function(e){
                    alert("Error en la carga de datos: " + e);
                });
*/
        }
    })
    .controller("controller-ingredients", function(){
        var cIngredients = this;
        cIngredients.name_="";

        cIngredients.addIngredient = function(){
            var newIngredient = {
                name:cIngredients.name_
            };
            var newIngredientKey = db.ref('db/').child('ingredients').push().key;
            db.ref('db/ingredients/' + newIngredientKey).update(newIngredient);
        }
    });