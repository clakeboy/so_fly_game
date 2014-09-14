/**
 * Created by CLAKE on 2014/9/3.
 */

var g_backLayer;
var BackLayer = cc.Layer.extend({
    p_backHeight:null,
    p_speed:-200,
    ctor:function(){
        this._super();
        this.init();
    },
    init:function() {
        this._super();
        var back = cc.Sprite.create(res.s_back1);
        back.setAnchorPoint(cc.p(0,0));
        var backre = cc.Sprite.create(res.s_back2);
        backre.setAnchorPoint(cc.p(0,0));
        this.addChild(back);
        this.addChild(backre);

        this.p_backHeight = back.getContentSize().height;
        backre.setPosition(cc.p(0,this.p_backHeight));

        this.scheduleUpdate();
    },
    update:function(dt) {
        cc.each(this.getChildren(),function(item,obj){
            g_backLayer.moveBack(item,dt);
        },null);
    },
    moveBack:function(item,dt){
        item.setPositionY(item.getPositionY()+this.p_speed * dt);
        if (item.getPositionY() < -this.p_backHeight) {
            item.setPositionY(item.getPositionY()+this.p_backHeight*2-2);
        }
    },
    randColor:function () {
        return '#'+('00000'+(Math.random()*0x1000000<<0).toString(16)).slice(-6);
    }
});