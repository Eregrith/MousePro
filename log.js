/*
*
* Mouse Pro
*
* loot.js
*/

(function (Log) {

    Log.log = function(msg, category) {
        let ul = document.getElementById('log');
        let logItem = Log.buildLogItem(msg, category);
        ul.appendChild(logItem);
        while (ul.children.length > 1000) {
            ul.removeChild(ul.childNodes[0]);
        }
        ul.parentElement.scrollTop = ul.parentElement.scrollHeight - ul.parentElement.clientHeight;
    };

    Log.buildLogItem = function(msg, category) {
        let li = document.createElement('li');
        li.className = 'log-item';
        li.setAttribute('data-category', category);
        let date = new Date();
        let categoryTag = '';
        if (category)
            categoryTag = ' [' + category + ']';
        let seconds = date.getSeconds();
        if (seconds < 10)
            seconds = '0' + seconds;
        let minutes = date.getMinutes();
        if (minutes < 10)
            minutes = '0' + minutes;
        let hours = date.getHours();
        if (hours < 10)
            hours = '0' + hours;
        li.innerHTML = '<div class="log-time">' + hours + ':' + minutes + ':' + seconds + '</div> <div class="log-category">' + categoryTag + '</div>' + msg;
        return li;
    }

})(gameObjects.Log);