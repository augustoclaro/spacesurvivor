spaceship.state("mainState", [
    "$timedFunction", "$module", "gameData", "$renderer",
    function ($timedFunction, $module, gameData, $renderer) {
        return function () {
            this.load = function (cb) {
                $renderer.renderNow(function(context){
                    var renderer = $renderer.fromContext(context);
                    renderer.renderText("Loading...", {
                        font: "bold 25px Verdana",
                        align: "center",
                        color: "black",
                        pos: {
                            x: 300,
                            y: 550
                        }
                    });
                });
                $module.load([
                    "bgModule",
                    "playerModule",
                    "scoreModule"
                ], cb);
            };
            const _getMeteorInterval = function () {
                return 1000 / gameData.level;
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