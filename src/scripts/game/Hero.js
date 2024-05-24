import * as PIXI from "pixi.js"
import * as Matter from "matter-js"
import {App} from "../system/App";

export class Hero{
    constructor() {
        this.createSprite();
        this.createBody();
        App.app.ticker.add(this.update, this);
        
        this.dy = App.config.hero.jumpSpeed;
        this.maxJumps = App.config.hero.maxJumps;
        this.jumpIndex = 0;
        
        this.score = 0;
    }
    
    update(){
        this.sprite.x = this.body.position.x - this.sprite.width / 2;
        this.sprite.y = this.body.position.y - this.sprite.height / 2;
        
        if(this.sprite.y > window.innerHeight){
            this.sprite.emit("die");
        }
    }
    
    destroy(){
        App.app.ticker.remove(this.update, this);
        Matter.World.remove(App.physics.world, this.body);
        this.sprite.destroy();
    }

    collectDiamond(diamond) {
        console.log("collectDiamond");
        ++this.score;
        Matter.World.remove(App.physics.world, diamond.body);
        if(diamond.sprite){
            diamond.sprite.destroy();
            diamond.sprite = null;
        }
        this.sprite.emit("score");
    }
    
    stayOnPlatform(platform){
        this.platform = platform;
        this.jumpIndex = 0;
    }

    startJump() {
        if(this.jumpIndex < this.maxJumps){
            ++this.jumpIndex;
            Matter.Body.setVelocity(this.body, { x: 0, y: -this.dy});
        }
    }
    
    createBody(){
        this.body = Matter.Bodies.rectangle(this.sprite.x + this.sprite.width / 2, this.sprite.y + this.sprite.height / 2, this.sprite.width, this.sprite.height, { friction: 0, isStatic: false});
        Matter.World.add(App.physics.world, this.body);
        this.body.gameHero = this;
    }
    
    createSprite(){
        this.sprite = new PIXI.AnimatedSprite([
            App.res("walk1"),
            App.res("walk2")
        ]);
        
        this.sprite.x = App.config.hero.position.x;
        this.sprite.y = App.config.hero.position.y;
        this.sprite.loop = true;
        this.sprite.animationSpeed = 0.1;
        this.sprite.play();
    }
}