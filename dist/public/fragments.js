/**
 * Created by KPblCEHblLLl on 20.11.2017.
 */
"use strict";

var form = $();
var list = $();

function getApiUrl(id) {
	return "/api/fragment-description" + id != "" ? "/" + id : "";
}

$(function () {
	if (localStorage.getItem('editor')) {
		$("body").addClass("editable");
	}

	form = $("#editor");
	list = $("#fragments-list");

	form.submit(function () {
		var id = $(this).find("[name='id']").val();
		var name = $(this).find("[name='name']").val();
		var description = $(this).find("[name='description']").val();

		var data = {
			name: name,
			description: description
		};

		var req = void 0;
		if (id !== "") {
			req = $.ajax({
				url: "/api/fragment-description/" + id,
				data: data,
				method: "PUT",
				dataType: "json"
			});
		} else {
			req = $.post("/api/fragment-description", data);
		}
		req.done(function () {
			form.find(':radio, :checkbox').removeAttr('checked').end().find('textarea, :text, :hidden, select').val('');
			loadFragments();
		});
		return false;
	});
});

function loadFragments() {
	$.get(getApiUrl()).then(function (resp) {
		list.html(resp.map(function (item) {
			return "<div class='list-item' data-id='" + item._id + "'>" + "<div class='buttons'>" + "<div class='button edit'></div>" +
			// "<div class='button delete'></div>" +
			"</div>" + "<div class='title'>" + item["name"] + "</div>" + "<div>" + formatText(item["description"]) + "</div>" + "</div>";
		}).join("<hr/>"));
	});
}
//# sourceMappingURL=fragments.js.map