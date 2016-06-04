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
            const _getMeteorInterval = function () {
                return 1000 / gameData.level; //corrigir intervalo dos metoros
            };
            const timedMeteor = $timedFunction.create(function () {
                var meteor = $module.create("meteorModule");
                $module.load(meteor);
            }, _getMeteorInterval());
            const timedPoint = $timedFunction.create(function () {
                gameData.points += parseInt(gameData.level, 10);
            }, 1000);
            this.update = function (cb) {
                gameData.level = Math.min(3, 1 + (gameData.points / 500));
                timedMeteor.setInterval(_getMeteorInterval());
                timedPoint.run();
                timedMeteor.run();
                cb();
            };
        }
    }]);