cc.game.onStart = function(){
    var designSize = cc.size(480, 800);
    var screenSize = cc.view.getFrameSize();

    if(!cc.sys.isNative && screenSize.height < 800){
        designSize = cc.size(320, 480);
    }else{
    }
    cc.view.setDesignResolutionSize(designSize.width, designSize.height, cc.ResolutionPolicy.SHOW_ALL);
    //load resources
    cc.LoaderScene.preload(g_resources, function () {
        cc.director.runScene(new FlyScene());
    }, this);
};
cc.game.run();