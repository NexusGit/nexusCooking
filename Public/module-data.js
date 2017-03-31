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
        cData.ingredientsList = new Object();
        cData.ingredientsListAdded = new Object();

        // Ver los ingredientes que existen en la DB
        db.ref('db/ingredients/').orderByChild('name').once('value', function(snapshot){
            for (myIngredient in snapshot.val()){
                db.ref('db/ingredients/' + myIngredient + '/').once('value', function(snapshot){
                    cData.ingredientsList[snapshot.key] = snapshot.val().name;
                })
            }
        })

        // Agrega un ingrediente seleccionado del select al arreglo
        cData.addIngredient = function(){
            cData.ingredientsListAdded[cData.ingredient_] = {
                name:cData.ingredientsList[cData.ingredient_],
                amount:cData.amount,
                unit:cData.unit
            }
        }

        // Quita un ingrediente de la lista de ingredientes añadidos
        cData.removeIngredient = function(){
            delete cData.ingredientsListAdded[cData.ingredientToRemove];
        }

        // Muestra por consola las recetas TESTING
        cData.getRecipe = function(){
            db.ref('db/recipes/').once('value', function(snapshot){
                for (var myRecipe in snapshot.val()){
                    db.ref('db/recipes/' + myRecipe + '/').once('value', function(snapshot){
                        console.log(snapshot.val());
                    })
                }
            })
        }

        // Carga en la lista los ingredientes de la DB
        cData.getIngredient = function(){
            db.ref('db/ingredients/').orderByValue('name').once('value', function(snapshot){
                for (myIngredient in snapshot.val()){
                    db.ref('db/ingredients/' + myIngredient + '/').orderByValue('name').once('value', function(snapshot){
                        cData.ingredientsList.push(snapshot.val().name);
                    })
                }
            })
        }

        // Agrega una nueva receta segun lo ingresado en la vista
        cData.addRecipe = function(){
            var newRecipe = {
                author:{
                    admin:true
                },
                favorites:0,
                image:localStorage.getItem('currentURLimg'),
                name:cData.name_,
                stars:0,
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

            db.ref('db/names/' + cData.name_ + '/recipes').update({[newRecipeKey]:true})
            db.ref('db/difficulties/' + cData.difficulty_ + '/recipes').update({[newRecipeKey]:true})
            db.ref('db/regions/' + cData.regions_ + '/recipes').update({[newRecipeKey]:true})
            db.ref('db/timeTypes/' + cData.timeType_ + '/recipes').update({[newRecipeKey]:true})
            db.ref('db/categories/' + cData.category_ + '/recipes').update({[newRecipeKey]:true})
            var stepsArray = cData.steps_.split("\n");
            for (var i = 1; i <= stepsArray.length; i++){
                db.ref('db/recipes/' + newRecipeKey + '/steps').update({[i]:stepsArray[i - 1]});
            }
            db.ref('db/recipes/' + newRecipeKey + '/ingredients/').update(cData.ingredientsListAdded);
            for (ingredient in cData.ingredientsListAdded){
                db.ref('db/ingredients/' + ingredient + '/recipes').update({[newRecipeKey]:true});
            }
            return true
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