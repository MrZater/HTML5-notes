this.onmessage = function (e) {
    // console.log(e);//返回一个Massage对象
    let result = 0;
    for (let i = 0; i < e.data.num; i++) {
        result += i;
    }
    this.postMessage(result);//this.postMessage：将数据返回给主线程
    // this.close();//停止worker
}