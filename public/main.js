$(function() {
	let form = $("#editor");
	let log = $("#log-list");
	form.submit(function() {
		let id = $(this).find("[name='id']").val();
		let title = $(this).find("[name='title']").val();
		let text = $(this).find("[name='text']").val();

		let data = {
			title: title,
			text: text,
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
			form.get(0).reset();
			loadLog(log)
		});
		return false;
	});
	loadLog(log);
});

function loadLog(log) {
	$.ajax("/api/log-item").done(function(resp) {
		let items = resp.map(function(logItem) {
			return "<div class='log-item'>" +
				logItem["created"] + " " + logItem["title"] +
				"<div>" + logItem["text"].replace(/\n/g, "<br/>") + "</div>" +
				"</div>"
		});
		log.html(items.join(""));
	});

}