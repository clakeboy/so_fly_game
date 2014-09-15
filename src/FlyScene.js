/**
 * Created by CLAKE on 2014/9/3.
 */

var FlyScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        g_backLayer = new BackLayer();
        this.addChild(g_backLayer,1);
        var layer = new PlayLayer();
        this.addChild(layer,2);
    }
});
