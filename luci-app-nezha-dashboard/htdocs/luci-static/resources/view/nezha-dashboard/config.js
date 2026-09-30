'use strict';
'require view';
'require form';
'require fs';
'require rpc';
'require poll';
'require uci';

var callServiceList = rpc.declare({
	object: 'service',
	method: 'list',
	params: [ 'name' ],
	expect: { '': {} }
});

function isRunning() {
	return L.resolveDefault(callServiceList('nezha-dashboard'), {}).then(function (res) {
		try {
			var inst = res['nezha-dashboard']['instances'];
			return Object.keys(inst).some(function (k) { return inst[k].running; });
		} catch (e) {
			return false;
		}
	});
}

function panelUrl() {
	var port = uci.get('nezha-dashboard', 'main', 'listen_port') || '8008';
	return 'http://' + window.location.hostname + ':' + port + '/';
}

function renderStatus(running) {
	var nodes = [
		E('span', { 'style': 'color:' + (running ? 'green' : 'red') + ';font-weight:bold' },
			running ? _('RUNNING') : _('NOT RUNNING'))
	];
	if (running) {
		nodes.push(' ');
		nodes.push(E('button', {
			'class': 'cbi-button cbi-button-apply',
			'click': function (ev) { ev.preventDefault(); window.open(panelUrl(), '_blank'); }
		}, _('Open Dashboard')));
	}
	return E('span', {}, nodes);
}

return view.extend({
	load: function () {
		return Promise.all([
			isRunning(),
			L.resolveDefault(fs.exec_direct('/sbin/logread', [ '-e', '[Nn][Ee][Zz][Hh][Aa]' ]), ''),
			uci.load('nezha-dashboard')
		]);
	},

	render: function (data) {
		var running = data[0];
		var logs = (data[1] || '').trim().split('\n').slice(-100).join('\n');
		var m, s, o;

		m = new form.Map('nezha-dashboard', _('Nezha Dashboard'));

		s = m.section(form.NamedSection, 'main', 'nezha_dashboard');
		s.addremove = false;
		s.anonymous = true;

		s.tab('general', _('General Settings'));
		s.tab('log', _('Log'));

		o = s.taboption('general', form.Flag, 'enabled', _('Enable'));
		o.rmempty = false;

		o = s.taboption('general', form.Value, 'listen_port', _('Listen port'));
		o.datatype = 'port';
		o.default = '8008';
		o.rmempty = false;

		o = s.taboption('general', form.Value, 'listen_host', _('Listen address'));
		o.datatype = 'ipaddr';
		o.placeholder = '0.0.0.0';
		o.optional = true;

		o = s.taboption('general', form.Flag, 'open_wan', _('Allow access from WAN'));
		o.default = o.disabled;
		o.rmempty = false;

		o = s.taboption('general', form.Value, 'install_host', _('Agent connect address'));
		o.placeholder = 'ddns.example.com:8008';
		o.optional = true;
		o.validate = function (section_id, value) {
			if (!value) return true;
			if (!/^(\[[0-9a-fA-F:.]+\]|[A-Za-z0-9._-]+):[0-9]{1,5}$/.test(value))
				return _('Expecting: host:port');
			return true;
		};

		o = s.taboption('general', form.Value, 'data_dir', _('Data directory'));
		o.default = '/etc/nezha-dashboard';
		o.rmempty = false;
		o.validate = function (section_id, value) {
			if (!/^\/[A-Za-z0-9._\/-]+$/.test(value) || value.indexOf('..') >= 0)
				return _('Expecting: absolute path without spaces or quotes');
			return true;
		};

		o = s.taboption('general', form.Value, 'location', _('Time zone'));
		o.value('Asia/Shanghai');
		o.value('Asia/Hong_Kong');
		o.value('Asia/Tokyo');
		o.value('UTC');
		o.default = 'Asia/Shanghai';
		o.optional = true;
		o.validate = function (section_id, value) {
			if (value && !/^[A-Za-z0-9_+\/-]+$/.test(value))
				return _('Expecting: time zone name, e.g. Asia/Shanghai');
			return true;
		};

		o = s.taboption('general', form.Value, 'language', _('Language'));
		o.value('zh_CN', '简体中文');
		o.value('zh_TW', '繁體中文');
		o.value('en_US', 'English');
		o.value('ja_JP', '日本語');
		o.default = 'zh_CN';
		o.optional = true;
		o.validate = function (section_id, value) {
			if (value && !/^[a-z]{2,3}(_[A-Za-z]{2,4})?$/.test(value))
				return _('Expecting: locale code, e.g. zh_CN');
			return true;
		};

		o = s.taboption('log', form.DummyValue, '_log');
		o.rawhtml = true;
		o.cfgvalue = function () {
			return E('textarea', {
				'readonly': 'readonly',
				'wrap': 'off',
				'rows': 20,
				'style': 'width:100%;font-family:monospace;font-size:12px'
			}, [ logs || _('No log entries.') ]).outerHTML;
		};

		var statusEl = E('span', {}, renderStatus(running));
		poll.add(function () {
			return isRunning().then(function (r) {
				statusEl.innerHTML = '';
				statusEl.appendChild(renderStatus(r));
			});
		});

		return m.render().then(function (node) {
			return E('div', {}, [
				E('div', { 'class': 'cbi-section' }, [
					E('h3', {}, _('Service status')),
					E('p', {}, [ _('Nezha Dashboard is '), statusEl ])
				]),
				node
			]);
		});
	}
});
