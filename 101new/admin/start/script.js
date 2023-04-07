window.onload = function () {
    var pd_items = document.querySelectorAll('[data-pdform]');

	pd_items.forEach(function(pd_item) {
	    pd_item.onsubmit = function(e) {
	    	e.preventDefault();
	    	var submit1 = pd_item.querySelector('[type="submit"]');
	    	var submit2 = pd_item.querySelector('submit');
	    	if (submit1) {
	    		submit1.setAttribute('disabled', 'disabled');
	    	}
	    	if (submit2) {
	    		submit2.setAttribute('disabled', 'disabled');
	    	}
	    	pd_item.insertAdjacentHTML('beforeend', '<div style="background-color:#fff;color:#000;font-weight:bold;font-size:15px;border:1px solid #eee;border-radius:8px;padding:10px 20px;margin-top:15px;margin-bottom:15px;" class="pagedot-form-send-result">Идёт отправка...</div>');
	    	const pd_form_id = pd_item.getAttribute('data-pdform');
			const pd_form = document.querySelector('[data-pdform="'+pd_form_id+'"]');
			const pd_params = new FormData(pd_form);
			pd_params.append('form_id', pd_form_id);

			var pd_request = new XMLHttpRequest();
			pd_request.open("POST", "app/form_send.php");

			pd_request.addEventListener("readystatechange", (item) => {
				if (pd_request.readyState === 4 && pd_request.status === 200) {
					var data = JSON.parse(pd_request.responseText);
					document.querySelector('.pagedot-form-send-result').remove();
					if (data.result == 'ok') {
						if (data.redirect) {
							setTimeout(function(){
								document.location.href = data.redirect;
							}, 1500);
						}
						var pd_inputs = pd_item.querySelectorAll('input');
						pd_inputs.forEach(function(pd_input) {
							pd_input.value = '';
						});
						var pd_textarea = pd_item.querySelectorAll('textarea');
						pd_textarea.forEach(function(pd_textarea) {
							pd_textarea.value = '';
						});
					}
					var submit1 = pd_item.querySelector('[type="submit"]');
			    	var submit2 = pd_item.querySelector('submit');
			    	if (submit1) {
			    		submit1.removeAttribute('disabled');
			    	}
			    	if (submit2) {
			    		submit2.removeAttribute('disabled');
			    	}
					pd_item.insertAdjacentHTML('beforeend', data.html);
					
			    }
			});
			pd_request.send(pd_params);
		}
	});

}