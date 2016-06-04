spaceship.module("bgModule", [
    "$game", "$renderer", "randomService", "gameData",
    function ($game, $renderer, randomService, gameData) {
        return function () {
            var _stars, _config;
            const _renderRandomLine = function (y) {
                for (let _x = 0; _x < _config.size.width; _x++)
                    if (randomService.lucky(.1))
                        _stars.push({
                            x: _x,
                            y: y
                        });
            };
            this.load = function (next) {
                _stars = [];
                _config = $game.getConfig();
                for (let _y = 0; _y < _config.size.height; _y++)
                    _renderRandomLine(_y);
                next();
            };
            this.update = function () {
                const _speed = 2 * gameData.level;
                _stars = _stars.filter(function (star) {
                    return (star.y += _speed) <= _config.size.height;
                });
                for (var i = 0; i <= _speed; i++)
                    _renderRandomLine(i);
            };
            this.render = function () {
                $renderer.fillBG("black");
                _stars.forEach(function (star) {
                    $renderer.renderCircle(star, .5, "#fff");
                });
            };
        };
    }]);