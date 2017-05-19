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
        cData.generatedKey;
        cData.recipeId = "";
        cData.currentRecipe = new Object();

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

        // Verifica la imagen
        cData.verifyImage = function(){
            if (isPossible){
                cData.uploadImage();
            }else{
                if (confirm("No se ha cargado una imagen o no es adecuada, desea continuar de todas formas?")){
                    cData.uploadImage();
                }
            }
        }

        // Sube la imagen y llama a agregar la receta
        cData.uploadImage = function(){
            cData.generatedKey = db.ref('db/').child('imagesKeys').push().key;
            try{
                storageRef.child('stg/recipes/images/' + cData.generatedKey + '/' + file.name).put(file, metadata).then(function(snapshot) {
                    localStorage.setItem('currentURLimg', snapshot.downloadURL);
                    cData.addRecipe();
                }).catch(function(error) {
                    alert('Error on the action: Upload failed', error);
                    console.log(error)
                });
            }
            catch(err){
                cData.addRecipe();
                alert('La receta se ha subido sin imagenes');
            }
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
                    NexusCode:true
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
            var newRecipeKey = cData.generatedKey;
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

        // Borra la receta indicada en la base de datos y tambien elimina la imagen correspondiente
        cData.deleteRecipe = function(){
            db.ref('db/recipes/' + cData.recipeId).once('value').then(function(snapshot){
                cData.currentRecipe = snapshot.val();
                cData.currentTimeType = Object.keys(cData.currentRecipe.timeType)[0]
                cData.currentRegion = Object.keys(cData.currentRecipe.region)[0]
                cData.currentDifficulty = Object.keys(cData.currentRecipe.difficulty)[0]
                cData.currentCategory = Object.keys(cData.currentRecipe.category)[0]
                db.ref('db/timeTypes/' + cData.currentTimeType + '/recipes').update({[cData.recipeId]:null})
                db.ref('db/regions/' + cData.currentRegion + '/recipes').update({[cData.recipeId]:null})
                db.ref('db/difficulties/' + cData.currentDifficulty + '/recipes').update({[cData.recipeId]:null})
                db.ref('db/categories/' + cData.currentCategory + '/recipes').update({[cData.recipeId]:null})
                db.ref('db/recipes').update({[cData.recipeId]:null});
            })
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