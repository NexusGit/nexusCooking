angular
    .module("module-interface2", [])
    .controller("controller-interface2", function(){
        var cInterface2 = this
        cInterface2.allRecipes = new Object();

        // Traer todas las recetas (luego se cambiara la funcion por filtro)
        cInterface2.bringEveryRecipe = function(){
            db.ref('db/recipes').once('value', function(snapshot){
                cInterface2.allRecipes = snapshot.val();
            })
        }

        // Traer solo las recetas que esten coincidentes con el filtro
        cInterface2.bringSomeRecipe = function(){
            db.ref('db/recipes').once('value', function(snapshot){
                cInterface2.allRecipes = snapshot.val();
            })
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

        console.log((JSON.parse(localStorage.getItem("myData"))));

    })