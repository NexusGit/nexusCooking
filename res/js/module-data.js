angular
    .module("module-data", [])
    .controller("controller-data", function($scope){
        var cData = this;
        cData.difficulty_=0;
        cData.image_="";
        cData.name_="";
        cData.regions_="";
        cData.steps_="";
        cData.time_=15;
        cData.forHowMany=4;
        cData.timeType_="";
        cData.category_="";
        cData.ingredientsList = new Object();
        cData.ingredientsListAdded = new Object();
        cData.regionsList = new Object();
        cData.categoriesList = new Object();
        cData.ingredientName_="";
        localStorage.setItem('currentURLimg', 'https://images-na.ssl-images-amazon.com/images/I/31XrGujYNTL.jpg');

        // Ver las regiones que existen en la DB
        db.ref('db/regions/').once('value', function(snapshot){
            for (myRegion in snapshot.val()){
                    cData.regionsList[myRegion] = myRegion;
                    $scope.$apply();
            }
        })

        // Ver las categorias que existen en la DB
        db.ref('db/categories/').once('value', function(snapshot){
            for (myCategory in snapshot.val()){
                    cData.categoriesList[myCategory] = myCategory;
                    $scope.$apply();
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
            db.ref('db/ingredients/').once('value', function(snapshot){
                for (myIngredient in snapshot.val()){
                    db.ref('db/ingredients/' + myIngredient + '/').once('value', function(snapshot){
                        cData.ingredientsList[snapshot.key] = snapshot.val().name;
                        $scope.$apply();
                    })
                }
            })
        }

        // Agrega una nueva receta segun lo ingresado en la vista
        cData.addRecipe = function(){
            if (cData.time_ <= 15){
                cData.timeType_ = "express";
            } else if (cData.time_ < 60){
                cData.timeType_ = "normal";
            } else {
                cData.timeType_ = "long";
            }
            var newRecipe = {
                author:{
                    admin:true
                },
                favorites:0,
                date:firebase.database.ServerValue.TIMESTAMP,
                image:localStorage.getItem('currentURLimg'),
                name:cData.name_,
                stars:0,
                views:0,
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
                },
                forHowMany:cData.forHowMany
            };
            var newRecipeKey = db.ref('db/').child('recipes').push().key;
            db.ref('db/recipes/' + newRecipeKey).update(newRecipe);

            db.ref('db/names/').update({[cData.name_]:true})
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
            localStorage.setItem('currentURLimg', 'https://images-na.ssl-images-amazon.com/images/I/31XrGujYNTL.jpg');
            return true
        }

        // Agrega un nuevo ingrediente
        cData.addNewIngredient = function(){
            var newIngredient = {
                name:cData.ingredientName_
            };
            var newIngredientKey = db.ref('db/').child('ingredients/' + cData.ingredientName_).update(newIngredient);
            cData.getIngredient();
        }

        cData.getIngredient();
    });