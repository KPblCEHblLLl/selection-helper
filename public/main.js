let form = $();
let log = $();

$(function() {
	form = $("#editor");
	log = $("#log-list");

	form.submit(function() {
		let id = $(this).find("[name='id']").val();
		let title = $(this).find("[name='title']").val();
		let text = $(this).find("[name='text']").val();
		let tags = $(this).find("[name='tags']").val().filter(function(i){return !!i});

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
});

function loadLog() {
	$.ajax("/api/log-item").done(function(resp) {
		let items = resp.map(function(logItem) {
			return "<div class='log-item' data-id='" + logItem._id + "'>" +
				"<div class='buttons'>" +
				"<div class='button edit'></div>" +
				// "<div class='button delete'></div>" +
				"</div>" +
				logItem["created"] + " " + logItem["title"] + " " + (logItem["tags"]).map(function(i){return "<span class='tag'>" + i + "</span>"}) +
				"<div>" + logItem["text"].replace(/\n/g, "<br/>") + "</div>" +
				"</div>"
		});
		log.html(items.join("<hr/>"));
	});
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
