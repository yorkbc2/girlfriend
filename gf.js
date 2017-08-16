var GF = {

	find(selector, callback) {

		var el = document.querySelector(selector);

		if(el) {
			callback(el);
		}

		return this;
	},

	findAll(selector,callback) {
		var el = document.querySelectorAll(selector);

		if(el) {
			callback(el);
		}

		return this;
	},

	create(elName) {

		var element = document.createElement(elName);


		return element;
	},

	append(parent, child) {
		parent.appendChild(child);

		return this;
	},

	className(element, className) {
		element.className = className;

		return this;
	},

	html(element, _html) {

		element.innerHTML = _html;

		return this;

	},

	addClass(element, className) {

		if(!GF.hasClass(element, className)) {
			element.className = element.className.trim() + " " + className;
		}

		return this;
	},

	removeClass(element, className) {

		if(GF.hasClass(element, className)) {
			var regular = new RegExp(className, "g");

			element.className = element.className.replace(regular, "");
		}

		return this;
	},

	hasClass(element, className) {
		var classNames = element.className,
			regular = new RegExp(className, "g");

		if(regular.test(classNames)) {
			return true;
		}
		else {
			return false;
		}

	},

	click(element, listener) {

		element.addEventListener("click", function (e) {
			listener(e)
		})

		return this;

	},

	attr(element, attribute) {

		return element.getAttribute(attribute);

	},

	removeAttr(element, attribute) {
		element.removeAttribute(attribute);

		return this;
	},

	addAttr(element, attribute) {

		element.setAttribute(attribute[0], attribute[1])

		return this;
	},

	addStyleSheet(selector, index) {

		var style = GF.create("style"),
			styleSheet;



		GF.addAttr(style, ["data-name", index])
		.append(document.head, style);

		styleSheet = style.sheet;


		return this;

	},

	insertStyleSheet(selector, index) {

		var style = document.head.querySelector("style[data-name="+index+"]");

		var sh = style.sheet;

		sh.insertRule(selector);

		return this;

	},

	scrollTo(element) {

		var offset = element.offsetTop;

		var method = "inc";

		if(document.body.scrollTop > offset) {
			method = "dec";
		}

		var scrollTop = document.body.scrollTop;

		var i = scrollTop;

		var interval = setInterval(function () {
			if(method == "inc") {
				document.body.scrollTop = i
				i = i + 6;
				if(i >= offset) {
					clearInterval(interval)
				}
			}
			else {
				document.body.scrollTop = i
				i = i - 6;
				if(i <= offset) {
					clearInterval(interval)
				}
			}
		}, 1/1000)
 
	},

	get(selector) {
		var els =  document.querySelectorAll(selector);

		if(els.length > 1) {
			return els;
		}
		else {
			return els[0];
		}
	},


	initStyleSheets() {
		GF.addStyleSheet("", GFR.styleName)

		return this;
	}


},




