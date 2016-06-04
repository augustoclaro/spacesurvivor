spaceship.state("startState", [
"$module", "$input", "$keys","$state",
function ($module, $input, $keys, $state) {
    return function () {
        this.load = function (cb) {
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