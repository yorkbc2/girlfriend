/***
*
*	@params:
*
*		Author: Alex Yorke <yorkbc2@gmail.com>
*		Version: 1.3
*		Name: Girlfriend UI library
*				
*
*/

var GF = {

	find: function(selector, callback) {

		var el = document.querySelector(selector);

		if(el) {
			callback(el);
		}

		return this;
	},

	findAll: function(selector,callback) {
		var el = document.querySelectorAll(selector);

		if(el) {
			callback(el);
		}

		return this;
	},

	create: function(elName) {

		var element = document.createElement(elName);


		return element;
	},

	append: function(parent, child) {
		parent.appendChild(child);

		return this;
	},

	className: function(element, className) {
		element.className = className;

		return this;
	},

	html: function(element, _html) {

		element.innerHTML = _html;

		return this;

	},

	addClass: function(element, className) {

		if(!GF.hasClass(element, className)) {
			if(element.className == null || element.className == "") {
				element.className = className;	
			}
			else {	
				element.className = element.className.trim() + " " + className;
			}
		}

		return this;
	},

	removeClass: function(element, className) {

		if(GF.hasClass(element, className)) {
			var regular = new RegExp(className, "g");

			element.className = element.className.replace(regular, "");
		}

		return this;
	},

	hasClass: function(element, className) {
		var classNames = element.className,
			regular = new RegExp(className, "g");

		if(regular.test(classNames)) {
			return true;
		}
		else {
			return false;
		}

	},

	click: function(element, listener) {

		element.addEventListener("click", function (e) {
			listener(e)
		})

		return this;

	},

	attr: function(element, attribute) {

		return element.getAttribute(attribute);

	},

	removeAttr: function(element, attribute) {
		element.removeAttribute(attribute);

		return this;
	},

	addAttr: function(element, attribute) {

		element.setAttribute(attribute[0], attribute[1])

		return this;
	},

	addStyleSheet: function(selector, index) {

		var style = GF.create("style"),
			styleSheet;



		GF.addAttr(style, ["data-name", index])
		.append(document.head, style);

		styleSheet = style.sheet;


		return this;

	},

	insertStyleSheet: function(selector, index) {

		var style = document.head.querySelector("style[data-name="+index+"]");

		var sh = style.sheet;

		sh.insertRule(selector);

		return this;

	},

	scrollTo: function(element) {

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

	get: function(selector) {
		var els =  document.querySelectorAll(selector);

		if(els.length > 1) {
			return els;
		}
		else {
			return els[0];
		}
	},


	initStyleSheets: function() {
		GF.addStyleSheet("", GFR.styleName)

		return this;
	},

	DOMController: {
		create: function (selector) {

			var element = document.querySelectorAll(selector);

			if(element.length > 1) {

				GF.DOMController.callForEachFunction(element, function (item, index) {

					element[index].__proto__ = GF.assignProtos(item, GFMethods);


				})
					element.__proto__ = GF.assignProtos(element, GFMethods)

				return element;

			}
			else {

				element[0].__proto__ = GF.assignProtos(element[0], GFMethods);

				return element[0];

			}

		},

		callForEachFunction: function (elements, callback)  {
			elements.forEach(function (li, index) {
				callback(li, index);
			})

			return elements;
		}
	},

	assignProtos: function (element, proto) {
		var _proto = element.__proto__;
	
		return Object.assign(_proto, proto, {});
	},

	callFunction: function (element, callback) {

		if(element.length) {

			GF.DOMController.callForEachFunction(element, function (item) {
				callback(item);
			});

		}
		else {

			callback(element)

		}

		return element;

	},

	parent: function (element) {
		return element.parentNode;
	}, 

	addToRemoveList: function (element, date) {

		var rl = GF.ev.removeList,
			GFObject = {
				data: element,
				date: date
			}

		rl.push(GFObject);

		return this;

	},

	getFromRemoveList: function (element) {

		var returnedElement = GF.ev.removeList.filter(function (item) {
			return item.data == element;
		})[0]

		return returnedElement;

	},

	ev: {
		removeList: []
	}


},




GFR = {
	styleName: "style-girlfriend",

	makeNavigator: function(el) {

		var links = el.querySelectorAll("a");

		var ul = GF.create("ul");

		var div = GF.create("div");

		GF.className(div, "nav-body");

		for(var i = 0 ; i < links.length ; i++) {

			var li = GF.create("li");

			if(GF.attr(links[i], "gf-image") !== null) {
				console.log("GF_IMAGE")

				GF.addClass(li, "no-padding")
					.removeAttr(links[i], "gf-image")
			}

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

	adaptiveNavigator: function(el) {

		window.onload = function (e) {
			var width = window.innerWidth;
		
			GFR.setPropsToNavigator(el, width)
		}

		window.onresize = function (e) {
			var width = window.innerWidth;

			GFR.setPropsToNavigator(el, width)
		}

	},

	setPropsToNavigator: function(el, w) {
		if(w >= 720) {

			GF.removeClass(el, 'adaptive-nav')

		}
		else {

			GF.addClass(el, "adaptive-nav")

		}
	},

	onClickAction: function(el) {
		
		if(GF.hasClass(el, "opened-nav")) {
			GF.removeClass(el, "opened-nav")
		}
		else {
			GF.addClass(el, "opened-nav")
		}

	},

	checkAttributes: function(el) {

		var attributes = {
			underline: GF.attr(el, "underline"),
			background: GF.attr(el, "background"),
			color: GF.attr(el, "color"),
			fixed: GF.attr(el, "fixed"),
			align: GF.attr(el, "align"),
			uppercase: GF.attr(el, "uppercase"),
			barsColor: GF.attr(el, "bars-color"),
			align: GF.attr(el, "align")
		};

		GFR.callAttributesActions(el, attributes)

	},

	callAttributesActions: function(el, attr) {
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

				GF.insertStyleSheet("li["+selector+"] a { color: "+color+"!important; }", GFR.styleName)
					.removeAttr(el, "color");

			}

			if(GF.attr(el,"hover-color") !== null && GF.attr(el, "hover-color") !== "") {

				hColor = GF.attr(el, "hover-color")

				GF.insertStyleSheet("li["+selector+"] a:hover {color: "+hColor+"!important;}", GFR.styleName)
					.removeAttr(el, "hover-color")

			}},

		uppercase: function (el, selector) {

			var transformValue = "uppercase";

			if(GF.attr(el, "uppercase") !== "") {

				var at = GF.attr(el, "uppercase");

				GF.removeAttr(el, "uppercase")

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
				.insertStyleSheet("nav#nav["+selector+"] {background: "+GF.attr(el, "background")+"!important;}", GFR.styleName)
				.insertStyleSheet("nav#nav["+selector+"].adaptive-nav .nav-body{background: "+GF.attr(el, "background")+"!important;}", GFR.styleName)
				.removeAttr(el, "background")

		},

		barsColor: function (el, selector) {

			GF.insertStyleSheet("nav#nav["+selector+"] .nav-header .nav-header--button i {background-color: "+GF.attr(el, "bars-color")+"!important;}", GFR.styleName)
				.removeAttr(el, "bars-color")

		},

		align: function (el, selector) {

			var attr = GF.attr(el, "align");

			GF.removeAttr(el, "align");

			switch(attr) {
				case "center" :
					GF.addClass(el, "talign-center")
					break;
				case "right" :
					GF.addClass(el, "talign-rights")
					break;
				case "left" :
				default :
					GF.addClass(el, "talign-left")
					break;
			}

		}
	},

	initFilters: function(elements) {
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
				.insertStyleSheet("*["+selector+"] {width: 100%; position: relative;background: "+initialBackground+";"+heightString+": 100%;}", GFR.styleName)

		});

		return this;
	},

	scrollActionsCaller: function (elements) {

		elements.forEach(function (el) {

			var scrollSelector = GF.attr(el, "gf-scroll");

			var scrollElement = GF.get(scrollSelector);

			GF.click(el, function (ev) {
				ev.preventDefault();

				GF.scrollTo(scrollElement)
			})

		});

	}
},


