var wWidth = window.innerWidth;
var wHeight = window.innerHeight;
var stage = new Konva.Stage({
    container: 'container',
    width: wWidth,
    height: wHeight
});

var konvaConfig = (function () {
    var imageUrlPrix = '/hmi/img/',
        dbLabels = ['position_x', 'position_y', 'car_number', 'current_position', 'target_position', 'current_segment', 'operation_state', 'communication_state'],
        dbLabelNames = ['X: ', 'Y: ', '车号：', '当前点: ', '目标点: ', '当前段: ', '操作状态: ', '通信状态: '],
        x1 = 5,
        x2 = wWidth/2,
        xSpace = 40,
        x3 = wWidth*8/10,
        y1 = wHeight*2/10;
    return{
        dashboardLabels: {
            labels: dbLabels,
            labelNames: dbLabelNames,
            labelPositions:[{x:x1,y:y1},{x:x1,y:y1+xSpace},{x:x2,y:y1},{x:x1,y:y1+2*xSpace},{x:x1,y:y1+3*xSpace},{x:x1,y:y1+4*xSpace},{x:x3,y:y1},{x:x3,y:y1+xSpace}]
        },
        imageSources:  {
            'background': imageUrlPrix + 'background.jpg',
            'dashboard': imageUrlPrix + 'dashboard.png',
            '25_battery': imageUrlPrix + 'battery/25_battery.png',
            '50_battery': imageUrlPrix + 'battery/50_battery.png',
            '75_battery': imageUrlPrix + 'battery/75_battery.png',
            '100_battery': imageUrlPrix + 'battery/100_battery.png',
            'needle': imageUrlPrix + 'compass/needle.png',
            'compass': imageUrlPrix + 'compass/compass.png',
            'homeIcon': imageUrlPrix + 'home.png',
            'companyLogo':imageUrlPrix+ 'anjiLogo.png',
            'shutdown': imageUrlPrix + 'shutdown.png'
        },
        logo:{
            x:wWidth*7/10,
            y:wHeight/20
        },
        dashboard:{
            speedBoard:{

            },
            compassBoard:{

            },
            batteryBoard:{

            }
        }
    }
}());


//保存image对象
var imagePool = {};

var pageCollection = {
    homePage: null,
    commonPan: null,
    dashboard: null,
    background:null
};


