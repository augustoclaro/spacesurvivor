spaceship.state("gameOverState", [
"$module", "gameData",
function ($module, gameData) {
    return function () {
        this.load = function (cb) {
            $module.load([
                "bgModule",
                "gameOverScreenModule",
                "gameOverSelectorModule"
            ], cb);
        };
        this.update = function (cb) {
            cb();
        };
    }
}]);