var SECURITIES = [
    "AAPL.N",
    "AMZN.N",
    "QQQ.N",
    "NVDA.N",
    "TSLA.N",
    "FB.N",
    "MSFT.N",
    "CSCO.N",
    "GOOGL.N",
    "PCLN.N"
];

var CLIENTS = [
    "Homer",
    "Marge",
    "Bart",
    "Lisa",
    "Maggie"
]

var id = 0;

function newRow() {
    id = id % 100;
    return {
        name: SECURITIES[Math.floor(Math.random() * SECURITIES.length)],
        client: CLIENTS[Math.floor(Math.random() * CLIENTS.length)], 
        lastUpdate: new Date(),
        chg: Math.random() * 20 - 10,
        bid: Math.random() * 10 + 90,
        ask: Math.random() * 10 + 100,
        vol: Math.random() * 10 + 100,                    
        id: id++
    };
}

let z = 0;

var PHASES = ['a', 'b', 'c'];

var CONFIGS = [{
    view: 'vertical',
    'row-pivots': '["name"]',
    'column-pivots': '[]',
    aggregates: '{"bid":"sum"}',
    columns: '["bid"]',
    sort: '[]'
}, {
    view: 'scatter',
    'row-pivots': '["name"]',
    'column-pivots': '[]',
    columns: '["bid", "ask", "vol", "id"]',
    aggregates: '{"bid":"avg","ask":"avg", "vol":"avg"}',
    sort: '[]'
}, {
    view: 'horizontal',
    'row-pivots': '["name"]',
    'column-pivots': '["client"]',
    aggregates: '{"chg":"sum"}',
    columns: '["chg"]',
    sort: '[]'
}, {
    view: 'line',
    'row-pivots': '[]',
    'column-pivots': '[]',
    columns: '["lastUpdate", "bid"]',
    sort: '["lastUpdate"]'
}, {
    view: 'hypergrid',
    'row-pivots': '["name"]',
    'column-pivots': '["client"]',
    columns: '["bid", "chg"]',
    sort: '[]'
}, {
    view: 'hypergrid',
    'row-pivots': '[]',
    'column-pivots': '[]',
    columns: '["name", "chg", "lastUpdate", "bid", "ask", "client", "vol", "id"]',
    sort: '["lastUpdate"]'
}];

var last_index = 5, widget;

function rotate(phase) {
    if (widget) {
        (function (widget) {
            setTimeout(function () {
                if (widget._debounced) {
                    clearTimeout(widget._debounced);            
                }
                widget._debounced = true;
            }, 500);
        })(widget);
    }
    var p = PHASES[phase];
    widget = document.getElementById(p.toUpperCase());
    widget._debounced = undefined;
    var next_index;
    while (!next_index || last_index === next_index) {
        next_index = Math.floor(Math.random() * CONFIGS.length);
    }
    last_index = next_index;

    var config = CONFIGS[next_index];
    for (var key in config) {
        widget.setAttribute(key, config[key]);
    }
    widget._update();
    document.getElementById('container').className = p;
    setTimeout(function () { rotate((phase + 1) % PHASES.length); }, 10000);
}

var tbl;

function update() {
    tbl.update([newRow(), newRow(), newRow()]);
    setTimeout(update, 200);
}

window.addEventListener('WebComponentsReady', function () {
    var data = [];
    for (var x = 0; x < 100; x ++) {
        data.push(newRow());
    }
    var elems = Array.prototype.slice.call(document.querySelectorAll('#container perspective-viewer'));
    worker = elems[0].worker;

    tbl = worker.table(data, {index: "id"});
    for (var x in elems) {
        if (elems.hasOwnProperty(x)) {
            var elem = elems[x];
            elem.load(tbl);
            if (elem.getAttribute('id') !== 'A') {
                elem._debounced = true;
            } else {
                widget = elem;
            }
        }
    }
    setTimeout(function () {update(0)});
    setTimeout(function () {rotate(1);}, 10000);

});
