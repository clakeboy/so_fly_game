/**
 * Created by CLAKE on 2014/9/16.
 */
var v = cp.v;
var GRABABLE_MASK_BIT = 1<<31;
var NOT_GRABABLE_MASK = ~GRABABLE_MASK_BIT;
var BALL_COLL = 1;
var PlayLayer = cc.Layer.extend({
    balls:[],
    space:null,
    _addFrequent:0.3,
    _dt:0,
    _debugNode:null,
    _mouseJoint:null,
    _mouseBody:null,
    _mouse:v(0,0),
    _mouseHold:false,
    _holdMouse:v(0,0),
    _oldPos:null,
    _holdCall:null,
    _ballBody:null,
    _eump:null,
    _plane:null,
    ctor:function(){
        this._super();
        this.space = new cp.Space();
        this.setupDebugNode();
        this.init();
    },
    init:function(){
        this._super();
        this._mouseBody = new cp.Body(Infinity, Infinity);
        var winSize = cc.director.getWinSize();
        var space = this.space;
        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.MOUSE,
            onMouseDown:function(event){
                var point = v(parseInt(event.getLocationX()),parseInt(event.getLocationY()));
                var self = event.getCurrentTarget();
                self._mouse = point;
                self._mouseHold = true;
                self._oldPos = self._plane.p;
                if (!self._mouseJoint) {
//                    self._mouseHold = true;
//                    var body = self._plane;
//                    var mouseJoint = self._mouseJoint = new cp.PinJoint(self._mouseBody, body, v(0,0), v(0,0));
//
////                    mouseJoint.maxForce = 50000;
//                    space.addConstraint(mouseJoint);
                }
            },
            onMouseMove:function(event){
                var point = v(parseInt(event.getLocationX()),parseInt(event.getLocationY()));
                var self = event.getCurrentTarget();
                if (self._mouseHold) {
//                    self._plane.setPos(v.add(old,add));
                    self._plane.setPos(v.add(self._oldPos,v.sub(point,self._mouse)));
                    space.reindexStatic();
                }

            },
            onMouseUp: function(event){
                //Add a new body/atlas sprite at the touched location
//                var location = touches[0].getLocation();
//                event.getCurrentTarget().addNewSprite(location);
                var point = v(parseInt(event.getLocationX()),parseInt(event.getLocationY()));
                var self = event.getCurrentTarget();
                self._mouse = point;
                if(self._mouseJoint) {
                    space.removeConstraint(self._mouseJoint);
                    self._mouseJoint = null;
                }
                self._mouseHold = false;
            }
        }), this);

        this.addFloor();
        this.addWalls();


        space.iterations = 50;
        space.gravity = v(0, 0); //重方向和大小
        space.damping = 1; //空间阻力,默认为1,
        space.sleepTimeThreshold = 0.5;
        space.collisionSlop = 0.5;

        this._plane = this.addNewSprite(v(winSize.width/2,winSize.height/3));

        var thisLayer = this;
        space.addCollisionHandler(BALL_COLL,BALL_COLL,function(abtr){
            thisLayer.addParticle(abtr.getContactPointSet()[0].point);
            space.removeBody()
            return true;
        });
        this.scheduleUpdate();
    },
    addParticle:function(point){
        var part = new cc.ParticleSystem(s_bob_plist);//添加一个粒子特效
        part.setScale(0.2);
        part.duration = 0.1;//播放时间秒
        part.setPosition(point);
        part.setAutoRemoveOnFinish(true);//是否自动消除释放
        this.addChild(part);
    },
    setupDebugNode:function(){
        this._debugNode = new cc.PhysicsDebugNode(this.space);
        this._debugNode.visible = true;
        this.addChild(this._debugNode);
    },
    addNewSprite:function(p) {
        var plane = cc.PhysicsSprite.create(res.s_plane);
        plane.setAnchorPoint(0.5,(plane.getContentSize().height/2+10)/plane.getContentSize().height);
        var space = this.space;
        var radius = 20;
        var mass = 5; //质量
        var moment = cp.momentForCircle(mass, 0, radius, v(0, 0));//转动惯量
        var body = space.addBody(new cp.Body(mass, moment));
        body.userData = plane;
        body.setPos(p);

        var circle = space.addShape(new cp.CircleShape(body, radius, cp.vzero));
        circle.setElasticity(0.8); //弹性
        circle.setFriction(0.4); //摩擦
        circle.setCollisionType(BALL_COLL);

        plane.setBody(body);

        this.addChild(plane);
        return body;
//        circle.group = 1;
    },
    update:function(dt) {
        this._mouseBody.p = this._mouse;

        this.space.step(dt);
    },
    addFloor : function() {
        var space = this.space;
        var winSize = cc.director.getWinSize();
        //bottom
        var floor = space.addShape(new cp.SegmentShape(space.staticBody, v(0, 0), v(winSize.width, 0), 0));
        floor.setElasticity(1);
        floor.setFriction(1);
        floor.setLayers(NOT_GRABABLE_MASK);
        //top
        var floor = space.addShape(new cp.SegmentShape(space.staticBody, v(0, winSize.height), v(winSize.width, winSize.height), 0));
        floor.setElasticity(1);
        floor.setFriction(1);
        floor.setLayers(NOT_GRABABLE_MASK);
    },
    addWalls : function() {
        var space = this.space;
        var winSize = cc.director.getWinSize();
        //left wall
        var wall1 = space.addShape(new cp.SegmentShape(space.staticBody, v(0, 0), v(0, winSize.height), 0));
        wall1.setElasticity(1);
        wall1.setFriction(1);
        wall1.setLayers(NOT_GRABABLE_MASK);
        //right wall
        var wall2 = space.addShape(new cp.SegmentShape(space.staticBody, v(winSize.width, 0), v(winSize.width, winSize.height), 0));
        wall2.setElasticity(1);
        wall2.setFriction(1);
        wall2.setLayers(NOT_GRABABLE_MASK);
    }
});