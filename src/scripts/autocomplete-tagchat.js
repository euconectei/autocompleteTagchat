(function ($) {
	$.fn.autocompleteTagchat = function (params) {
		params = $.extend(
			{
				hints: [],
			},
			params
		);
		const elemHidden = "athidden";
		const hintsStr = params.hints.toString();
		console.log(hintsStr.replaceAll(",", " "));
		this.val(params.hints.toString().replaceAll(",", " "));

		this.before(`<div id="${elemHidden}"/>`);

		this.on({
			input: function (ev) {
				console.log({ ev });
				console.log($(`#${elemHidden}`));
				$(`#${elemHidden}`).text(ev.target.value);
			},
		});
	};
})(jQuery);