var actionCollections = new ActionCollections();
//加载图片资源
(function () {
        var loaded = 0;
        for (var k in konvaConfig.imageSources) {
            imagePool[k] = new Image();
            imagePool[k].crossOrigin = '';
            imagePool[k].src = konvaConfig.imageSources[k];
            imagePool[k].onload = function () {
                ++loaded;
                if (loaded == Object.getOwnPropertyNames(konvaConfig.imageSources).length) {
                    pageCollection.background=(function (o) {
                            var backgroundLayer = new Konva.Layer();
                            var backgroundRect = new Konva.Rect({
                                x: 0,
                                y: 0,
                                width: wWidth,
                                height: wHeight
                            });
                            backgroundLayer.add(backgroundRect);
                            var imageObj = imagePool['background'];
                            var kovaImage = new Konva.Image({
                                x: 0,
                                y: 0,
                                image: imageObj,
                                width: stage.getWidth(),
                                height: stage.getHeight(),
                                opacity: 1
                            });
                            var logoRatio=0.1;
                            var logoImg=imagePool['companyLogo'];
                            var logoImage = new Konva.Image({
                                x:konvaConfig.logo.x,
                                y:konvaConfig.logo.y,
                                width:logoImg.width*logoRatio,
                                height:logoImg.height*logoRatio,
                                image:logoImg
                            });
                            logoImage.cache();
                            logoImage.filters([Konva.Filters.Brighten]);
                            logoImage.brightness(0.2);
                            backgroundLayer.add(kovaImage,logoImage);
                            stage.add(backgroundLayer);
                    }(this));
                    pageCollection.homePage = (function (o) {
                        var homePage = {
                            layer: null,
                            show: function () {
                                this.layer.show();
                            },
                            hide: function () {
                                this.layer.hide();
                            }
                        };
                        var layer = new Konva.Layer({
                            id: 'homePage',
                            opacity: 1
                        });
                        homePage.layer = layer;
                        var lineGroup = new Konva.Group();
                        layer.add(lineGroup);
                        var lineWidth = 10,
                            lineColour = '#8968CD',
                            l_x = 0,
                            l_x_e = wWidth,
                            l_y = 0,
                            l_y_e = wHeight;
                        var row1 = new Konva.Line({
                            points: [l_x, l_y_e / 3, l_x_e, l_y_e / 3],
                            stroke: lineColour,
                            strokeWidth: lineWidth,
                            opacity:.4,
                            lineJoin: 'round'
                        });
                        var row2 = row1.clone({
                            points: [l_x, l_y_e * 2 / 3, l_x_e, l_y_e * 2 / 3]
                        });
                        var column1 = row1.clone({
                            points: [l_x_e / 3, l_y, l_x_e / 3, l_y_e]
                        });
                        var column2 = row1.clone({
                            points: [l_x_e * 2 / 3, l_y, l_x_e * 2 / 3, l_y_e]
                        });
                        lineGroup.add(column1, column2, row1, row2);
                        var dashboardIcon = imagePool['dashboard'];
                        var dashboardKIcon = new Konva.Image({
                            image: dashboardIcon,
                            x: wWidth / 2,
                            y: wHeight / 2,
                            height: 200,
                            width: 200,
                            offset: {
                                x: 100,
                                y: 100
                            }
                        });
                        var shutdownKicon = new Konva.Image({
                            image:imagePool['shutdown'],
                            x:wWidth/6,
                            y:wHeight/6,
                            height:100,
                            width:100,
                            offset:{
                                x:25,
                                y:25
                            }
                        });
                        dashboardKIcon.on('click tap', function () {
                            actionCollections.dashboardIcon(pageCollection.homePage.layer);
                        });
                        shutdownKicon.on('click tap',function () {
                            actionCollections.shutdown();
                        });
                        layer.add(dashboardKIcon,shutdownKicon);
                        stage.add(layer);
                        return homePage;
                    }(this));
                    pageCollection.commonPan = (function (o) {
                        var commonPan = {
                            show: function () {
                                commonPan.layer.show();
                            },
                            hide:function () {
                                commonPan.layer.hide();
                            }
                        };
                        var commonLayer = new Konva.Layer();
                        commonPan.layer = commonLayer;
                        var Kicon = new Konva.Image(
                            {
                                image: imagePool['homeIcon'],
                                x: wWidth / 30,
                                y: wHeight / 20,
                                width: wWidth / 10,
                                height: wHeight / 10
                            }
                        );
                        commonLayer.add(Kicon);
                        Kicon.on('click tap', function(){actionCollections.homeIcon(commonLayer)});
                        stage.add(commonLayer);
                        commonLayer.hide();
                        return commonPan;
                    }(this));
                    pageCollection.dashboard = (function (o) {
                        var dashboard = {
                            layers: {},
                            labels: konvaConfig.dashboardLabels.labels,
                            labelNames: konvaConfig.dashboardLabels.labelNames,
                            speedGauge:null,
                            compassGauge:null,
                            draw: function () {
                                for (var o in dashboard.layers) {
                                    dashboard.layers[o].draw();
                                }
                            },
                            hide: function () {
                                for (var o in dashboard.layers) {
                                    dashboard.layers[o].hide();
                                }
                                $("#speedGauge").show();
                                $("#compassGauge").show();
                            },
                            show: function () {
                                for (var o in dashboard.layers) {
                                    dashboard.layers[o].show();
                                }
                                $("#speedGauge").show();
                                $("#compassGauge").show();
                            },
                            update: function (record) {
                                    this.updateCompass(record['theta']);
                                    this.updateBatteryState(record['power']);
                                    this.updateSpeed(record['speed']);
                                    this.updateLabels([record['locationX'],record['locationY'],
                                    record['number'],record['location'],record['targetLocation'],record['route'],record['operationStatus'],record['communicationStatus']]);
                            },
                            updateLabels: function (data) {
                                var layer = dashboard.layers.labelLayer;
                                var index = 0;
                                konvaConfig.dashboardLabels.labels.forEach(function (value) {
                                    updateLabel(value,konvaConfig.dashboardLabels.labelNames[index]+data[index],layer);
                                    ++index;
                                });
                                layer.draw();
                            },
                            updateCompass: function (data) {
                                dashboard.compassGauge.value=data;
                            },
                            updateSpeed: function (data) {
                                dashboard.speedGauge.value=data;
                            },
                            updateBatteryState: function (data) {
                                var layer = dashboard.layers.batteryLayer;
                                addBattery(layer, data);
                                layer.draw();
                            }
                        };
                        var speedLayer = new Konva.Layer({
                            x: 0,
                            y: window.innerHeight / 3,
                            listening: false,
                            id: 'speedLayer'
                        });
                        dashboard.layers.batteryLayer = speedLayer.clone({
                            x: wWidth * 2 / 3,
                            id: 'batteryLayer'
                        });
                        dashboard.layers.compassLayer = speedLayer.clone({
                            x: wWidth / 3*1.1,
                            id: 'compassLayer'
                        });
                        dashboard.layers.labelLayer = speedLayer.clone({
                            x:0,
                            y: 0,
                            id: 'labelLayer',
                            opacity: .8
                        });
                        addBattery(dashboard.layers.batteryLayer, 0);

                        //其他运行数据，不易仪表盘化
                        var index1 = 0;
                        konvaConfig.dashboardLabels.labels.forEach(function () {
                            addLabel(konvaConfig.dashboardLabels.labelPositions[index1].x,konvaConfig.dashboardLabels.labelPositions[index1].y,
                                konvaConfig.dashboardLabels.labelNames[index1],'0',konvaConfig.dashboardLabels.labels[index1],dashboard.layers.labelLayer);
                            ++index1;
                        });
                        stage.add( dashboard.layers.batteryLayer, dashboard.layers.labelLayer);
                        dashboard.hide();
                        initSpeedDashboard();
                        intiCompass();
                        return dashboard;
                        function initSpeedDashboard() {
                            var speedGauge = new RadialGauge({
                                renderTo: 'speedGauge', // identifier of HTML canvas element or element itself
                                width: 300,
                                height: 300,
                                units: 'm/min',
                                title: false,
                                value: 0,
                                minValue: 0,
                                maxValue: 220,
                                majorTicks: [
                                    '0','20','40','60','80','100','120','140','160','180','200','220'
                                ],
                                minorTicks: 2,
                                strokeTicks: false,
                                highlights: [
                                    { from: 0, to: 50, color: 'rgba(0,255,0,.15)' },
                                    { from: 50, to: 100, color: 'rgba(255,255,0,.15)' },
                                    { from: 100, to: 150, color: 'rgba(255,30,0,.25)' },
                                    { from: 150, to: 200, color: 'rgba(255,0,225,.25)' },
                                    { from: 200, to: 220, color: 'rgba(0,0,255,.25)' }
                                ],
                                colorPlate: '#222',
                                colorMajorTicks: '#f5f5f5',
                                colorMinorTicks: '#ddd',
                                colorTitle: '#fff',
                                colorUnits: '#ccc',
                                colorNumbers: '#eee',
                                colorNeedleStart: 'rgba(240, 128, 128, 1)',
                                colorNeedleEnd: 'rgba(255, 160, 122, .9)',
                                valueBox: true,
                                animationRule: 'bounce'
                            });
                            dashboard.speedGauge=speedGauge;
                            $("#speedGauge").hide();
                            $("#speedGauge").offset({
                                top:wHeight*2/3-100,
                                left:wWidth*1/3
                            });
                            speedGauge.draw();
                        }

                        function intiCompass() {
                            var compassGauge = new RadialGauge({
                                renderTo:'compassGauge',
                                width: 200,
                                height: 200,
                                units: '°',
                                title: false,
                                value: 0,
                                minValue: 0,
                                maxValue: 360,
                                majorTicks: [
                                    'N','NE','E','SE','S','SW','W','NW','N'
                                ],
                                minorTicks: 22,
                                ticksAngle:360,
                                startAngle:180,
                                highlights:false,
                                colorPlate:"#222",
                                colorMajorTicks:"#f5f5f5",
                                colorMinorTicks:"#ddd",
                                colorNumbers:"#ccc",
                                colorNeedle:"rgba(240, 128, 128, 1)",
                                colorNeedleEnd:"rgba(255, 160, 122, .9)",
                                valueBox:false,
                                valueTextShadow:false,
                                colorCircleInner:"#fff",
                                colorNeedleCircleOuter:"#ccc",
                                needleCircleSize:15,
                                needleCircleOuter:false,
                                needleType:'line',
                                needleStart:75,
                                needleEnd:99,
                                needleWidth:3,
                                borders:3,
                                borderInnerWidth:0,
                                borderMiddleWidth:0,
                                borderOuterWidth:10,
                                colorBorderOuter:"#ccc",
                                colorBorderOuterEnd:"#ccc",
                                colorNeedleShadowDown:"#222",
                                animationTarget:"palte",
                                animationDuration:1500,
                                animationRule:"linear",
                                unit:"ᵍ",
                                strokeTicks: false
                            });
                            dashboard.compassGauge = compassGauge;
                            $("#compassGauge").hide();
                            $("#compassGauge").offset({
                                top:wHeight*2/3,
                                left:0
                            });
                            compassGauge.draw();
                        }

                        function addBattery(layer, v) {
                            var old = layer.findOne('#battery');
                            if (old) {
                                old.destroy();
                            }
                            var batteryImage;
                            if (v <= 0.25) {
                                batteryImage = imagePool['25_battery'];
                            } else if (v <= 0.5) {
                                batteryImage = imagePool['50_battery'];
                            } else if (v <= 0.75) {
                                batteryImage = imagePool['75_battery'];
                            } else {
                                batteryImage = imagePool['100_battery'];
                            }
                            var imageRatio=0.6;
                            var b_w=batteryImage.width*imageRatio;
                            var b_h=batteryImage.height*imageRatio;
                            var batteryKimage = new Konva.Image({
                                id: 'battery',
                                image: batteryImage,
                                x: 60,
                                y: 100,
                                width:b_w,
                                height:b_h
                            });
                            layer.add(batteryKimage);
                        }
                        function addLabel(x, y, label, content, id, layer) {
                            var kLabel = new Konva.Label({
                                id: id,
                                x: x,
                                y: y,
                                width:30
                            });
                            kLabel.add(new Konva.Tag({
                                fill: 'white',
                                cornerRadius: 5
                            }));
                            kLabel.add(new Konva.Text({
                                text: label  + content,
                                fontFamily: 'Times New Roman',
                                fontSize: 20,
                                padding: 5,
                                fill: 'black'
                            }));
                            layer.add(kLabel);
                            return kLabel.getText().getTextWidth();
                        }
                        function updateLabel(id, content, layer) {
                            var kLabel = layer.findOne('#' + id);
                            kLabel.getText().text(content);
                            return kLabel.getText().getTextWidth();
                        }
                    }(this));
                }
            }
        }

    }
    ()
);

function ActionCollections() {
    this.homeIcon = function (layer) {
        debugger;
        layer.hide();
        pageCollection.dashboard.hide();
        pageCollection.homePage.layer.show();
    };
    this.dashboardIcon = function (layer) {
        layer.hide();
        pageCollection.commonPan.show();
        pageCollection.dashboard.show();
    };

    this.shutdown = function () {

    };
}

function screen_pixel_ratio(x,screen_x,ratio){
    return screen_x*ratio/x;
}









