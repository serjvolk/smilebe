$(document).ready(function () {
	var w = $(window).outerWidth();
	var h = $(window).outerHeight();
	var isMobile = ('ontouchstart' in window);
	const $body = $('body');
	const BREAKPOINT_md1 = 1343;
	const BREAKPOINT_1045 = 1044.98;
	const BREAKPOINT_md2 = 992.98;
	const BREAKPOINT_872 = 871.98;
	const BREAKPOINT_md3 = 767.98;
	const BREAKPOINT_608 = 608.98;
	const BREAKPOINT_552 = 551.98;
	const BREAKPOINT_md4 = 479.98;

	// Изменение ширины окна браузера
	$(window).resize(function(){
		w = $(window).outerWidth();
		h = $(window).outerHeight();
	});

	// Действия при скролле
	$(window).scroll(function(){

	});

	@@include('_validation.js');

///////////////////////////// Логика бургер-меню ///////////////////////////////////////

const $burger = $(".js-burger");
const $menu = $(".js-menu");
const $overlay = $(".js-overlay");
let isActiveMenu = false;
// Открыть/закрыть меню / Скрыть меню при клике вне блока меню
$(document).on(isMobile ? "touchend" : "mousedown", function (e) {
	let isBurger = $(e.target).hasClass("js-burger");
	let isChildMenu = $menu.has(e.target).length === 1 ? true : false;
	let isMenu = $(e.target).hasClass("js-menu");
	
	let newStateMenu = isActiveMenu;
	if(isBurger){
		newStateMenu = !newStateMenu;
	}else if(isBurger === false && isMenu === false && isChildMenu === false){
		newStateMenu = false;
	}

	if(newStateMenu !== isActiveMenu){
		isActiveMenu = newStateMenu;
		$burger.toggleClass('active', isActiveMenu);
		$menu.toggleClass('active', isActiveMenu);
		$overlay.toggleClass('active', isActiveMenu);
		if(w < BREAKPOINT_md4){$body.toggleClass('lock', isActiveMenu);}
	}
});

///////////////////////////////// Слайдеры ///////////////////////////////////////////

$('.js-slider').slick({
	slidesToShow: 3,
	prevArrow: $('.products_withSlider .sliderBtn.btn-prev'),
	nextArrow: $('.products_withSlider .sliderBtn.btn-next'),
	responsive:[
		{ 
			breakpoint: BREAKPOINT_md2,
			settings: {
				slidesToShow: 2,
			}
		},
		{ 
			breakpoint: BREAKPOINT_608,
			settings: {
				slidesToShow: 1,
			}
		}
	]
});

//////////////////////////////////// Прочее /////////////////////////////////////////////

$(".js-full-year").text(new Date().getFullYear()); // В фитере показываем текущий год
$('.js-mask-tel').mask("+7(999)999-99-99"); // Маска для телефонов

// Если это страница ввода кода при входе, включаем таймер до повторной отправки кода
let $resendCodeText = $('.js-rest-time-resend-code');
let restSecondToResend = 59;
if($resendCodeText.length !== 0){
	let TIMER_CODE = setInterval(function(){
		$resendCodeText.text(restSecondToResend);
		restSecondToResend--;
		if(restSecondToResend === 0){
			clearInterval(TIMER_CODE);
			$('.js-rest-time-exist').remove();
			$('.js-rest-time-missing').removeClass('dn');
		}
	}, 1000);
}

/////////////////////////////////////////////////////////////////////////////////////////

	$(document).on("click", function(e){
		if(e.ctrlKey){
			
		}
	});
});