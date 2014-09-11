/**
 * Created by clakeboy on 14-9-10.
 */
var PTM_RATIO = 32;
var v = cp.v;
var GRABABLE_MASK_BIT = 1<<31;
var NOT_GRABABLE_MASK = ~GRABABLE_MASK_BIT;
var GameLayer = cc.Layer.extend({
    balls:[],
    space:null,
    _addFrequent:0.3,
    _dt:0,
    _debugNode:null,
    _mouseJoint:null,
    _mouseBody:null,
    _mouse:v(0,0),
    _mouseHold:false,
    _holdCall:null,
    ctor:function(){
        this._super();
        this.space = new cp.Space();
        this.setupDebugNode();
    },
    init:function(){
        this._super();
        this._mouseBody = new cp.Body(Infinity, Infinity);
        var space = this.space;

        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.MOUSE,
            onMouseDown:function(event){
                var point = v(event.getLocationX(),event.getLocationY());
                var self = event.getCurrentTarget();
                self._mouse = point;
                if (!self._mouseJoint) {
                    var shape = space.pointQueryFirst(point, GRABABLE_MASK_BIT, cp.NO_GROUP);
                    if(shape){
                        var body = shape.body;
                        var mouseJoint = self._mouseJoint = new cp.PivotJoint(self._mouseBody, body, v(0,0), body.world2Local(point));

                        mouseJoint.maxForce = 50000;
                        mouseJoint.errorBias = Math.pow(1 - 0.15, 60);
                        space.addConstraint(mouseJoint);
                    } else {
                        self._mouseHold = true;
                        self._dt = self._addFrequent+1;
                    }
                }
            },
            onMouseMove:function(event){
                var point = v(event.getLocationX(),event.getLocationY());
                var self = event.getCurrentTarget();
                self._mouse = point;
            },
            onMouseUp: function(event){
                //Add a new body/atlas sprite at the touched location
//                var location = touches[0].getLocation();
//                event.getCurrentTarget().addNewSprite(location);
                var point = v(event.getLocationX(),event.getLocationY());
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


        space.iterations = 60;
        space.gravity = v(0, -100); //重方向和大小
        space.sleepTimeThreshold = 0.5;
        space.collisionSlop = 0.5;


        var radius = 20;
        var mass = 1; //质量
        var moment = cp.momentForCircle(mass, 0, radius, v(0, 0));
        var body = space.addBody(new cp.Body(mass, moment));
        body.setPos(v(200,200));//初始坐标
        body.setAngVel(-1); //自旋转力
        var circle = space.addShape(new cp.CircleShape(body, radius, v(0, 0)));
        circle.setElasticity(0.5); //弹性
        circle.setFriction(0.4); //摩擦
        this.scheduleUpdate();
    },
    setupDebugNode:function(){
        this._debugNode = new cc.PhysicsDebugNode(this.space);
        this._debugNode.visible = true;
        this.addChild(this._debugNode);
    },
    addNewSprite:function(p) {
        var space = this.space;
        var radius = 20;
        var mass = 5; //质量
        var moment = cp.momentForCircle(mass, 0, radius, v(0, 0));//转动惯量
        var body = space.addBody(new cp.Body(mass, moment));

        if (Math.random() > 0.5) {
            body.setPos(v(p.x+25, p.y+25));
            body.setVel(v(50,50));
        } else {
            body.setPos(v(p.x+(-25), p.y+25));
            body.setVel(v(-50,50));
        }

        var circle = space.addShape(new cp.CircleShape(body, radius, cp.vzero));
        circle.setElasticity(0.8); //弹性
        circle.setFriction(0.4); //摩擦
    },
    update:function(dt) {
        this.space.step(dt);
        var newPoint = v.lerp(this._mouseBody.p, this._mouse, 0.25);
        this._mouseBody.v = v.mult(v.sub(newPoint, this._mouseBody.p), 60);
        this._mouseBody.p = newPoint;
        if (this._mouseHold) {
            if (this._dt > this._addFrequent) {
                this.addNewSprite(this._mouse);
                this._dt = 0;
            }
            this._dt += dt;
        }
    },
    addFloor : function() {
        var space = this.space;
        //bottom
        var floor = space.addShape(new cp.SegmentShape(space.staticBody, v(0, 0), v(800, 0), 0));
        floor.setElasticity(1);
        floor.setFriction(1);
        floor.setLayers(NOT_GRABABLE_MASK);
        //top
        var floor = space.addShape(new cp.SegmentShape(space.staticBody, v(0, 600), v(800, 600), 0));
        floor.setElasticity(1);
        floor.setFriction(1);
        floor.setLayers(NOT_GRABABLE_MASK);
    },
    addWalls : function() {
        var space = this.space;
        //left wall
        var wall1 = space.addShape(new cp.SegmentShape(space.staticBody, v(0, 0), v(0, 600), 0));
        wall1.setElasticity(1);
        wall1.setFriction(1);
        wall1.setLayers(NOT_GRABABLE_MASK);
        //right wall
        var wall2 = space.addShape(new cp.SegmentShape(space.staticBody, v(800, 0), v(800, 600), 0));
        wall2.setElasticity(1);
        wall2.setFriction(1);
        wall2.setLayers(NOT_GRABABLE_MASK);
    }
});