GFR = {
	styleName: "style-girlfriend",

	makeNavigator(el) {

		var links = el.querySelectorAll("a");

		var ul = GF.create("ul");

		var div = GF.create("div");

		GF.className(div, "nav-body");

		for(var i = 0 ; i < links.length ; i++) {

			var li = GF.create("li");

			GF.append(li, links[i])
				.append(ul, li);

		}

		var header = GF.create("div"),
			headerButton = GF.create("button");

		  GF.className(header, "nav-header")
			.className(headerButton, "nav-header--button")
			.click(headerButton, GFR.onClickAction.bind(this,el))
			.html(headerButton, "<i></i><i></i><i></i>")
			.append(header, headerButton)
			.append(el, header)
			.append(div, ul)
			.append(el, div)

		GFR.checkAttributes(el);

		GFR.adaptiveNavigator(el);

	},

	adaptiveNavigator(el) {

		window.onload = function (e) {
			var width = window.innerWidth;
		
			GFR.setPropsToNavigator(el, width)
		}

		window.onresize = function (e) {
			var width = window.innerWidth;

			GFR.setPropsToNavigator(el, width)
		}

	},

	setPropsToNavigator(el, w) {
		if(w >= 720) {

			GF.removeClass(el, 'adaptive-nav')

		}
		else {

			GF.addClass(el, "adaptive-nav")

		}
	},

	onClickAction(el) {
		
		if(GF.hasClass(el, "opened-nav")) {
			GF.removeClass(el, "opened-nav")
		}
		else {
			GF.addClass(el, "opened-nav")
		}

	},

	checkAttributes(el) {

		var attributes = {
			underline: GF.attr(el, "underline"),
			background: GF.attr(el, "background"),
			color: GF.attr(el, "color"),
			fixed: GF.attr(el, "fixed"),
			align: GF.attr(el, "align"),
			uppercase: GF.attr(el, "uppercase"),
			barsColor: GF.attr(el, "bars-color")
		};

		GFR.callAttributesActions(el, attributes)

	},

	callAttributesActions(el, attr) {
		var selector = "data-gf" + Date.now();
		for(var k in attr) {
			if(attr[k] !== null) {
				GF.findAll("nav#nav li", function (li) {
					li.forEach(function (li) {

						GF.addAttr(li, [selector, ""])

					});
				})

				GFR.events[k].bind(this,el, selector).call()
			}
		}

	},

	events: {
		underline: function (el, selector) {

			var colored  = "#333",
				transition = "0.5";

			if(GF.attr(el, "underline-color") !== "" &&
				GF.attr(el, "underline-color") !== null) {

				colored = GF.attr(el, "underline-color");

			}

			if(GF.attr(el, "underline-transition") !== "" &&
				GF.attr(el, "underline-transition") !== null) {

				transition = GF.attr(el, "underline-transition");

			}

			

			GF.addClass(el, "underline")
				.removeAttr(el, "underline")
				.removeAttr(el, "underline-color")
				.removeAttr(el, "underline-transition")
				.insertStyleSheet("li[" + selector + "]::after {background-color: " + colored + "!important; transition: width "+transition+"s ease-in-out!important;}"
					, GFR.styleName);},

		color: function (el, selector) {

			var color = "#676666",
				hColor = "#333"

			if(GF.attr(el, "color") !== "") {

				color = GF.attr(el, "color")

				GF.insertStyleSheet(`li[${selector}] a { color: ${color}!important; }`, GFR.styleName);

			}

			if(GF.attr(el,"hover-color") !== null && GF.attr(el, "hover-color") !== "") {

				hColor = GF.attr(el, "hover-color")

				GF.insertStyleSheet(`
					li[${selector}] a:hover {
						color: ${hColor}!important;
					}
				`, GFR.styleName)

			}},

		uppercase: function (el, selector) {

			var transformValue = "uppercase";

			if(GF.attr(el, "uppercase") !== "") {

				var at = GF.attr(el, "uppercase");

				switch(at) {
					case "none" :
						return GF.addClass(el, "non-uppercase")
					case "lower" :
						return GF.removeClass(el, "non-uppercase")
									.addClass(el, "lower-uppercase")
					case "" :
					case "normal" :
					default :
						GF.removeClass(el, "non-uppercase")
				}

			}},

		fixed: function (el, selector) {
			GF.addClass(el, "nav-fixed")
				.removeAttr(el, "fixed");
		},

		background: function (el, selector) {

			GF.addAttr(el, [selector, ""])
				.insertStyleSheet(`
					nav#nav[${selector}] {
						background: ${GF.attr(el, "background")}!important;
					}
				`, GFR.styleName)
				.insertStyleSheet(
					`nav#nav[${selector}].adaptive-nav .nav-body{
						background: ${GF.attr(el, "background")}!important;
					}`, GFR.styleName)
				.removeAttr(el, "background")

		},

		barsColor: function (el, selector) {

			GF.insertStyleSheet(`
				nav#nav[${selector}] .nav-header .nav-header--button i {
					background-color: ${GF.attr(el, "bars-color")}!important;
				}
			`, GFR.styleName)
				.removeAttr(el, "bars-color")

		}
	},

	initFilters(elements) {
		elements.forEach(function(el) {
			var initialBackground = "rgba(0,0,0,.5)",
				initialMinHeight = "100%",
				heightString = "min-height"

			if(GF.attr(el, "filter-background")) {
				initialBackground = GF.attr(el, "filter-background")
			}

			if(GF.attr(el, "filter-height")) {
				initialMinHeight= GF.attr(el, "filter-height")
			}

			if(GF.attr(el, "filter-static")) {
				heightString = "height";
			}

			var selector = "data-gf" + Date.now();

			GF.removeAttr(el, "filter-background")
				.removeAttr(el, "filter-height")
				.removeAttr(el, "filter-static")
				.removeAttr(el, "filter")
				.addAttr(el, [selector, ""])
				.insertStyleSheet(`
					*[${selector}] {
						width: 100%; 

						position: relative;
						background: ${initialBackground};

						${heightString}: 100%;
					}
				`, GFR.styleName)

		});

		return this;
	},

	scrollActionsCaller(elements) {

		elements.forEach(function (el) {

			var scrollSelector = GF.attr(el, "gf-scroll");

			var scrollElement = GF.get(scrollSelector);

			GF.click(el, function (ev) {
				console.log(ev)
				ev.preventDefault();

				GF.scrollTo(scrollElement)
			})

		});

	}
}





GF.initStyleSheets()
	.find("nav#nav", GFR.makeNavigator)
	.findAll("*[gf-filter]", GFR.initFilters)
	.findAll("*[gf-scroll]", GFR.scrollActionsCaller);