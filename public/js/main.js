


(function () {

	/* ====================
	Preloader
	======================= */
	window.onload = function () {
		window.setTimeout(fadeout, 300);
	}

	function fadeout() {
		document.querySelector('.preloader').style.opacity = '0';
		document.querySelector('.preloader').style.display = 'none';
	}

	// WOW active
	new WOW().init();

})();

function deleteFoodClicked(id) {
	if (confirm("Are you sure you want to delete this? !! THIS IS IRREVERSIBLE !!")) {
		fetch(`https://admin.smokinbsbbq.tk/d/food/${id}`).then(() => {
			location.reload();
			console.log("Deleted");
		})
	}
}
function deleteAlertClicked(id) {
	if (confirm("Are you sure you want to delete this? !! THIS IS IRREVERSIBLE !!")) {
		fetch(`https://admin.smokinbsbbq.tk/d/alert/${id}`).then(() => {
			location.reload();
			console.log("Deleted");
		})
	}
}

imagesLoaded('#gallery-4', function () {
	let elem5 = document.querySelector('.gallery-4');
	let iso5 = new Isotope(elem5, {
		// options
		itemSelector: '.gallery-item',
		masonry: {
			// use outer width of grid-sizer for columnWidth
			columnWidth: '.gallery-item'
		}
	});

	let filterButtons = document.querySelectorAll('#gallery-4 .portfolio-button-wrapper button');
	filterButtons.forEach(e =>
		e.addEventListener('click', () => {

			let filterValue = event.target.getAttribute('data-filter');
			iso5.arrange({
				filter: filterValue
			});
		})
	);
});
elements5 = document.querySelectorAll("#gallery-4 .portfolio-btn");
for (let i = 0; i < elements5.length; i++) {

	elements5[i].onclick = function () {
		let el = elements5[0];
		while (el) {
			if (el.tagName === "BUTTON") {
				el.classList.remove("active");
			}
			el = el.nextSibling;
		}
		this.classList.add("active");
	};
}


var shoppingCart = function () {
	// =============================
	// Private methods and propeties
	// =============================
	cart = [];

	// Constructor
	function Item(name, price, count) {
		this.name = name;
		this.price = price;
		this.count = count;
	}

	// Save cart
	function saveCart() {
		sessionStorage.setItem('shoppingCart', JSON.stringify(cart));
	}

	// Load cart
	function loadCart() {
		cart = JSON.parse(sessionStorage.getItem('shoppingCart'));
	}
	if (sessionStorage.getItem("shoppingCart") != null) {
		loadCart();
	}


	// =============================
	// Public methods and propeties
	// =============================
	var obj = {};

	// Add to cart
	obj.addItemToCart = function (name, price, count) {
		for (var item in cart) {
			if (cart[item].name === name) {
				cart[item].count++;
				saveCart();
				return;
			}
		}
		var item = new Item(name, price, count);
		cart.push(item);
		saveCart();
	};
	// Set count from item
	obj.setCountForItem = function (name, count) {
		for (var i in cart) {
			if (cart[i].name === name) {
				cart[i].count = count;
				break;
			}
		}
	};
	// Remove item from cart
	obj.removeItemFromCart = function (name) {
		for (var item in cart) {
			if (cart[item].name === name) {
				cart[item].count--;
				if (cart[item].count === 0) {
					cart.splice(item, 1);
				}
				break;
			}
		}
		saveCart();
	};

	// Remove all items from cart
	obj.removeItemFromCartAll = function (name) {
		for (var item in cart) {
			if (cart[item].name === name) {
				cart.splice(item, 1);
				break;
			}
		}
		saveCart();
	};

	// Clear cart
	obj.clearCart = function () {
		cart = [];
		saveCart();
	};

	// Count cart 
	obj.totalCount = function () {
		var totalCount = 0;
		for (var item in cart) {
			totalCount += cart[item].count;
		}
		return totalCount;
	};

	// Total cart
	obj.totalCart = function () {
		var totalCart = 0;
		for (var item in cart) {
			totalCart += cart[item].price * cart[item].count;
		}
		return Number(totalCart.toFixed(2));
	};

	// List cart
	obj.listCart = function () {
		var cartCopy = [];
		for (i in cart) {
			item = cart[i];
			itemCopy = {};
			for (p in item) {
				itemCopy[p] = item[p];

			}
			itemCopy.total = Number(item.price * item.count).toFixed(2);
			cartCopy.push(itemCopy);
		}
		return cartCopy;
	};

	// cart : Array
	// Item : Object/Class
	// addItemToCart : Function
	// removeItemFromCart : Function
	// removeItemFromCartAll : Function
	// clearCart : Function
	// countCart : Function
	// totalCart : Function
	// listCart : Function
	// saveCart : Function
	// loadCart : Function
	return obj;
}();


