<div id="container">

</div>
<script type="text/javascript">

    $(function () {
        var stage=new Konva.Stage({
            container:'container',
            width:window.innerWidth,
            height:window.innerHeight
        });
        var backgroundLayer=new Konva.Layer();
        stage.add(backgroundLayer);
        var backgroundRect=new Konva.Rect({
            x:0,
            y:0,
            width:1000,
            height:1000,
            fill:'black'
        });
        backgroundLayer.add(backgroundRect);
        backgroundLayer.draw();
        var layer=new Konva.Layer();
        stage.add(layer);
        var rect=new Konva.Rect({
            x:100,
            y:100,
            width:100,
            height:200,
            opacity:.5,
            rotation:0,
            fill:'red'
        });
        rect.on("tap",function() {
            alert("ok");
        });
        layer.add(rect);
        layer.draw();
    });

</script>