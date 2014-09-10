/**
 * Created by CLAKE on 2014/9/3.
 */
var FlyScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new MyLayer();
        this.addChild(layer);
        layer.init();
    }
});
