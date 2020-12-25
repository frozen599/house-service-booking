function checkRequired() {
	var warning = document.getElementById('warning');
	var username = document.getElementById('username');
	var phone = document.getElementById('phone');
	var password = document.getElementById('password');
	var repassword = document.getElementById('repassword');
	var email = document.getElementById('email');

	if (username.value == '') {
		warning.style.display = 'block';
		warning.innerHTML = 'Plase input Username';
		return false;
	} else if (password.value == '') {
		warning.style.display = 'block';
		warning.innerHTML = 'Please input Password';
		return false;
	} else if (repassword.value == '') {
		warning.style.display = 'block';
		warning.innerHTML = 'Please input RePassword';
		return false;
	} else if (phone.value == '') {
		warning.style.display = 'block';
		warning.innerHTML = 'Please input Phone';
		return false;
	} else if (email.value == '') {
		warning.style.display = 'block';
		warning.innerHTML = 'Please input Email';
		return false;
	} else {
		warning.style.display = 'none';
		return true;
	}
}

function checkLength(idTag, minLength, maxLength) {
	var name = document.getElementById(idTag);
	var length = name.value.length;
	var warning = document.getElementById('warning');
	if (length < minLength || length > maxLength) {
		warning.style.display = 'block';
		warning.innerHTML = 'The length of letters "' + idTag + '" must between ' + minLength + ' and ' + maxLength;
		return false;
	} else {
		warning.style.display = 'none';
		return true;
	}
}

function checkMatch(idTag1, idTag2) {
	var password = document.getElementById(idTag1);
	var repassword = document.getElementById(idTag2);
	var warning = document.getElementById('warning');

	if (password.value != repassword.value) {
		warning.style.display = 'block';
		warning.innerHTML = "Password and Repassword don't match each other";
		return false;
	}
	return true;
}

function checkEmail(idTag) {
	var email = document.getElementById(idTag);
	var validation = /^([\w\.])+@([a-zA-Z0-9\-])+\.([a-zA-Z]{2,4})(\.[a-zA-Z]{2,4})?$/;
	var warning = document.getElementById('warning');
	if (email.value.match(validation)) {
		warning.style.display = 'none';
		return true;
	} else {
		warning.style.display = 'block';
		warning.innerHTML = 'Error in input Email area (wrong in email format)';
		return false;
	}
}

function checkUsername(idTag) {
	var username = document.getElementById(idTag);
	var validation = /^[a-zA-Z0-9]+$/;
	var warning = document.getElementById('warning');
	if (username.value.match(validation)) {
		warning.style.display = 'none';
		return true;
	} else {
		warning.style.display = 'block';
		warning.innerHTML = 'Error in input username area';
		return false;
	}
}

function isAllNumbers(idTag) {
	var phone = document.getElementById(idTag).value;
	var num_validation = /^[0-9]+$/;
	var warning = document.getElementById('warning');
	if (phone.match(num_validation)) {
		warning.style.display = 'none';
		return true;
	} else {
		warning.style.display = 'block';
		warning.innerHTML = 'Error in input "' + idTag + '"';
		warning.style.color = 'red';
		return false;
	}
}

function checkValidation() {
	return (
		checkRequired() &&
		checkMatch('password', 'repassword') &&
		checkUsername('username') &&
		checkUsername('password') &&
		isAllNumbers('phone') &&
		checkLength('username', 4, 12) &&
		checkLength('password', 4, 12) &&
		checkEmail('email')
	);
}

function doForm(id1, id2) {
	var form1 = document.getElementById(id1);
	var form2 = document.getElementById(id2);
	form1.style.display = 'block';
	form2.style.display = 'none';
}

function PlusTime() {
	var value = document.getElementById('time-start');
	hour = parseInt(value.innerHTML);

	if (hour < 16) {
		hour += 1;
	}
	if (hour < 10) {
		hour = '0' + '' + hour;
	}
	value.innerHTML = hour + ':00';
}

