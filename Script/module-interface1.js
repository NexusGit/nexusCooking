angular
    .module("module-interface1", [])
    .controller("controller-interface1", function(){
        var cInterface1 = this;
        cInterface1.ingredientsList = new Object();
        cInterface1.ingredientsAdded = new Object();
        cInterface1.isDisabled = true;

        // Ver los ingredientes que existen en la DB
        db.ref('db/ingredients/').orderByChild('name').once('value', function(snapshot){
            for (myIngredient in snapshot.val()){
                db.ref('db/ingredients/' + myIngredient + '/').once('value', function(snapshot){
                    cInterface1.ingredientsList[snapshot.key] = snapshot.val().name;
                })
            }
        })

        // Verifica que el ingrediente seleccionado exista en la DB
        cInterface1.checkExistance = function(){
            if (Object.values(cInterface1.ingredientsList).indexOf(cInterface1.newIngredient) > -1) {
                cInterface1.isDisabled = false;
            }
            else{
                cInterface1.isDisabled = true;
            }
        }

        // Agrega el ingrediente a la lista
        cInterface1.addIngredient = function(){
            if(cInterface1.newIngredient != null){
                cInterface1.ingredientsAdded[_.invert(cInterface1.ingredientsList)[cInterface1.newIngredient]] = cInterface1.newIngredient;
            }
            cInterface1.newIngredient = null;
            cInterface1.isDisabled = true;
        }

        // Borra de la lista de ingredientes agregados, el ingrediente seleccionado
        cInterface1.removeIngredient = function(removeKey){
            delete cInterface1.ingredientsAdded[removeKey]
        }

        // Almacena en localStorage la busqueda
        cInterface1.filterData = function(){
                localStorage.setItem("myData", cInterface1.ingredientsAdded)
//            for (ingredient in cInterface1.ingredientsAdded){
//                localStorage.filteredData[ingredient] = cInterface1.ingredientsAdded[ingredient];
//            }
            console.log(localStorage.myData);
        }
    })