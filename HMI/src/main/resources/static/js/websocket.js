var websocket=null;
if('WebSocket' in window){
    websocket=new WebSocket('ws://localhost:8812/hmi/freshData');
}
websocket.onerror=function () {
    console.log('websocket error!');
};
websocket.onopen=function (event) {
    console.log("websocket connect success!");
};
websocket.onclose=function () {
    console.log('websocket close!');
};
websocket.onbeforeunload=function () {
    websocket.close();
};
websocket.onmessage=function (ev) {
    if(ev instanceof MessageEvent){
        var record=JSON.parse(ev.data);
        pageCollection.dashboard.update(record);
    }
};
