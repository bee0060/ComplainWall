(function(global, db) {

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
	var BE_URL = 'http://10.22.16.68:4000/',
		complainList = [],
		currentLength = 0;

	function registerDataAutoSync() {
		var ref = db.ref('complains/');
		ref.on('value', function(snapshot) {
			var srcData = snapshot.val(),
				list = [],
				ele;

			complainList = [];

			console.log('value', snapshot.val());

			for (var key in srcData) {
				ele = srcData[key];

				complainList.push({
					id: ele.id,
					to: decodeURIComponent(ele.to),
					content: decodeURIComponent(ele.content),
					on: new Date(ele.on)
				});
			}

			bindComplainList();
		});
	}

	function bindComplainList() {
		var list = $('.complainList'),
			targetComplainLength = complainList.length,
			newComplainCount = targetComplainLength - currentLength;

		var arrHtml = [],
			strHtml = '';


		for (var i = complainList.length - 1; i >= currentLength; i--) {
			var li = $('li');
			li.addClass('complain');
			arrHtml.push('<li style="opacity:0;" class="complain">',
				'To <a href="javascript:void(0);"	>', complainList[i].to || 'somebody', '</a>',
				'<span class="complain-on"> at ', formatDate(complainList[i].on), ': </span>',
				'<span>', complainList[i].content, '</span>',
				'</li>');
		}

		strHtml = arrHtml.join('');

		if (currentLength) {
			$(strHtml).insertBefore(list.find(':eq(0)'));
		} else {
			list.append(strHtml);
		}

		currentLength = targetComplainLength;
		$(list).find('li:lt(' + newComplainCount + ')').animate({
			'opacity': 1
		}, 1500);
	}

	function complain() {
		var to = $('#txtTo').val(),
			content = $('#txaContent').val(),
			now = +(new Date());

		if (!to || !content) {
			alert('你要抱怨谁？ 要抱怨什么？ 你总得写一下吧.');
			return false;
		}

		if (!/^[a-z ]+$/i.test(to)) {
			alert('这里只能对英文名抱怨');
		}

		saveComplain({
			id: complainList.length + 1,
			to: to,
			content: content,
			on: now
		}, function() {
			resetInputFields();
		});
	}

	function resetInputFields() {
		var txtTo = $('#txtTo'),
			txaContent = $('#txaContent');

		txtTo.val('');
		txaContent.val('');
	}

	function saveComplain(complainObject, callback) {
		complainObject = db.ref('complains/').push(complainObject);

		if (typeof callback === 'function') {
			callback(response);
		}

		complainList.push(complainObject);
	}

	function selectComplainTo(o) {
		$('#txtTo').val($(o).text());
	}

	/* Common functions */
	function formatDate(date) {
		var d = new Date(date);
		if (date && d instanceof Date) {
			var year = d.getFullYear(),
				month = padLeft(d.getMonth() + 1, 2, 0),
				date = padLeft(d.getDate(), 2, 0),
				hour = padLeft(d.getHours() + 8, 2, 0),
				min = padLeft(d.getMinutes(), 2, 0),
				sec = padLeft(d.getSeconds(), 2, 0);

			return year + '/' + month + '/' + date + ' ' + hour + ':' + min;
		}
		return 'Sometime';
	}

	function padLeft(str, len, char) {
		if (!str || !len) {
			return '';
		}

		var strLen = str.toString().length;

		if (strLen >= len) {
			return str;
		} else {
			arr = new Array(len - strLen + 1);
			return arr.join(char) + str;
		}
	}


	registerDataAutoSync();

	// 注册热键事件
	$(document).on('keydown', function(e) {
		if (e.ctrlKey && e.keyCode === 13) {
			complain();
		}
	});

	$('#btnComplain').on('click', function(e) {
		complain();
	});

	$('.complainList').on('click', 'li a', function(e) {
		selectComplainTo(e.target);
	})

	// register to global
	global = global || window;

})(window, firebase.database());