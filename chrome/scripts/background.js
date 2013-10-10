try {
    var port = chrome.extension.connect();
    port.onDisconnect.addListener(function(){});
} catch (e) {}

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    var douban_read_url_regex  = /read.douban.com\/reader\/ebook\//;
    if (changeInfo.status == 'complete') {
        if (douban_read_url_regex.test(tab.url)) {
            chrome.pageAction.show(tabId);
        }
    }
});

function open_option_page() {
    chrome.tabs.create({ url: 'options.html' });
}

function set_icon(tab_id, icon) {
    chrome.pageAction.setIcon({
        tabId: tab_id,
        path: 'images/' + icon
    });
}

function flash_icon(tab_id) {
    var i = 0;
    return setInterval(function(){
        set_icon(tab_id, i++ % 2 ? 'icon19.png':'icon19_2.png');
    }, 600);
}

// when clicked
chrome.pageAction.onClicked.addListener(function(tab) {
    // config if haven't
    if (!localStorage.to_email || !localStorage.server) {
        open_option_page();
        return;
    }

    var port = chrome.tabs.connect(tab.id);
    port.onMessage.addListener(function(msg) {
        if (!msg) {
            port.postMessage({call: 'show_result_tip', success: false});
            return;
        }
        send(msg.book_id, msg.book_data, function(data) {
            clearInterval(timeout);
            set_icon(tab.id, 'icon19.png');
            port.postMessage({call: 'show_result_tip', success: data.success});
        });
    });
    port.onDisconnect.addListener(function() {
        clearInterval(timeout);
    });

    // loading icon
    var timeout = flash_icon(tab.id);

    port.postMessage({call: 'get_current_book_data'});
});

function send(book_id, book_data, callback) {
    var to_email = localStorage.to_email,
        server = localStorage.server;

    if (!to_email || !server) {
        open_option_page();
        return;
    }

    $.post(server, {
        book_id: 'e' + book_id,
        book_data: book_data,
        to_email: to_email
    })
    .done(function(){
        callback({success:true});
    })
    .fail(function(){
        callback({success:false});
    });
}
