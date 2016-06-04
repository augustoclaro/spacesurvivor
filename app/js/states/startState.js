spaceship.state("startState", [
"$module", "$input", "$keys","$state", "$renderer",
function ($module, $input, $keys, $state, $renderer) {
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
                "startScreenModule",
                "shipSelectorModule"
            ], cb);
        };
        this.update = function (cb) {
            const pressedKeys = $input.pressedKeys();
            if (pressedKeys.allKeys.indexOf($keys.SPACE) > -1)
                $state.changeTo("mainState");
            cb();
        };
    }
}]);