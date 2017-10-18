let form = $();
let tagFilter = $();
let sortField = $();
let log = $();
let loadMore = $();
let lastDate = null;

let TAGS = {
	"fragment": "Фрагмент",
	"clarity": "Ясность",
	"whisper": "Голос",
	"decomposition": "Разбор",
	"practice": "Практика",
	"past": "Прошлое",
	"ozv": "ОзВ",
	"ne": "НЭ",
	"morda": "Морда",
	"ozf": "ОзФ",
	"fantasy": "Фантазия",
	"feeling": "Ощущение",
	"develop": "Разработка",
	"not-for-bodhi": "Ненаписанное Бодху",
};

$(function() {
	if (location.search.indexOf("edit") !== -1) {
		$("body").addClass("editable")
	}
	form = $("#editor");
	tagFilter = $("#tag-filter");
	sortField = $("#sort-field");
	log = $("#log-list");
	loadMore = $("#load-more");

	let tagOptions = "<option></option>" + Object.keys(TAGS).map((key) => {
		return "<option value='" + key + "'>" + TAGS[key] + "</option>"
	}).join("");

	form.find("[name='tags']").html(tagOptions);
	tagFilter.html(tagOptions);

	form.submit(function() {
		let id = $(this).find("[name='id']").val();
		let title = $(this).find("[name='title']").val();
		let text = $(this).find("[name='text']").val();
		let tags = $(this).find("[name='tags']").val().filter(function(i) {
			return !!i
		});

		let data = {
			title: title,
			text: text,
			tags: tags,
		};

		let req;
		if (id !== "") {
			req = $.ajax({
				url: "/api/log-item/" + id,
				data: data,
				method: "PUT",
				dataType: "json",
			});
		} else {
			req = $.post("/api/log-item", data)
		}
		req.done(function() {
			form.find(':radio, :checkbox').removeAttr('checked').end()
				.find('textarea, :text, :hidden, select').val('');
			loadLog()
		});
		return false;
	});
	loadLog();

	$("body")
		.on("click", ".log-item .edit", editLogItem)
		.on("click", ".log-item .delete", deleteLogItem);

	tagFilter.on("change", loadLog);
	sortField.on("change", loadLog);
	loadMore.on('click', loadNextLog);
});

function loadLog() {
	lastDate = null;
	loadPage().done((items) => {
		log.html(items.join("<hr/>"));
	});
}

function loadNextLog() {
	loadPage().done((items) => {
		log.append("<hr/>" + items.join("<hr/>"));
	});
}

function loadPage() {
	let tags = tagFilter.val().filter((v) => !!v);
	let data = {
		"sortField": sortField.val()
	};

	if (tags.length) {
		data.tags = tagFilter.val();
	}
	if (lastDate) {
		data.lastDate = lastDate;
	}
	return $.get("/api/log-item", data).then(function(resp) {
		lastDate = resp.length !== 0 ? resp[resp.length - 1][sortField.val()] : null;
		return resp.map(function(logItem) {
			return "<div class='log-item' data-id='" + logItem._id + "'>" +
				"<div class='buttons'>" +
				"<div class='button edit'></div>" +
				// "<div class='button delete'></div>" +
				"</div>" +
				"<div class='title'>" +
				"<span class='date'>" + moment(logItem["created"]).format("DD MMM YY, HH:MM") + "</span>" + " " + logItem["title"] + " " + (logItem["tags"]).map((i) => "<span class='tag'>" + TAGS[i] + "</span>").join("") +
				"</div>" +
				"<div>" + formatText(logItem["text"])+ "</div>" +
				"</div>"
		});
	});
}

function formatText(text) {
	text = text.replace(/\n/g, "<br/>");

	return text;
}

function editLogItem(e) {
	let id = $(this).parents(".log-item").data("id");
	if (e.ctrlKey && e.altKey && e.shiftKey) {
		initDelete(id);
	} else {
		initEdit(id);
	}
}

function initEdit(id) {
	$.get("/api/log-item/" + id).done(function(response) {
		let logItem = response.logItem;
		form.find("[name='id']").val(id);
		form.find("[name='title']").val(logItem.title);
		form.find("[name='text']").val(logItem.text);
		form.find("[name='tags']").val(logItem.tags);

	})
}

function deleteLogItem() {
	let id = $(this).parents(".log-item").data("id");
	initDelete(id);
}

function initDelete(id) {
	if (confirm("Удалить запись? Это будет не вернуть!")) {
		$.ajax({
			url: "/api/log-item/" + id,
			method: "DELETE",
		}).done(function() {
			loadLog();
		})
	}
}