function MinusTime() {
	var value = document.getElementById('time-start');
	hour = parseInt(value.innerHTML);

	if (hour > 6) {
		hour -= 1;
	}
	if (hour < 10) {
		hour = '0' + '' + hour;
	}
	value.innerHTML = hour + ':00';
}

function validStartDate() {
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth();
	var yyyy = today.getFullYear();
	var startDate = document.getElementById('start-date').value;
	var s_date = new Date(startDate);

	if (s_date.getFullYear() < today.getFullYear()) {
		return false;
	} else if (s_date.getMonth() < today.getMonth()) {
		return false;
	} else if (s_date.getDate() <= today.getDate()) {
		return false;
	}
	return true;
}

function calcDate() {
	var error = document.getElementById('error');
	error.style.display = 'none';
	var startDate = document.getElementById('start-date').value;
	var endDate = document.getElementById('end-date').value;
	var s_date = new Date(startDate);
	var e_date = new Date(endDate);
	var distance = e_date - s_date;
	return distance / (24 * 3600 * 1000);
}

function price() {
	var distance = calcDate();
	var error = document.getElementById('error');
	if (distance > 0) {
		error.style.display = 'none';
		var service_money = document.getElementById('phi-dich-vu').innerHTML;
		var tong = document.getElementById('tong').innerHTML;
		var s_money = parseInt(service_money);
		var s_tong = parseInt(tong);
		s_tong = s_money * distance;
		document.getElementById('tong').innerHTML = s_tong;
	}

	if (distance < 0) {
		error.style.display = 'block';
		error.innerHTML = 'Ngày kết thúc phải sau ngày làm';
	}

	// s_tong += s_money;
	// alert(s_tong);

	// var T2 = document.getElementById("cb2");
	// var T3 = document.getElementById("cb3");
	// var T4 = document.getElementById("cb4");
	// var T5 = document.getElementById("cb5");
	// var T6 = document.getElementById("cb6");
	// var T7 = document.getElementById("cb7");
	// var CN = document.getElementById("cb8");
}

function chooseGraph() {
	var chart = document.getElementById('cbChart');
	var table = document.getElementById('cbTable');

	var chart_Graph = document.getElementById('column_chart');
	var table_Graph = document.getElementById('table_chart');

	if (chart.checked && !table.checked) {
		chart_Graph.style.display = 'block';
		table_Graph.style.display = 'none';
	}
	if (table.checked && !chart.checked) {
		chart_Graph.style.display = 'none';
		table_Graph.style.display = 'block';
	}
}

