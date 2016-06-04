const spaceship = gamify.game("SpaceshipApp", {
    size: {
        width: 600,
        height: 600
    },
    fps: 50,
    initialState: "startState",
    canvasId: "gameCanvas"
}, []);
spaceship.const("gameData", {
    points: 0,
    level: 1
});