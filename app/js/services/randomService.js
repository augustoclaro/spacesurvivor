spaceship.service("randomService", function(){
    this.randomRange = function(min, max){
        return Math.floor(Math.random() * (max - min + 1) + min);
    };
    this.lucky = function(percent){
        return this.randomRange(0, 10000) <= percent * 100;
    };
});