$(function () {
	$("#form-ServiceType").hide();
	$("#form-Service").hide();
	$("#form-Service-edit").hide();
	var error = document.getElementById("error");
	var total = document.getElementById("tong");

	$("#start-date").change(function (e) {
		e.preventDefault();

		var startDate = new Date($(this).val());
		var now = new Date();
		if (startDate <= now) {
			error.innerHTML = "Ngày bắt đầu phải sau ngày hôm nay"
		}
		else {
			error.innerHTML = "";
		}
	});

	$("#end-date").change(function (e) {
		e.preventDefault();

		var endDate = new Date($(this).val());
		var startDate = new Date($("#start-date").val());
		if (endDate <= startDate) {
			error.innerHTML = "Ngày kết thúc phải sau ngày bắt đầu";
		}
		else {
			var price = parseInt(document.getElementById("phi-dich-vu").innerHTML);
			error.innerHTML = "";
			var distance = parseInt((endDate - startDate) / (24 * 3600 * 1000));
			total.innerHTML = price * distance;
		}
	});

	$("#btn-create-ServiceType").click(function (e) {
		e.preventDefault();
		$("#form-ServiceType").show();
	});

	$("#btn-create-Service").click(function (e) {
		e.preventDefault();
		$("#form-Service").show();
		$("#form-Service-edit").hide();
	});

	$("#cancel-create-ServiceType").click(function (e) {
		e.preventDefault();
		$("#form-ServiceType").hide();
	});

	$("#cancel-create-service").click(function (e) {
		e.preventDefault();
		$("#form-Service").hide();
	});

	$(".btn-cart-remove").click(function () {
		if (confirm("Remove Product ?")) {
			var id = $(this).data("id");
			$.ajax({
				type: "DELETE",
				url: "/cart",
				data: {
					id: id
				},
				dataType: "dataType",
				success: function (response) {
					location.reload();
				}
			});
		}
	});

	$(".btn-service-delete").click(function (e) {
		e.preventDefault();
		if (confirm("Are you sure to delete this Service?")) {
			var id = $(this).data('id');

			$.ajax({
				type: "DELETE",
				url: "/service/" + id,
				data: "data",
				dataType: "dataType",
				success: function (response) {
					location.reload();
				}
			});
		}
	});

	$(".btn-service-edit").click(function (e) {
		e.preventDefault();

		$("#form-Service").hide();
		$("#form-Service-edit").show();

		$("#input-price-edit-id").val($(this).data('id'));
		$("#price-service-edit").val($(this).data('price'));
		$("#input-imagepath-edit-id").val($(this).data('imagepath'));
		$("#input-title-edit-id").val($(this).data('title'));
	});

	$("#form-Service-edit").submit(function (e) {
		e.preventDefault();

		var id = $("#input-price-edit-id").val();
		var price = $("#price-service-edit").val();

		$.ajax({
			type: "PUT",
			url: "/service/" + id,
			data: {
				price: price
			},
			dataType: "dataType",
			success: function (response) {
				location.reload();
			}
		});
	});

	$("#btn-cancel-service-edit").click(function (e) {
		e.preventDefault();

		$("#form-Service-edit").hide();
	});

	$(".btn-cart-add").click(function () {

		var id = $(this).data("id");
		var timeStart = document.getElementById('time-start').innerHTML;
		var dateStart = $('#start-date').val();
		var dateEnd = $('#end-date').val();
		var price = parseInt(total.innerHTML);


		$.ajax({
			type: "POST",
			url: "/cart",
			data: {
				id: id,
				dateStart: dateStart,
				dateEnd: dateEnd,
				timeStart: timeStart,
				price: price
			},
			dataType: "dataType",
			success: function (response) {
				location.replace(`/servicetype`);
			}
		});
	});

	$(".form-cart-item-update").submit(function (e) {
		e.preventDefault();

		var id = $(this).data("id");
		var quantity = $("#quantity" + id).val();

		$.ajax({
			type: "PUT",
			url: "/cart",
			data: {
				id: id,
				quantity: quantity
			},
			dataType: "dataType",
			success: function (response) {
				location.reload();
			}
		});
	});

	$('#hour_search li').click(function (e) {
		e.preventDefault();

		var value = $(this).data('string');
		$("#hour_choose").val(value);
		document.getElementById('hour_search').innerHTML = value;
	});

	$('#serviceType_choose li').click(function (e) {
		e.preventDefault();

		var value = $(this).data('string');
		var idValue = $(this).data('id');
		document.getElementById('serviceType_choose').innerHTML = value;
		var classShow = ".ServiceType_"+idValue;

		$('#services_search li').hide();
		$('#services_search li'+classShow).show();
	});

	$('#services_search li').click(function (e) {
		e.preventDefault();

		let value = $(this).data('string');
		let idValue = $(this).data('id');
		$('#service_choose').val(idValue);
		document.getElementById('services_search').innerHTML = value;
	});

	$("#search").click(function (e) { 
		e.preventDefault();
		
		let id = $("#service_choose").val();
		let time_start = $("#hour_choose").val();
		let date_start = $("#date_choose").val();

		$.ajax({
			type: "POST",
			url: `/service/${id}`,
			data: {
				id: id,
				timeStart: time_start,
				dateStart: date_start
			},
			dataType: "dataType",
			success: function (response) {
				location.replace(`/service/${id}`);
			}
		});
	});
});