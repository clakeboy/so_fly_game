/**
 * Created by CLAKE on 2014/9/3.
 */
var BackLayer = cc.LayerColor.extend({
    ballDraw:null,
    init:function(color) {
        this._super(color);
        var winSize = cc.director.getWinSize();
        this.ballDraw = new cc.DrawNode();
        this.addChild(this.ballDraw);

//        draw.drawCircle(cc.p(winSize.width / 2, winSize.height / 2), 50, cc.degreesToRadians(90), 50, true, 2, cc.color(0, 255, 255, 255));
        this.ballDraw.drawDot(cc.p(winSize.width / 2, winSize.height / 2), 40, cc.color(this.randColor()));
//        var move = cc.moveTo(4,cc.p(winSize.width,winSize.height),10);
//        var move = cc.moveBy(4,cc.p(winSize.width/2-20,winSize.height/2-20),10);
//        this.ballDraw.runAction(move);
        this.schedule(this.c_update,0.1);
    },
    c_update:function(dt) {
//        var winSize = cc.director.getWinSize();
//        this.ballDraw.drawCircle(cc.p(winSize.width / 2, winSize.height / 2), 100, cc.degreesToRadians(90), 100, false, 6, cc.color(this.randColor()));
//        this.ballDraw.clear();
//        this.ballDraw.drawDot(cc.p(winSize.width / 2, winSize.height / 2), 40, cc.color(this.randColor()));
        this.ballDraw.x +=1;
        this.ballDraw.y +=2;
        cc.log(this.ballDraw.x);
    },
    randColor:function () {
        return '#'+('00000'+(Math.random()*0x1000000<<0).toString(16)).slice(-6);
    }
});