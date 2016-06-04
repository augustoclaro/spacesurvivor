spaceship.state("gameOverState", [
"$module", "$input", "$keys","$state", "gameData",
function ($module, $input, $keys, $state, gameData) {
    return function () {
        this.load = function (cb) {
            $module.load([
                "bgModule",
                "gameOverScreenModule"
            ], cb);
        };
        this.update = function (cb) {
            const pressedKeys = $input.pressedKeys();
            if (pressedKeys.allKeys.indexOf($keys.SPACE) > -1){
                gameData.points = 0;
                gameData.level = 1;
                $state.changeTo("mainState");
            }
            cb();
        };
    }
}]);