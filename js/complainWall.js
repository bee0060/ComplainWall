(function(global) {

	if (typeof window.localStorage['readIntroduction'] === undefined) {
		if (confirm("你应该是第一次来，建议你先点开页面右上角的 Introduction链接，看看抱怨墙的介绍。是不是现在就看？")) {
			location.href = "introduction.html";
		}
	}


	/*
	Format As:
	{
		id: 1,
		to: 'Peter',
		content: 'I hate you!',
		on: new Date()
	}
	*/
	var complainList = [];

	function loadComplainList() {
		getComplainList(bindComplainList);
	}

	function bindComplainList() {
		var list = $('.complainList');

		list.html('');

		var html = [];

		for (var i = complainList.length - 1; i >= 0; i--) {
			var li = $('li');
			li.addClass('complain');
			html.push('<li class="complain">',
				'To <a href="javascript:void(0);" onclick="selectComplainTo(this);">', complainList[i].to || 'somebody', '</a>',
				'<span> at ', formatDate(complainList[i].on), ': </span>',
				'<span>', complainList[i].content, '</span>',
				'</li>');
		}

		list.html(html.join(''));
	}

	function complain() {
		var to = $('#txtTo').val(),
			content = $('#txaContent').val();

		if (!to || !content) {
			alert('你要抱怨谁？ 要抱怨什么？ 你总得写一下吧.');
			return false;
		}

		if (!/^[a-z ]+$/gi.test(to)) {
			alert('这里只能对英文名抱怨');
		}

		saveComplain({
			id: complainList.length + 1,
			to: to,
			content: content,
			on: new Date()
		}, function() {
			loadComplainList();
			alert('抱怨成功！');
		});
	}


	function getComplainList(callback) {
		$.ajax({
			url: 'http://10.22.16.68:4000/complaint/list',
			dataType: 'JSON',
			type: 'GET',
			success: function(response) {
				complainList = [];
				for (var i = 0, len = response.length; i < len; i++) {
					complainList.push({
						id: response[i].id,
						to: response[i].complainTo,
						content: response[i].complainContent,
						on: response[i].complainDate
					});
				}

				if (typeof callback === 'function') {
					callback(response);
				}
			}
		});
	}

	function saveComplain(complainObject, callback) {
		complainList.push(complainObject);
		$.ajax({
			url: 'http://10.22.16.68:4000/complaint',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json;charset=UTF-8'
			},
			dataType: 'JSON',
			data: JSON.stringify({
				complainTo: complainObject.to,
				complainContent: complainObject.content
			}),
			type: 'POST',
			success: function(response) {
				if (typeof callback === 'function') {
					callback(response);
				}
			}
		});
	}

	function selectComplainTo(o) {
		$('#txtTo').val($(o).text());
	}

	/* Common functions */
	function formatDate(date) {
		var d = new Date(date);
		if (date && d instanceof Date) {
			return date.toLocaleString();
		}
		return 'Sometime';
	}

	$(document).on('keydown', function(e) {
		if (e.ctrlKey && e.keyCode === 13) {
			complain();
		}
	});

	loadComplainList();

	// 10秒自动刷新一次
	setInterval(function() {
		loadComplainList();
	}, 1000 * 10)


	// register to global
	global = global || window;
	global.complain = complain;
	global.selectComplainTo = selectComplainTo;

})(window);