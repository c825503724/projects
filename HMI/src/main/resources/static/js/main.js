var wWidth = window.innerWidth;
var wHeight = window.innerHeight;
var stage = new Konva.Stage({
    container: 'container',
    width: wWidth,
    height: wHeight
});
var iCurrentSpeed = 20,
    iTargetSpeed = 20,
    bDecrement = null,
    job = null;
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
                            draw: function () {
                                for (var o in dashboard.layers) {
                                    dashboard.layers[o].draw();
                                }
                            },
                            hide: function () {
                                for (var o in dashboard.layers) {
                                    dashboard.layers[o].hide();
                                }
                            },
                            show: function () {
                                for (var o in dashboard.layers) {
                                    dashboard.layers[o].show();
                                }
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
                                dashboard.needle.to({rotation: data, duration: 1});
                            },
                            updateSpeed: function (data) {
                                var layer = dashboard.layers.speedLayer;
                                addSpeedDashboard(layer, data);
                                layer.draw();
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
                        var batteryLayer = speedLayer.clone({
                            x: wWidth * 2 / 3,
                            id: 'batteryLayer'
                        });
                        var compassLayer = speedLayer.clone({
                            x: wWidth / 3*1.1,
                            id: 'compassLayer'
                        });
                        var labelLayer = speedLayer.clone({
                            x:0,
                            y: 0,
                            id: 'labelLayer',
                            opacity: .8
                        });
                        dashboard.layers.labelLayer = labelLayer;
                        dashboard.layers.speedLayer = speedLayer;
                        dashboard.layers.batteryLayer = batteryLayer;
                        dashboard.layers.compassLayer = compassLayer;
                        addCompass(compassLayer);
                        addBattery(batteryLayer, 0);
                        addSpeedDashboard(speedLayer, 0);

                        //其他运行数据，不易仪表盘化
                        var index1 = 0;
                        konvaConfig.dashboardLabels.labels.forEach(function () {
                            addLabel(konvaConfig.dashboardLabels.labelPositions[index1].x,konvaConfig.dashboardLabels.labelPositions[index1].y,
                                konvaConfig.dashboardLabels.labelNames[index1],'0',konvaConfig.dashboardLabels.labels[index1],labelLayer);
                            ++index1;
                        });


                        stage.add(speedLayer, batteryLayer, compassLayer, labelLayer);
                        dashboard.hide();
                        return dashboard;

                        function addCompass(layer) {
                            var compassImage = imagePool['compass'];
                            var compassKimage = new Konva.Image({
                                id: 'compass',
                                image: compassImage,
                                x: 0,
                                y: 0,
                                width: compassImage.width * 1.5,
                                height: compassImage.height * 1.5,
                                opacity: .8
                            });
                            layer.add(compassKimage);
                            var ImageYoda = imagePool['needle'];
                            needleKimage = new Konva.Image({
                                id: 'needle',
                                image: ImageYoda,
                                x: compassKimage.getX() + ImageYoda.width * 1.5 / 2,
                                y: compassKimage.getY() + ImageYoda.height * 1.5 / 2,
                                width: ImageYoda.width * 1.5,
                                height: ImageYoda.height * 1.5,
                                offset: {
                                    x: ImageYoda.width * 1.5 / 2,
                                    y: ImageYoda.height * 1.5 / 2,
                                    opacity: .8
                                }
                            });
                            dashboard.needle = needleKimage;
                            layer.add(needleKimage);
                        }
                        function addSpeedDashboard(layer, v) {
                            var old = layer.findOne('#speed');
                            if (old) {
                                old.destroy();
                            }
                                var speedDashBord = new Konva.Shape({
                                    id: 'speed',
                                    sceneFunc: function (context) {
                                        drawSpeedDashboard(context, v);
                                    }
                                });
                                layer.add(speedDashBord);

                            function drawSpeedDashboard(context, v) {
                                drawWithInputValue(v);
                                function degToRad(angle) {
                                    // Degrees to radians
                                    return ((angle * Math.PI) / 180);
                                }
                                function radToDeg(angle) {
                                    // Radians to degree
                                    return ((angle * 180) / Math.PI);
                                }
                                function drawLine(options, line) {
                                    // Draw a line using the line object passed in
                                    options.ctx.beginPath();

                                    // Set attributes of open
                                    options.ctx.globalAlpha = line.alpha;
                                    options.ctx.lineWidth = line.lineWidth;
                                    options.ctx.fillStyle = line.fillStyle;
                                    options.ctx.strokeStyle = line.fillStyle;
                                    options.ctx.moveTo(line.from.X,
                                        line.from.Y);
                                    // Plot the line
                                    options.ctx.lineTo(
                                        line.to.X,
                                        line.to.Y
                                    );
                                    options.ctx.stroke();
                                }
                                function createLine(fromX, fromY, toX, toY, fillStyle, lineWidth, alpha) {
                                    // Create a line object using Javascript object notation
                                    return {
                                        from: {
                                            X: fromX,
                                            Y: fromY
                                        },
                                        to: {
                                            X: toX,
                                            Y: toY
                                        },
                                        fillStyle: fillStyle,
                                        lineWidth: lineWidth,
                                        alpha: alpha
                                    };
                                }
                                function drawOuterMetallicArc(options) {
                                    /* Draw the metallic border of the speedometer
                                     * Outer grey area
                                     */
                                    options.ctx.beginPath();

                                    // Nice shade of grey
                                    options.ctx.fillStyle = "rgb(127,127,127)";

                                    // Draw the outer circle
                                    options.ctx.arc(options.center.X,
                                        options.center.Y,
                                        options.radius,
                                        0,
                                        Math.PI,
                                        true);

                                    // Fill the last object
                                    options.ctx.fill();
                                }
                                function drawInnerMetallicArc(options) {
                                    /* Draw the metallic border of the speedometer
                                     * Inner white area
                                     */

                                    options.ctx.beginPath();

                                    // White
                                    options.ctx.fillStyle = "rgb(255,255,255)";

                                    // Outer circle (subtle edge in the grey)
                                    options.ctx.arc(options.center.X,
                                        options.center.Y,
                                        (options.radius / 100) * 90,
                                        0,
                                        Math.PI,
                                        true);

                                    options.ctx.fill();
                                }
                                function drawMetallicArc(options) {
                                    /* Draw the metallic border of the speedometer
                                     * by drawing two semi-circles, one over lapping
                                     * the other with a bot of alpha transparency
                                     */

                                    drawOuterMetallicArc(options);
                                    drawInnerMetallicArc(options);
                                }
                                function drawBackground(options) {
                                    /* Black background with alphs transparency to
                                     * blend the edges of the metallic edge and
                                     * black background
                                     */
                                    var i = 0;
                                    options.ctx.globalAlpha = 0.2;
                                    options.ctx.fillStyle = "rgb(0,0,0)";
                                    // Draw semi-transparent circles
                                    for (i = 120; i < 130; i++) {
                                        options.ctx.beginPath();
                                        options.ctx.arc(options.center.X,
                                            options.center.Y,
                                            i,
                                            0,
                                            Math.PI,
                                            true);
                                        options.ctx.fill();
                                    }
                                }

                                function applyDefaultContextSettings(options) {
                                    /* Helper function to revert to gauges
                                     * default settings
                                     */

                                    options.ctx.lineWidth = 2;
                                    options.ctx.globalAlpha = 0.5;
                                    options.ctx.strokeStyle = "rgb(255, 255, 255)";
                                    options.ctx.fillStyle = 'rgb(255,255,255)';
                                }

                                function drawSmallTickMarks(options) {
                                    /* The small tick marks against the coloured
                                     * arc drawn every 5 mph from 10 degrees to
                                     * 170 degrees.
                                     */

                                    var tickvalue = options.levelRadius - 8,
                                        iTick = 0,
                                        gaugeOptions = options.gaugeOptions,
                                        iTickRad = 0,
                                        onArchX,
                                        onArchY,
                                        innerTickX,
                                        innerTickY,
                                        fromX,
                                        fromY,
                                        line,
                                        toX,
                                        toY;

                                    applyDefaultContextSettings(options);

                                    // Tick every 20 degrees (small ticks)
                                    for (iTick = 10; iTick < 180; iTick += 20) {

                                        iTickRad = degToRad(iTick);

                                        /* Calculate the X and Y of both ends of the
                                         * line I need to draw at angle represented at Tick.
                                         * The aim is to draw the a line starting on the
                                         * coloured arc and continueing towards the outer edge
                                         * in the direction from the center of the gauge.
                                         */

                                        onArchX = gaugeOptions.radius - (Math.cos(iTickRad) * tickvalue);
                                        onArchY = gaugeOptions.radius - (Math.sin(iTickRad) * tickvalue);
                                        innerTickX = gaugeOptions.radius - (Math.cos(iTickRad) * gaugeOptions.radius);
                                        innerTickY = gaugeOptions.radius - (Math.sin(iTickRad) * gaugeOptions.radius);

                                        fromX = (options.center.X - gaugeOptions.radius) + onArchX;
                                        fromY = (gaugeOptions.center.Y - gaugeOptions.radius) + onArchY;
                                        toX = (options.center.X - gaugeOptions.radius) + innerTickX;
                                        toY = (gaugeOptions.center.Y - gaugeOptions.radius) + innerTickY;

                                        // Create a line expressed in JSON
                                        line = createLine(fromX, fromY, toX, toY, "rgb(127,127,127)", 3, 0.6);

                                        // Draw the line
                                        drawLine(options, line);

                                    }
                                }

                                function drawLargeTickMarks(options) {
                                    /* The large tick marks against the coloured
                                     * arc drawn every 10 mph from 10 degrees to
                                     * 170 degrees.
                                     */

                                    var tickvalue = options.levelRadius - 8,
                                        iTick = 0,
                                        gaugeOptions = options.gaugeOptions,
                                        iTickRad = 0,
                                        innerTickY,
                                        innerTickX,
                                        onArchX,
                                        onArchY,
                                        fromX,
                                        fromY,
                                        toX,
                                        toY,
                                        line;

                                    applyDefaultContextSettings(options);

                                    tickvalue = options.levelRadius - 2;

                                    // 10 units (major ticks)
                                    for (iTick = 20; iTick < 180; iTick += 20) {

                                        iTickRad = degToRad(iTick);

                                        /* Calculate the X and Y of both ends of the
                                         * line I need to draw at angle represented at Tick.
                                         * The aim is to draw the a line starting on the
                                         * coloured arc and continueing towards the outer edge
                                         * in the direction from the center of the gauge.
                                         */

                                        onArchX = gaugeOptions.radius - (Math.cos(iTickRad) * tickvalue);
                                        onArchY = gaugeOptions.radius - (Math.sin(iTickRad) * tickvalue);
                                        innerTickX = gaugeOptions.radius - (Math.cos(iTickRad) * gaugeOptions.radius);
                                        innerTickY = gaugeOptions.radius - (Math.sin(iTickRad) * gaugeOptions.radius);

                                        fromX = (options.center.X - gaugeOptions.radius) + onArchX;
                                        fromY = (gaugeOptions.center.Y - gaugeOptions.radius) + onArchY;
                                        toX = (options.center.X - gaugeOptions.radius) + innerTickX;
                                        toY = (gaugeOptions.center.Y - gaugeOptions.radius) + innerTickY;

                                        // Create a line expressed in JSON
                                        line = createLine(fromX, fromY, toX, toY, "rgb(127,127,127)", 3, 0.6);

                                        // Draw the line
                                        drawLine(options, line);
                                    }
                                }

                                function drawTicks(options) {
                                    /* Two tick in the coloured arc!
                                     * Small ticks every 5
                                     * Large ticks every 10
                                     */
                                    drawSmallTickMarks(options);
                                    drawLargeTickMarks(options);
                                }

                                function drawTextMarkers(options) {
                                    /* The text labels marks above the coloured
                                     * arc drawn every 10 mph from 10 degrees to
                                     * 170 degrees.
                                     */
                                    var innerTickX = 0,
                                        innerTickY = 0,
                                        iTick = 0,
                                        gaugeOptions = options.gaugeOptions,
                                        iTickToPrint = 0;

                                    applyDefaultContextSettings(options);

                                    // Font styling
                                    options.ctx.font = 'italic 10px sans-serif';
                                    options.ctx.textBaseline = 'top';

                                    options.ctx.beginPath();

                                    // Tick every 20 (small ticks)
                                    for (iTick = 10; iTick < 180; iTick += 20) {

                                        innerTickX = gaugeOptions.radius - (Math.cos(degToRad(iTick)) * gaugeOptions.radius);
                                        innerTickY = gaugeOptions.radius - (Math.sin(degToRad(iTick)) * gaugeOptions.radius);

                                        // Some cludging to center the values (TODO: Improve)
                                        if (iTick <= 10) {
                                            options.ctx.fillText(iTickToPrint, (options.center.X - gaugeOptions.radius - 12) + innerTickX,
                                                (gaugeOptions.center.Y - gaugeOptions.radius - 12) + innerTickY + 5);
                                        } else if (iTick < 50) {
                                            options.ctx.fillText(iTickToPrint, (options.center.X - gaugeOptions.radius - 12) + innerTickX - 5,
                                                (gaugeOptions.center.Y - gaugeOptions.radius - 12) + innerTickY + 5);
                                        } else if (iTick < 90) {
                                            options.ctx.fillText(iTickToPrint, (options.center.X - gaugeOptions.radius - 12) + innerTickX,
                                                (gaugeOptions.center.Y - gaugeOptions.radius - 12) + innerTickY);
                                        } else if (iTick === 90) {
                                            options.ctx.fillText(iTickToPrint, (options.center.X - gaugeOptions.radius - 12) + innerTickX + 4,
                                                (gaugeOptions.center.Y - gaugeOptions.radius - 12) + innerTickY);
                                        } else if (iTick < 145) {
                                            options.ctx.fillText(iTickToPrint, (options.center.X - gaugeOptions.radius - 12) + innerTickX + 10,
                                                (gaugeOptions.center.Y - gaugeOptions.radius - 12) + innerTickY);
                                        } else {
                                            options.ctx.fillText(iTickToPrint, (options.center.X - gaugeOptions.radius - 12) + innerTickX + 15,
                                                (gaugeOptions.center.Y - gaugeOptions.radius - 12) + innerTickY + 5);
                                        }

                                        // MPH increase by 10 every 20 degrees
                                        iTickToPrint += Math.round(2160 / 9);
                                    }

                                    options.ctx.stroke();
                                }

                                function drawSpeedometerPart(options, alphaValue, strokeStyle, startPos) {
                                    /* Draw part of the arc that represents
                                    * the colour speedometer arc
                                    */

                                    options.ctx.beginPath();

                                    options.ctx.globalAlpha = alphaValue;
                                    options.ctx.lineWidth = 5;
                                    options.ctx.strokeStyle = strokeStyle;

                                    options.ctx.arc(options.center.X,
                                        options.center.Y,
                                        options.levelRadius,
                                        Math.PI + (Math.PI / 360 * startPos),
                                        0 - (Math.PI / 360 * 10),
                                        false);

                                    options.ctx.stroke();
                                }

                                function drawSpeedometerColourArc(options) {
                                    /* Draws the colour arc.  Three different colours
                                     * used here; thus, same arc drawn 3 times with
                                     * different colours.
                                     * TODO: Gradient possible?
                                     */

                                    var startOfGreen = 10,
                                        endOfGreen = 200,
                                        endOfOrange = 280;

                                    drawSpeedometerPart(options, 1.0, "rgb(82, 240, 55)", startOfGreen);
                                    drawSpeedometerPart(options, 0.9, "rgb(198, 111, 0)", endOfGreen);
                                    drawSpeedometerPart(options, 0.9, "rgb(255, 0, 0)", endOfOrange);

                                }

                                function drawNeedleDial(options, alphaValue, strokeStyle, fillStyle) {
                                    /* Draws the metallic dial that covers the base of the
                                    * needle.
                                    */
                                    var i = 0;

                                    options.ctx.globalAlpha = alphaValue;
                                    options.ctx.lineWidth = 3;
                                    options.ctx.strokeStyle = strokeStyle;
                                    options.ctx.fillStyle = fillStyle;

                                    // Draw several transparent circles with alpha
                                    for (i = 0; i < 30; i++) {

                                        options.ctx.beginPath();
                                        options.ctx.arc(options.center.X,
                                            options.center.Y,
                                            i,
                                            0,
                                            Math.PI,
                                            true);

                                        options.ctx.fill();
                                        options.ctx.stroke();
                                    }
                                }

                                function convertSpeedToAngle(options) {
                                    /* Helper function to convert a speed to the
                                    * equivelant angle.
                                    */
                                    var iSpeed = (options.speed / 10),
                                        iSpeedAsAngle = ((iSpeed * 20) + 10) % 180;

                                    // Ensure the angle is within range
                                    if (iSpeedAsAngle > 180) {
                                        iSpeedAsAngle = iSpeedAsAngle - 180;
                                    } else if (iSpeedAsAngle < 0) {
                                        iSpeedAsAngle = iSpeedAsAngle + 180;
                                    }

                                    return iSpeedAsAngle;
                                }

                                function drawNeedle(options) {
                                    /* Draw the needle in a nice read colour at the
                                    * angle that represents the options.speed value.
                                    */

                                    var iSpeedAsAngle = convertSpeedToAngle(options),
                                        iSpeedAsAngleRad = degToRad(iSpeedAsAngle),
                                        gaugeOptions = options.gaugeOptions,
                                        innerTickX = gaugeOptions.radius - (Math.cos(iSpeedAsAngleRad) * 20),
                                        innerTickY = gaugeOptions.radius - (Math.sin(iSpeedAsAngleRad) * 20),
                                        fromX = (options.center.X - gaugeOptions.radius) + innerTickX,
                                        fromY = (gaugeOptions.center.Y - gaugeOptions.radius) + innerTickY,
                                        endNeedleX = gaugeOptions.radius - (Math.cos(iSpeedAsAngleRad) * gaugeOptions.radius),
                                        endNeedleY = gaugeOptions.radius - (Math.sin(iSpeedAsAngleRad) * gaugeOptions.radius),
                                        toX = (options.center.X - gaugeOptions.radius) + endNeedleX,
                                        toY = (gaugeOptions.center.Y - gaugeOptions.radius) + endNeedleY,
                                        line = createLine(fromX, fromY, toX, toY, "rgb(255,0,0)", 5, 0.6);

                                    drawLine(options, line);

                                    // Two circle to draw the dial at the base (give its a nice effect?)
                                    drawNeedleDial(options, 0.6, "rgb(127, 127, 127)", "rgb(255,255,255)");
                                    drawNeedleDial(options, 0.2, "rgb(127, 127, 127)", "rgb(127,127,127)");

                                }

                                function buildOptionsAsJSON(iSpeed) {
                                    /* Setting for the speedometer
                                    * Alter these to modify its look and feel
                                    */

                                    var centerX = wWidth * 2 / 10,
                                        centerY = wHeight *6/8,
                                        radius = 80,
                                        outerRadius = 90;

                                    // Create a speedometer object using Javascript object notation
                                    return {
                                        ctx: context,
                                        speed: iSpeed,
                                        center: {
                                            X: centerX,
                                            Y: centerY
                                        },
                                        levelRadius: radius - 10,
                                        gaugeOptions: {
                                            center: {
                                                X: centerX,
                                                Y: centerY
                                            },
                                            radius: radius
                                        },
                                        radius: outerRadius
                                    };
                                }

                                function clearCanvas(options) {
                                    // options.ctx.clearRect(0, 0, 800, 600);
                                    applyDefaultContextSettings(options);
                                }

                                function draw() {
                                    /* Main entry point for drawing the speedometer
                                    * If canvas is not support alert the user.
                                    */

                                    options = buildOptionsAsJSON(iCurrentSpeed);

                                    // Clear canvas
                                    clearCanvas(options);

                                    // Draw the metallic styled edge
                                    drawMetallicArc(options);

                                    // Draw thw background
                                    drawBackground(options);

                                    // Draw tick marks
                                    drawTicks(options);

                                    // Draw labels on markers
                                    drawTextMarkers(options);

                                    // Draw speeometer colour arc
                                    drawSpeedometerColourArc(options);

                                    // Draw the needle and base
                                    drawNeedle(options);


                                    if (iTargetSpeed == iCurrentSpeed) {
                                        clearTimeout(job);
                                        options.ctx.restore();
                                        return;
                                    } else if (iTargetSpeed < iCurrentSpeed) {
                                        bDecrement = true;
                                    } else if (iTargetSpeed > iCurrentSpeed) {
                                        bDecrement = false;
                                    }

                                    if (bDecrement) {
                                        if (iCurrentSpeed - 10 < iTargetSpeed)
                                            iCurrentSpeed = iCurrentSpeed - 1;
                                        else
                                            iCurrentSpeed = iCurrentSpeed - 5;
                                    } else {

                                        if (iCurrentSpeed + 10 > iTargetSpeed)
                                            iCurrentSpeed = iCurrentSpeed + 1;
                                        else
                                            iCurrentSpeed = iCurrentSpeed + 5;
                                    }
                                    job = setTimeout(function () {
                                        draw();
                                    }, 5);

                                }

                                function drawWithInputValue(v) {

                                    var txtSpeed = v;

                                    if (txtSpeed !== null) {

                                        iTargetSpeed = txtSpeed;

                                        // Sanity checks
                                        if (isNaN(iTargetSpeed)) {
                                            iTargetSpeed = 0;
                                        } else if (iTargetSpeed < 0) {
                                            iTargetSpeed = 0;
                                        } else if (iTargetSpeed > 80) {
                                            iTargetSpeed = 80;
                                        }

                                        job = setTimeout(function () {
                                            draw();
                                        }, 5);

                                    }
                                }
                            }
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









