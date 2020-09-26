(function ($) {
	$.fn.autocompleteTagchat = function (params) {
		params = $.extend(
			{
				hints: [],
				startsWith: null,
			},
			params
		);
		let currentSelection = -1;
		let currentProposals = [];
		const _input = this;

		const elemHidden = "athidden";
		_input.before(`<div id="${elemHidden}"/>`);
		_input.attr("autocomplete", "off");

		const proposals = $("<div></div>").addClass("proposal-box").css({
			width: 200,
			top: 50,
		});
		const proposalList = $("<ul></ul>").addClass("proposal-list");
		proposals.append(proposalList);

		_input.keydown(function (e) {
			switch (e.which) {
				case 38: // Up arrow
					e.preventDefault();
					console.log("Up arrow");
					$("ul.proposal-list li").removeClass("selected");
					if (currentSelection - 1 >= 0) {
						currentSelection--;
						$(`ul.proposal-list li:eq(${currentSelection})`).addClass(
							"selected"
						);
					} else {
						currentSelection = -1;
					}
					break;
				case 40: // Down arrow
					e.preventDefault();
					console.log("Down arrow");
					if (currentSelection + 1 < currentProposals.length) {
						$("ul.proposal-list li").removeClass("selected");
						currentSelection++;
						$(`ul.proposal-list li:eq(${currentSelection})`).addClass(
							"selected"
						);
					}
					break;
				case 13: // Enter
					console.log("Enter");
					if (currentSelection > -1) {
						const text = $(`ul.proposal-list li:eq(${currentSelection})`).html;
						_input.val(`${_input.val().trim()} ${text}`);
					}
					currentSelection = -1;
					proposalList.empty();
					break;
				case 27: // Esc button
					console.log("Esc");
					currentSelection = -1;
					proposalList.empty();
					break;
			}
		});

		_input.bind("paste keyup", function (e) {
			if (e.which != 13 && e.which != 27 && e.which != 38 && e.which != 40) {
				currentProposals = [];
				currentSelection = -1;

				const wordsArr = _input.val().split(" ");
				if (_input.val() !== "" && wordsArr[wordsArr.length - 1].length > 0) {
					console.log({ wordsArr });
					const regexp = new RegExp(`^${wordsArr[wordsArr.length - 1]}+`);
					console.log({ regexp });
					proposalList.empty();

					for (const hint in params.hints) {
						console.log(regexp.test(params.hints[hint]));
						if (regexp.test(params.hints[hint])) {
							currentProposals.push(params.hints[hint]);
							const proposalItem = $("<li></li>")
								.addClass("proposal-item")
								.html(params.hints[hint])
								.click(function () {
									_input.val(`${_input.val().trim()} ${$(this).html()}`);
								})
								.mouseenter(function () {
									$(this).addClass("selected");
								})
								.mouseleave(function () {
									$(this).removeClass("selected");
								});
							proposalList.append(proposalItem);
						}
					}
				} else {
					proposalList.empty();
				}
			}
		});

		_input.blur(function (e) {
			currentSelection = -1;
		});

		proposals.insertBefore(_input);

		// this.on({
		// 	input: function (ev) {
		// 		const text = ev.target.value;
		// 		// Copy the text to hidden element
		// 		$(`#${elemHidden}`).text(text);

		// 		//Verify if new word starts with "#"
		// 		const textArr = text.split(" ");
		// 		console.log({ textArr });
		// 		const newWord = textArr[textArr - 1];
		// 		console.log({ newWord });
		// 		if (params.startsWith && newWord.startsWith(params.startsWith)) {
		// 			console.log({ startsWith });
		// 			suggests = hints.filter((hint) => hint.startsWith(params.startsWith));
		// 			console.log({ suggests });
		// 		}
		// 	},
		// });
	};
})(jQuery);
