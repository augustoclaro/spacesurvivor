spaceship.module("shipSelectorModule", [
    "$sprite", "$renderer", "$imageLoader", "gameData", "$pos", "$timedFunction", "$input", "$keys",
    function ($sprite, $renderer, $imageLoader, gameData, $pos, $timedFunction, $input, $keys) {
        return function () {
            var _ships = [];
            var selected = 1;
            this.load = function (next) {
                $imageLoader.loadImages({
                    ship1: "img/sprites/ship1.png",
                    ship2: "img/sprites/ship2.png",
                    ship3: "img/sprites/ship3.png",
                    bullet1: "img/sprites/bullet1.png",
                    bullet2: "img/sprites/bullet2.png",
                    bullet3: "img/sprites/bullet3.png"
                }, function (images) {
                    for (var i = 1; i <= 3; i++) {
                        _ships.push({
                            sprite: $sprite.create(images["ship" + i], {
                                height: images["ship" + i].height,
                                width: images["ship" + i].width,
                                sprites: [
                                    { name: "ship", x: 0, y: 0 }
                                ]
                            }),
                            size: {
                                width: 60,
                                height: images["ship" + i].height / images["ship" + i].width * 60
                            },
                            pos: {
                                x: 180 + (i - 1) * 120,
                                y: 400
                            },
                            bulletSprite: $sprite.create(images["bullet" + i], {
                                height: images["bullet" + i].height,
                                width: images["bullet" + i].width,
                                sprites: [
                                    { name: "bullet", x: 0, y: 0 }
                                ]
                            })
                        });
                    }
                    next();
                });
            };
            const _timedCursor = $timedFunction.create(function (d) {
                selected += d;
                if (selected < 0) selected = 2;
                if (selected > 2) selected = 0;
            }, 300);
            this.update = function () {
                gameData.ship = _ships[selected];
                const pressedKeys = $input.pressedKeys();
                const _dirs = pressedKeys.directionKeys;

                if (_dirs.length) {
                    var _keyPressed = _dirs.pop();
                    switch (_keyPressed) {
                        case $keys.ARROW_LEFT:
                        case $keys.A:
                            _timedCursor.run(-1);
                            break;
                        case $keys.ARROW_RIGHT:
                        case $keys.D:
                            _timedCursor.run(1);
                            break;
                    }
                }
            };
            this.render = function () {
                const render = $renderer.fromLayer(0);
                _ships.forEach(function (ship) {
                   render.renderSprite(ship.sprite, "ship", ship.pos, ship.size, true);
                });
                var ship = _ships[selected];
                var selPos = $pos.fromCenterPoint(ship.pos, ship.size);
                render.renderLine({
                    x: selPos.x - 10,
                    y: selPos.y - 10
                }, {
                        x: selPos.x + ship.size.width + 10,
                        y: selPos.y - 10
                    }, 5);
                render.renderLine({
                    x: selPos.x - 10,
                    y: selPos.y + ship.size.height + 10
                }, {
                        x: selPos.x + ship.size.width + 10,
                        y: selPos.y + ship.size.height + 10
                    }, 5);
            };
        };
    }]);