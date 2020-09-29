(function ($) {
	$.fn.autocompleteTagchat = function (params) {
		params = $.extend(
			{
				hints: [],
				untilScrolling: 10,
			},
			params
		);
		let currentSelection = 0;
		let currentProposals = [];

		this.each(function (i, elem) {
			const _input = $(`#${elem.id}`);

			const elemIdHidden = "athidden";
			_input.before(`<div id="${elemIdHidden}"/>`);
			_input.attr("autocomplete", "off");

			const elemHidden = $(`#${elemIdHidden}`);
			elemHidden.css({
				left: _input.offset().left,
				top: _input.offset().top,
			});

			const proposals = $("<div></div>").addClass("proposal-box");
			const proposalList = $("<ul></ul>").addClass("proposal-list");
			proposals.append(proposalList);

			const clean = function () {
				currentSelection = 0;
				proposalList.empty();
				$(".proposal-box").hide();
			};

			const addSelectedText = function (oldText, selectedText) {
				const oldTextArr = oldText.split(" ");
				oldTextArr.pop();
				const newText = oldTextArr.toString().replaceAll(",", " ");
				return `${newText} ${selectedText} `;
			};

			const setProposalsPosition = function () {
				$(".proposal-box").css({
					left: elemHidden.offset().left + elemHidden.width(),
					top: elemHidden.offset().top - $(".proposal-box").height(),
					overflowY:
						currentProposals.length > params.untilScrolling
							? "scroll"
							: "hidden",
					height: $(".proposal-item").height() * params.untilScrolling + 10,
				});
			};

			const setSelectedItem = function (index) {
				$("ul.proposal-list li").removeClass("selected");
				$(
					`ul.proposal-list li:eq(${Math.abs(index % currentProposals.length)})`
				).addClass("selected");
			};

			_input.keydown(function (e) {
				$("#athidden").text(_input.val());
				switch (e.which) {
					case 38: // Up arrow
						e.preventDefault();
						if (currentSelection > 0) {
							currentSelection--;
						} else {
							currentSelection = currentProposals.length - 1;
						}
						setSelectedItem(currentSelection);
						break;

					case 40: // Down arrow
						e.preventDefault();
						if (currentSelection < currentProposals.length - 1) {
							currentSelection++;
						} else {
							currentSelection = 0;
						}
						setSelectedItem(currentSelection);
						break;

					case 9: // Tab
						e.preventDefault();
						const text = $(
							`ul.proposal-list li:eq(${currentSelection})`
						).html();
						if (!!text) {
							_input.val(addSelectedText(_input.val(), text));
						}
						clean();
						break;

					case 27: // Esc button
						clean();
						break;
				}
			});

			_input.bind("paste keyup", function (e) {
				$("#athidden").text(_input.val());
				if (e.which != 13 && e.which != 27 && e.which != 38 && e.which != 40) {
					clean();

					const wordsArr = _input.val().split(" ");
					if (_input.val() !== "" && wordsArr[wordsArr.length - 1].length > 0) {
						const regexp = new RegExp(`^${wordsArr[wordsArr.length - 1]}+`);
						proposalList.empty();

						for (const hint in params.hints) {
							if (regexp.test(params.hints[hint])) {
								currentProposals.push(params.hints[hint]);
								const proposalItem = $("<li></li>")
									.addClass("proposal-item")
									.html(params.hints[hint])
									.click(function () {
										_input.val(addSelectedText(_input.val(), $(this).html()));
										clean();
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
						if (currentProposals.length > 0) {
							$(".proposal-box").show();
						}
						setSelectedItem(currentSelection);
					} else {
						clean();
					}
				}
				setProposalsPosition();
			});

			proposals.insertBefore(_input);
		});
		return this;
	};
})(jQuery);
