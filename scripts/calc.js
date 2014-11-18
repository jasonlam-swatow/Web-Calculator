var fn = function(id) {
	return document.getElementById(id);
};

Math.fix = function(n) {
	return 1/n;
};

var Util = {
	'√'	 : 'sqrt',
	'1/x': 'fix'
};


(function($) {

	var result = $('result'), 
			formula = $('formula'), 
			calcReady, 
			functionReady;

	var sizeChange = function() {
		if(result.innerHTML.length <= 12) {
			result.style.fontSize = '22px';
			if(!result.innerHTML) {
				result.innerHTML = 0;
			}
		} else {
			result.style.fontSize = '18px';
		}
	};
	// 若運算式區域爲一個負數，用括弧包裹之
	var wrap = function() {
		formula.innerHTML += result.innerHTML.charAt(0) === '-' 
			?
			'(' + result.innerHTML + ')' 
			: 
			result.innerHTML;
	};

	var _switch = function(chr) {
		switch(chr) {
			case '←':
				//  刪去末位字符
				result.innerHTML = result.innerHTML.substring(0, result.innerHTML.length-1);
				sizeChange();
				break;
			case 'CE': 
				result.innerHTML = '0';
				calcReady = false;
				break;
			case 'C': 
				result.innerHTML = '0';
				formula.innerHTML = '';
				calcReady = false;
				break;
			case '±': 
				// 正负切換
				result.innerHTML = result.innerHTML.charAt(0) === '-' 
					? 
					result.innerHTML.substring(1,result.innerHTML.length)
					:
					'-' + result.innerHTML
				break;
			case '√': 
			case '1/x': 
				functionReady || wrap();
				// 在運算式區域顯示fix()字樣，括弧內爲原運算式
				formula.innerHTML = Util[chr] + '(' + formula.innerHTML + ')';
				// 直接調用with(Math{})進行數學運算
				result.innerHTML = eval('with(Math){('+formula.innerHTML+')}');
				sizeChange();
				calcReady = true;
				functionReady = true;
				break;
			case '/': 
			case '*': 
			case '-': 
			case '+': 
			case '%':
				// 若運算式以運算符結尾
				if(calcReady) {
					formula.innerHTML =  !formula.innerHTML.split(/[+-\\*\\/]+/).pop()
						?
						formula.innerHTML.substring(0, formula.innerHTML.length-1) + chr
						:
						formula.innerHTML + chr;
				} else {
					// 否则，先追加數字進行運算並獲得結果，然後追加符號
					wrap();
					result.innerHTML = eval('with(Math){('+formula.innerHTML+')}');
					sizeChange();
					formula.innerHTML += chr;
					calcReady = true;
				}
				functionReady = false;
				break;

			case '.': 
				if(calcReady) {
					result.innerHTML = '0';
					calcReady = false;
				}

				if(result.innerHTML.length < 18 && result.innerHTML.indexOf('.') == -1 ) {
					result.innerHTML += chr;
				}
				break;
			case '=': 
				wrap();
				result.innerHTML = eval('with(Math){('+formula.innerHTML+')}');
				formula.innerHTML = '';
				sizeChange();
				break;
			default: //数字
				if(calcReady) {
					result.innerHTML = '0';
					calcReady = false;
				}
				if(functionReady) {
					formula.innerHTML = '';
				}


				if(result.innerHTML.length < 18) {
					result.innerHTML = result.innerHTML == '0' ? chr : result.innerHTML+chr;
				}
				sizeChange();
		}
	};

	
	// 綁定事件
	$('base-panel').onclick = function(e) {
		var evt = e || window.event; //w3c event && IE event
		var target = evt.target || evt.srcElement; //w3c target && IE target
		if( target.tagName.toUpperCase() === 'A' ) {
			_switch(target.innerHTML);
		}

	};

})(fn);


(function($) {
	if(!$)return;
	$('.header .mini').on('click',function() {
		$('#calc').animate({
			height: 28,
			left:114,
			bottom:160
		}, 300, 'swing', function(){
			$('.header').on('mouseover',function() {
				$('#calc').animate({
					height:288,
					left: '50%',
					bottom: '50%'
				});
			});
		});
	});

	$('.header .close').on('click',function() {
		$('#calc').addClass('rotate');
		setTimeout(function() {
			$('#calc').remove();
		}, 1000);
	});

		
})(jQuery);