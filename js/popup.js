// Copyright (c) 2018 Sho Kuroda <krdlab@gmail.com>
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

$(document).ready(function() {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {method: 'get_domain_list'}, (res) => {
      res.forEach(d => $('select').append(`<option value="${d.id}">${d.name}</option>`));
      $('select').formSelect();
    });
  });

  $('#set_shortcuts').on('click', function() {
    const shortcuts = [];
    $('select').each(function() {
      const $select = $(this);
      const name = $select.attr('name');
      const $input = $(`#${name}_display_name`);
      shortcuts.push({domainId: $select.val(), displayName: $input.val()});
    });
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {method: 'set_shortcuts', args: shortcuts}, () => {});
    });
  });
});
