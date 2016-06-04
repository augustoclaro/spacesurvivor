spaceship.module("gameOverSelectorModule", [
    "$renderer", "$state", "gameData", "$pos", "$timedFunction", "$input", "$keys",
    function ($renderer, $state, gameData, $pos, $timedFunction, $input, $keys) {
        return function () {
            var selected = 0;
            this.load = function (next) {
                next();
            };
            const _timedCursor = $timedFunction.create(function (d) {
                selected += d;
                if (selected < 0) selected = 1;
                if (selected > 1) selected = 0;
            }, 300);
            this.update = function () {
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
                if (pressedKeys.allKeys.indexOf($keys.SPACE) > -1){
                    gameData.points = 0;
                    gameData.level = 1;
                    if (selected === 1)
                        $state.changeTo("startState");
                    else
                        $state.changeTo("mainState");
                }
            };
            this.render = function () {
                const opts = ["Play again", "Change spaceship"];
                $renderer.renderText(opts[0], {
                    maxWidth: 120,
                    font: "bold 20px Verdana",
                    align: "center",
                    color: "white",
                    pos: {
                        x: 140,
                        y: 530
                    }
                });
                $renderer.renderText(opts[1], {
                    font: "bold 20px Verdana",
                    align: "center",
                    color: "white",
                    pos: {
                        x: 430,
                        y: 530
                    }
                });
                var selTxtWidth = $renderer.getContext().measureText(opts[selected]).width;
                $renderer.renderText("Press space bar to select", {
                    font: "bold 10px Verdana",
                    align: "center",
                    color: "white",
                    pos: {
                        x: 300,
                        y: 570
                    }
                });
                const selPos = $pos.fromCenterPoint({
                    x: 140 + (290 * selected),
                    y: 530
                }, {
                    height: 20,
                    width: selTxtWidth
                });
                $renderer.renderLine({
                    x: selPos.x - 20,
                    y: selPos.y - 20
                }, {
                    x: selPos.x + selTxtWidth + 20,
                    y: selPos.y - 20
                }, 5, "white");
                $renderer.renderLine({
                    x: selPos.x - 20,
                    y: selPos.y + 30
                }, {
                    x: selPos.x + selTxtWidth + 20,
                    y: selPos.y + 30
                }, 5, "white");
            };
        };
    }]);