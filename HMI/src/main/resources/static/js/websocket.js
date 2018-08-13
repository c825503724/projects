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
window.onbeforeunload=function () {
    websocket.close();
};
