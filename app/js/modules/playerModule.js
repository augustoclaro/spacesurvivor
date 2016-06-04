spaceship.module("playerModule", [
    "animationService", "$timedFunction", "$game", "gameData", "$pos", "$renderer", "$imageLoader", "$sprite", "$input", "$keys", "$module",
    function (animationService, $timedFunction, $game, gameData, $pos, $renderer, $imageLoader, $sprite, $input, $keys, $module) {
        return function () {
            var _spriteSheet;
            const playerObj = this;
            playerObj.pos = {
                x: 275,
                y: 490
            },
                playerObj.size = {
                    width: 50
                },
                _config = $game.getConfig();
            this.load = function (next) {
                $imageLoader.loadImages({
                    ship: "img/sprites/ship.png"
                }, function (images) {
                    playerObj.size.height = images.ship.height / images.ship.width * playerObj.size.width;
                    _spriteSheet = $sprite.create(images.ship, {
                        height: images.ship.height,
                        width: images.ship.width,
                        sprites: [
                            { name: "ship", x: 0, y: 0 }
                        ]
                    });
                    next();
                });
            };

            const _timedShoot = $timedFunction.create(function () {
                var pos1 = {
                    x: playerObj.pos.x + 5,
                    y: playerObj.pos.y
                }
                var pos2 = {
                    x: playerObj.pos.x + 35,
                    y: playerObj.pos.y
                }
                var bullet1 = $module.create("bulletModule", pos1);
                var bullet2 = $module.create("bulletModule", pos2);
                bullet1.load(function () {
                    bullet2.load(function () {
                        $module.load([bullet1, bullet2]);
                    });
                });
            }, 100);
            this.update = function () {
                const _speed = 3 * gameData.level;
                const pressedKeys = $input.pressedKeys();
                const _dirs = pressedKeys.directionKeys;

                if (_dirs.length) {
                    var _keyPressed = _dirs.pop();
                    switch (_keyPressed) {
                        case $keys.ARROW_LEFT:
                        case $keys.A:
                            playerObj.pos.x -= _speed;
                            if (playerObj.pos.x < 0)
                                playerObj.pos.x = 0;
                            break;
                        case $keys.ARROW_RIGHT:
                        case $keys.D:
                            playerObj.pos.x += _speed;
                            if (playerObj.pos.x > _config.size.width - playerObj.size.width)
                                playerObj.pos.x = _config.size.width - playerObj.size.width;
                            break;
                    }
                }
                if (pressedKeys.allKeys.indexOf($keys.SPACE) > -1)
                    _timedShoot.run();
            };
            this.render = function () {
                $renderer.renderSprite(_spriteSheet, "ship", playerObj.pos, playerObj.size);
            };
        };
    }]);