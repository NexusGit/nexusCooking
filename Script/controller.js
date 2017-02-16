var app = angular.module("myApp", []);
app.controller('MainController',['$scope', function($scope){

		$scope.ingredients = [];

		$scope.addIngredient = function(){
			if ($scope.newIngredient != null){
				$scope.ingredients.push({text: $scope.newIngredient});
				
			};
			$scope.newIngredient = null;
		};

		$scope.delIngredient = function (data){
			$scope.ingredients.splice(data, 1);
		};

}]);