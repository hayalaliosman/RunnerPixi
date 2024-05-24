import { App } from "../system/App";
import { Scene } from "../system/Scene";
import {Background} from "./Background";
import {Hero} from "./Hero";
import {Platforms} from "./Platforms";
import * as Matter from "matter-js"
import {LabelScore} from "./LabelScore";

export class Game extends Scene {
    create() {
        this.createBackground();
        this.createHero();
        this.createPlatforms();
        this.setEvents();
        this.createUI();
    }
    
    setEvents(){
        Matter.Events.on(App.physics, 'collisionStart', this.onCollisionStart.bind(this));
    }
    
    onCollisionStart(event){
        const colliders = [event.pairs[0].bodyA, event.pairs[0].bodyB];
        const hero = colliders.find(body => body.gameHero);
        const platform = colliders.find(body => body.gamePlatform);
        const diamond = colliders.find(body => body.gameDiamond);
        
        if(hero && platform){
            this.hero.stayOnPlatform(platform.gamePlatform);
        }
        
        if(hero && diamond){
            this.hero.collectDiamond(diamond.gameDiamond);
        }
    }
    
    createUI(){
        this.labelScore = new LabelScore();
        this.container.addChild(this.labelScore);
        this.hero.sprite.on("score", ()=>{
           this.labelScore.renderScore(this.hero.score); 
        });
    }
    
    createPlatforms(){
        this.platforms = new Platforms();
        this.container.addChild(this.platforms.container);
        this.container.on("pointerdown", ()=>{
            this.hero.startJump();
        })
    }
    
    createHero(){
        this.hero = new Hero();
        this.container.addChild(this.hero.sprite);
        this.hero.sprite.once("die", ()=>
        {
           App.scenes.start("Game"); 
        });
    }
    
    createBackground() {
        this.bg = new Background();
        this.container.addChild(this.bg.container);
    }
    
    update(dt){
        this.bg.update(dt);
        this.platforms.update(dt);
    }
    
    destroy(){
        Matter.Events.off(App.physics, 'collisionStart', this.onCollisionStart.bind(this));
        App.app.ticker.remove(this.update, this);
        this.bg.destroy();
        this.platforms.destroy();
        this.labelScore.destroy();
    }
}
