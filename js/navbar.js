// Copyright (c) 2018 Sho Kuroda <krdlab@gmail.com>
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

const createDomainButton = (domain, title) => {
  const click = () => {
    const dd = document.querySelector('#navbar-brand > a');
    dd.click();
    const target = document.querySelector(`#${domain} > a`);
    target.click();
  };

  const a  = document.createElement('a');
  a.onclick = (e) => {
    click();
    return false;
  };
  a.href = "#";
  a.innerText = title;

  const li = document.createElement('li');
  li.appendChild(a);
  return li;
};

const shortcuts = document.createElement('li');
shortcuts.setAttribute('class', 'nav navbar-nav navbar-left');
shortcuts.setAttribute('id', 'direct-shortcuts');

const menu = document.querySelector('#navbar-menu'); // > ul.nav.navbar-nav.navbar-left');
menu.appendChild(shortcuts);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.method === 'get_domain_list') {
    const domains = document.querySelectorAll('#navbar-domain-list > li.domain');
    sendResponse(Array.from(domains).map(d => ({ id: d.id, name: d.querySelector('a').textContent })));
  }
  if (request.method === 'set_shortcuts') {
    const args = request.args;
    const shortcuts = document.querySelector('#direct-shortcuts');
    shortcuts.innerHTML = '';
    args.forEach(s => {
      if (s.displayName != null && s.displayName != '') {
        shortcuts.appendChild(createDomainButton(s.domainId, s.displayName));
      }
    });
  }
});