gf = function (selector) {

	return GF.DOMController.create(selector);

},

GFMethods = {

	addClass: function(className) {
		if(this == null) {
			return this;
		}
		else {
			GF.callFunction(this, function (self) {
				GF.addClass(self, className)
			})

			return this;
		}
	},

	removeClass: function(className) {
		if(this == null) {
			return this;
		}
		else {
			GF.callFunction(this, function (self) {
				GF.removeClass(self, className)
			})

			return this;
		}
	},

	hasClass: function (className) {
		if(this == null) {
			return this;
		}
		else {
			var result = false;

			GF.callFunction(this, function (self ) {
				result = GF.hasClass(self, className)
			})

			return result;
		}
	},

	remove: function () {

		if(this == null) {
			return this;
		}
		else {
			var parent = this.parentNode;

			GF.addToRemoveList(this, new Date());

			parent.removeChild(this);

			return this;
		}

	},

	destroy: function () {
		if(this == null) {
			return null;
		}

		else {

			var parent = GF.parent(this);

			parent.removeChild(this);

			return this;

		}
	},

	unremove: function() {
		if(this == null) {
			return this;
		}
		else {
			var self = GF.getFromRemoveList(this);

			return self;
		}
	},

	// TODO show (timeout)

	// TODO attr (timeout)

	// TODO
	expand: function(functionByUser) {
		if(!functionByUser["name"]) {
			
		}
	}

};





GF.initStyleSheets()
	.findAll("*[gf-filter]", GFR.initFilters)
	.findAll("*[gf-scroll]", GFR.scrollActionsCaller)
	.find("nav[gf-nav]", GFR.makeNavigator);