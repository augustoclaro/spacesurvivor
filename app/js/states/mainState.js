spaceship.state("mainState", [
"$timedFunction", "$module", "gameData",
function ($timedFunction, $module, gameData) {
    return function () {
        this.load = function (cb) {
            $module.load([
                "bgModule",
                "playerModule",
                "scoreModule"
            ], cb);
        };
        const _getMeteorInterval = function(){
            return 800 / gameData.level;
        };
        const timedMeteor = $timedFunction.create(function () {
            var meteor = $module.create("meteorModule");
            $module.load(meteor);
        }, _getMeteorInterval());
        const timedPoint = $timedFunction.create(function () {
            gameData.points+= parseInt(gameData.level, 10);
        }, 1000);
        this.update = function (cb) {
            gameData.level += .0006;
            timedMeteor.setInterval(_getMeteorInterval());
            timedPoint.run();
            timedMeteor.run();
            cb();
        };
    }
}]);