function checkout() {
	let phoneNumber = document.getElementById("number"),
		timeToDeliver = document.getElementById("timeToDeliver")

	if (phoneNumber.value === "" || timeToDeliver.value === "") {
		phoneNumber.style.borderColor = "red";
		timeToDeliver.style.borderColor = "red";
		return;
	}


	let stripe = Stripe("pk_test_51J5i4AJGx760bm8xrDeqLRuhunpLSpDgEZjqHPl7oXieKzHsfhhw1Im8oGeLDuEIZmoa8C8VVzggNwGLfR0aHv8R00pM5tsMAP");
	let cart = shoppingCart.listCart();

	cart.push({
		phoneNumber: phoneNumber.value,
		timeToDeliver: timeToDeliver.value,
		additionalComments: document.getElementById("additionalComments").value
	})

	fetch("http://localhost:9999/checkout", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(cart)
	}).then(res => res.json()).then(session => {
		shoppingCart.clearCart()
		return stripe.redirectToCheckout({ sessionId: session.id }).then(result => {
			!result.error ? "none" : alert(result.error.message)
		}).catch(console.error)
	})
}

// *****************************************
// Triggers / Events
// ***************************************** 
// Add item
$('.add-to-cart').click(function (event) {

	event.preventDefault();
	var name = $(this).data('name');
	var price = Number($(this).data('price'));
	shoppingCart.addItemToCart(name, price, 1);
	displayCart();
});

// Clear items
$('.clear-cart').click(function () {
	shoppingCart.clearCart();
	displayCart();
});


function displayCart() {
	var cartArray = shoppingCart.listCart();

	!cartArray.length > 0 ? $(".order-now").prop("disabled", true) : $(".order-now").prop("disabled", false)


	var output = "";
	for (var i in cartArray) {
		output += "<tr>"
			+ "<td>" + cartArray[i].name.replace("-", " ") + "</td>"
			+ "<td>(" + cartArray[i].price + ")</td>"
			+ "<td><div class='input-group'><button class='minus-item input-group-addon btn btn-primary' data-name=" + cartArray[i].name + ">-</button>"
			+ "<input type='number' class='item-count form-control' data-name='" + cartArray[i].name + "' value='" + cartArray[i].count + "'>"
			+ "<button class='plus-item btn btn-primary input-group-addon' data-name=" + cartArray[i].name + ">+</button></div></td>"
			+ "<td><button class='delete-item btn btn-outline-danger' data-name=" + cartArray[i].name + ">X</button></td>"
			+ " = "
			+ "<td>" + cartArray[i].total + "</td>"
			+ "</tr>";
	}
	$('.show-cart').html(output);
	$('.total-cart').html(shoppingCart.totalCart());
	$('.total-count').html(shoppingCart.totalCount());
}

// Delete item button

$('.show-cart').on("click", ".delete-item", function (event) {
	var name = $(this).data('name');
	shoppingCart.removeItemFromCartAll(name);
	displayCart();
});


// -1
$('.show-cart').on("click", ".minus-item", function (event) {
	var name = $(this).data('name');
	shoppingCart.removeItemFromCart(name);
	displayCart();
});
// +1
$('.show-cart').on("click", ".plus-item", function (event) {
	var name = $(this).data('name');
	shoppingCart.addItemToCart(name);
	displayCart();
});

// Item count input
$('.show-cart').on("change", ".item-count", function (event) {
	var name = $(this).data('name');
	var count = Number($(this).val());
	shoppingCart.setCountForItem(name, count);
	displayCart();
});

displayCart();


