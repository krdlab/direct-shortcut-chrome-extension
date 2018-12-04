// Copyright (c) 2018 Sho Kuroda <krdlab@gmail.com>
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

const storeShortcuts = (shortcuts, callback) => {
  chrome.storage.local.set({shortcuts}, callback);
};

const restoreConfig = callback => {
  chrome.storage.local.get(['shortcuts'], result => {
    if (result && $.isArray(result.shortcuts)) {
      callback(result.shortcuts);
    }
  });
};

const setShortcuts = shortcuts => {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {method: 'set_shortcuts', args: shortcuts}, () => {});
  });
};

const getDomainList = callback => {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {method: 'get_domain_list'}, list => {
      if (list && $.isArray(list)) {
        callback(list);
      }
    });
  });
};

const resolveTextInputFromSelect = $it => $(`#${$it.attr('name')}_display_name`);

$(document).ready(function() {
  getDomainList(list => {
    const $select = $('select');
    list.forEach(d => $select.append(`<option value="${d.id}">${d.name}</option>`));
    $select.formSelect();

    restoreConfig(conf => {
      conf.forEach((sc, i) => {
        if (i < $select.length) {
          const $it = $select.eq(i);
          $it.val(sc.domainId);
          resolveTextInputFromSelect($it).val(sc.displayName);
        }
      });
      $select.formSelect();
      setShortcuts(conf);
    });
  });

  $('#set_shortcuts').on('click', function() {
    const shortcuts = [];
    $('select').each(function() {
      const $select = $(this);
      const $input  = resolveTextInputFromSelect($select);
      shortcuts.push({domainId: $select.val(), displayName: $input.val()});
    });
    setShortcuts(shortcuts);

    const $status = $('#shortcuts_status');
    $status.text('saving...');
    storeShortcuts(shortcuts, () => $status.text('saved!'));
  });
});
