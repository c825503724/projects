
<div class="container-fluid">
    <div class="row">
            <label style="vertical-align: middle;display:inline-block">时间:<input class="inputc" id="port_time"></label>
            <label style="vertical-align: middle;display:inline-block">车号:<input class="inputc" id="car_number"></label>
            <label style="vertical-align: middle;display:inline-block">位置x:<input class="inputc" id="position_x"></label>
            <label style="vertical-align: middle;display:inline-block">位置y:<input class="inputc" id="position_y"></label>
            <label style="vertical-align: middle;display:inline-block">当前点:<input class="inputc" id="current_position"></label>
            <label style="vertical-align: middle;display:inline-block">目标点:<input class="inputc" id="target_position"></label>
            <label style="vertical-align: middle;display:inline-block">当前段:<input class="inputc" id="segment"></label>
            <label style="vertical-align: middle;display:inline-block">操作状态:<input class="inputc" id="operation_state"></label>
            <label style="vertical-align: middle;display:inline-block">通信状态:<input class="inputc" id="communicate_state"></label>
        </div>
        <div class="row">
            <div style="width: 300px;margin: 0 auto;">
                <canvas id="hmi-speed" data-type="radial-gauge"
                        data-width="300"
                        data-height="300"
                        data-units="Km/h"
                        data-title="false"
                        data-value="0"
                        data-animate-on-init="true"
                        data-animated-value="true"
                        data-min-value="0"
                        data-max-value="220"
                        data-major-ticks="0,20,40,60,80,100,120,140,160,180,200,220"
                        data-minor-ticks="2"
                        data-stroke-ticks="false"
                        data-highlights='[
					{ "from": 0, "to": 50, "color": "rgba(0,255,0,.15)" },
					{ "from": 50, "to": 100, "color": "rgba(255,255,0,.15)" },
					{ "from": 100, "to": 150, "color": "rgba(255,30,0,.25)" },
					{ "from": 150, "to": 200, "color": "rgba(255,0,225,.25)" },
					{ "from": 200, "to": 220, "color": "rgba(0,0,255,.25)" }
				]'
                        data-color-plate="transparent"
                        data-color-major-ticks="#f5f5f5"
                        data-color-minor-ticks="#ddd"
                        data-color-title="#fff"
                        data-color-units="#ccc"
                        data-color-numbers="#eee"
                        data-color-needle-start="rgba(240, 128, 128, 1)"
                        data-color-needle-end="rgba(255, 160, 122, .9)"
                        data-value-box="true"
                        data-animation-rule="bounce"
                        data-animation-duration="500"
                        data-font-value="Led"
                        data-font-numbers="Led"
                        data-border-outer-width="3"
                        data-border-middle-width="3"
                        data-border-inner-width="3"
                ></canvas>
            </div>
            <div class="">
                <canvas id="hmi-battery" data-type="linear-gauge"
                        data-width="160"
                        data-height="300"
                        data-border-radius="20"
                        data-borders="0"
                        data-bar-begin-circle="false"
                        data-title="Battery"
                        data-units="kWh"
                        data-minor-ticks="10"
                        data-value="0"
                        data-major-ticks="0,10,20,30,40,50,60,70,80,90,100"
                        data-tick-side="right"
                        data-number-side="right"
                        data-needle-side="right"
                        data-animation-rule="bounce"
                        data-animation-duration="750"
                        data-bar-stroke-width="5"
                        data-value-box-border-radius="0"
                        data-value-text-shadow="false"
                ></canvas>
            </div>
            <div>
                <canvas id="hmi-direction" data-type="radial-gauge"
                        data-width="300"
                        data-height="300"
                        data-min-value="0"
                        data-max-value="360"
                        data-major-ticks="N,NE,E,SE,S,SW,W,NW,N"
                        data-minor-ticks="22"
                        data-ticks-angle="360"
                        data-start-angle="180"
                        data-stroke-ticks="false"
                        data-highlights="false"
                        data-color-plate="#222"
                        data-color-major-ticks="#f5f5f5"
                        data-color-minor-ticks="#ddd"
                        data-color-numbers="#ccc"
                        data-color-needle="rgba(240, 128, 128, 1)"
                        data-color-needle-end="rgba(255, 160, 122, .9)"
                        data-value-box="false"
                        data-value-text-shadow="false"
                        data-color-circle-inner="#fff"
                        data-color-needle-circle-outer="#ccc"
                        data-needle-circle-size="15"
                        data-needle-circle-outer="false"
                        data-animation-rule="linear"
                        data-needle-type="line"
                        data-needle-start="75"
                        data-needle-end="99"
                        data-needle-width="3"
                        data-borders="true"
                        data-border-inner-width="0"
                        data-border-middle-width="0"
                        data-border-outer-width="10"
                        data-color-border-outer="#ccc"
                        data-color-border-outer-end="#ccc"
                        data-color-needle-shadow-down="#222"
                        data-border-shadow-width="0"
                        data-font-value="Led"
                ></canvas>
            </div>




    </div>
</div>

<script>
    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function (cb) {
            var i = 0, s = this.length;
            for (; i < s; i++) {
                cb && cb(this[i], i, this);
            }
        }
    }

    document.fonts && document.fonts.forEach(function (font) {
        font.loaded.then(function () {
            if (font.family.match(/Led/)) {
                document.gauges.forEach(function (gauge) {
                    gauge.update();
                    gauge.options.renderTo.style.visibility = 'visible';
                });
            }
        });
    });

    var hmi_timer;

    function animateGauges() {
        startWatch();
        hmi_timer = setInterval(function () {
            getData();
        }, 1000)
    }

    function stopGaugesAnimation() {
        stopWatch();
        clearInterval(hmi_timer);
    }

    function getData() {
        $.ajax({
            url: "getLatest",
            type: "GET",
            success: function (data) {
                getRadialById("hmi-direction").value = data.theta;
                getRadialById("hmi-battery").value = data.power;
                getRadialById("hmi-speed").value = data.spead;
                $("#port_time").val(formatDate(data.createTime));
                $("#position_x").val(data.locationX);
                $("#position_y").val(data.locationY);
                $("#current_position").val(data.location);
                $("#target_position").val(data.targetLocation);
                $("#segment").val(data.route);
                $("#operation_state").val(data.operationStatus);
                $("#communicate_state").val(data.communicationStatus);
                $("#car_number").val(data.number);
            }
        })
    }

    function getRadialById(id) {
        var g;
        document.gauges.forEach(function (gauge) {
            if (gauge.options.renderTo.id === id) {
                g = gauge;
            }
        });
        return g;
    }

    function formatDate(ns) {
        var d = new Date(ns);
        var dFormat = [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('-')
                + ' ' + [d.getHours(), d.getMinutes(), d.getSeconds()].join(':');
        return dFormat;
    }

    function startWatch() {
        $.ajax({
            url: "start",
            type: "GET",
            success: function (data) {

            }
        });
    }

    function stopWatch() {
        $.ajax({
            url: "stop",
            type: "GET",
            success: function (data) {

            }
        });
    }
</script>