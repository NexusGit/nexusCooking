angular.module("myApp", [])
	.controller('MainController',['$scope', function($scope){
		$scope.ingredients = [];
		$scope.idIngreds = [];
		$scope.idIngreds.push({ ingr: "uno12" });
		$scope.idIngreds.push({ ingr: "dos" });
		$scope.idIngreds.push({ ingr: "dostres" });
		$scope.idIngreds.push({ ingr: "cuatro" });
		$scope.idIngreds.push({ ingr: "cinco" });
		$scope.idIngreds.push({ ingr: "seis" });
		$scope.idIngreds.push({ ingr: "siete" });
		$scope.idIngreds.push({ ingr: "el ooooooochooo" });

		$scope.isDisabled = true;

		$scope.addIngredientAUX = function(){
			for (i = 0; i < $scope.idIngreds.length; i++){
				if ($scope.newIngredient == $scope.idIngreds[i].ingr){
					$scope.isDisabled = false;
					break;
				}
				else {
					$scope.isDisabled = true;
				}
			}
		}

		$scope.addIngredient = function(){
			if ($scope.newIngredient != null){
					$scope.ingredients.push({text: $scope.newIngredient});
			};
			$scope.newIngredient = null;
			$scope.isDisabled = true;
		};

		$scope.delIngredient = function (data){
			$scope.ingredients.splice(data, 1);
		};

}]);
