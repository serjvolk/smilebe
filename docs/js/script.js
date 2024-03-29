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
		let scrollTop = $(window).scrollTop();
		fixedElementOnScroll(scrollTop);
		fixedCardOnScroll(scrollTop);
	});

	/////////////////// Скрипты для попапов ///////////////////////////

var popup = $(".popup");
var lastOpen = false;

// Показать попапы при клике
$(document).on("click", ".js-popup-open", function(e){
	e.preventDefault();
	if($(this).hasClass('disabled')){return false;}
	openPopup($(this).data('popupid'));
});

// Открыть попап
function openPopup(popupID) {
	if(lastOpen !== popupID){
		if(lastOpen !== false){close_popup();}
		lastOpen = popupID;
		$('#'+popupID).addClass('open');
		bodyLock();
	}else{
		close_popup();
	}
}

// Скрыть попапы при клике вне попапа и вне области вызова попапа
$(document).on(isMobile ? "touchend" : "mousedown", function (e) {
	var popupTarget = $(".js-popup-open").has(e.target).length;
	// Если (клик вне попапа && попап имеет класс open)
    if (popup.has(e.target).length === 0 && popup.hasClass('open') && popupTarget === 0 && $('.js-micropopup-lottery').has(e.target).length === 0){
	    close_popup();
	}
});

// Скрыть попап при нажатии на клавишу "Esc"
$(document).on("keydown", function (e) {
	if(e.which === 27){
		close_popup();

		// Закрыть слайдер отзывов 
		if($activeSlidersReviews !== null){closeSliderReviews();}

		// Закрыть сторисы
		closeStories();
	}
});

// Блокировка скролла при открытии попапа
function bodyLock() {
	$body.addClass('lock');
}

// Разблокировка скролла при закрытии попапа
function bodyUnLock() {
	$body.removeClass('lock');
}

// Закрыть popup
function close_popup() {
	$(".popup").removeClass('open');
	bodyUnLock();
	lastOpen = false;
}

// Закрыть попапа при нажатии на кнопки "Close"
$(document).on("click", ".js-popup-close", function(e){
	e.preventDefault();
	close_popup();
});;
	/*Когда у скролла есть wrapScroll ему нужно задать высоту 
так как его дочерний элемент абсолютно позиционирован */
function setHeightWrapScroll() {
	if($('.wrapScroll').length !== 0){
		var scrollHeight = $('.scroll').height();
		$('.wrapScroll').css('height', scrollHeight+'px');
	}
}
setHeightWrapScroll();

/* ВНИМАНИЕ!!! 
	Если кнопки скролла внутри блока .scroll то все ок, а если снаружи то для
	.scroll нужно задать data-scroll-id="" и также и для .scroll__button.btn-prev и 
	для .scroll__button.btn-next.
*/
var ScrollElement = function(elem) {
	let isResponsive = elem.hasClass('responsive');
	var body = elem.find('.scroll__body');
	var wBody = body.width();
	if(isResponsive === true){
		let oneElementWidth;
		if(w > BREAKPOINT_md1){
			oneElementWidth = (wBody - (3*16)) / 4;
		}else if(w > BREAKPOINT_872){
			oneElementWidth = (wBody - (4*16)) / 3;
		}else if(w > BREAKPOINT_552){
			oneElementWidth = (wBody - (3*16)) / 2;
		}else{
			oneElementWidth = (wBody - (2*16)) / 1;
		}
		if(w > BREAKPOINT_md3){elem.find('.cardReviews').css('width', oneElementWidth+'px');}
	}
	var scroll = elem.find('.scroll__scroll');
	var wScroll = scroll.width();
	var scrollID = elem.data('scroll-id');
	if(scrollID == undefined){ // Если кнопки управления лежат внутри .scroll
		var btn_prev = elem.find('.scroll__button.btn-prev');
		var btn_next = elem.find('.scroll__button.btn-next');
	}else{ // Если кнопки управления лежат где то снаружи
		var btn_prev = $('.js-scroll-button.btn-prev[data-scroll-id='+scrollID+']');
		var btn_next = $('.js-scroll-button.btn-next[data-scroll-id='+scrollID+']');
	}
	
	var overlay_prev = elem.find('.overlayArea-prev');
	var overlay_next = elem.find('.overlayArea-next');
	var paddingLeft = parseFloat(scroll.css('padding-left'));
	var paddingRight = parseFloat(scroll.css('padding-right'));

	// Просчитываем количество проскролла и выдаем scrollPosition
	var calcPosition = function (action, direction) {
		var diff = Math.round(scroll.width() +  paddingLeft + paddingRight - body.width());
		var scrollLeft = Math.round(body.scrollLeft());

		if(action === 'buttonClick'){
			if(isResponsive){
				if(w > BREAKPOINT_md1){
					var stepScroll = (elem.width()+16) * 1;
				}else if(w < BREAKPOINT_md3){
					var stepScroll = elem.width() * 0.8;
				}else{
					var stepScroll = (elem.width()-16) * 1;
				}
			}else{
				var stepScroll = elem.width() * 0.8;
			}
			
			if(direction === 'next'){
				scrollLeft += stepScroll;
				if(scrollLeft > diff){scrollLeft = diff;}
			}else{
				scrollLeft -= stepScroll;
				if(scrollLeft < 0){scrollLeft = 0;}
			}
		}
		if(scrollLeft === 0){
			scrollPosition('start');
		}else if(scrollLeft === diff){
			scrollPosition('finish');
		}else{
			scrollPosition('center');
		}
		return scrollLeft;
	}

	// Клик по кнопкам (только для DESKTOP)
	var buttonClick = function (direction){
		var scrollLeft = calcPosition('buttonClick', direction);
		body.stop().animate({scrollLeft:scrollLeft}, 500, 'swing');
	}

	// Скрыть показать кнопки в зависимости от положения скролла
	var scrollPosition = function (position) {
		if(position === 'start'){
			if(isMobile === false){
				btn_prev.removeClass('open');
				btn_next.addClass('open');
			}
			overlay_prev.removeClass('open');
			overlay_next.addClass('open');
		}else if (position === 'center'){
			if(isMobile === false){
				btn_prev.addClass('open');
				btn_next.addClass('open');
			}
			overlay_prev.addClass('open');
			overlay_next.addClass('open');
		}else if(position === 'finish'){
			if(isMobile === false){
				btn_prev.addClass('open');
				btn_next.removeClass('open');
			}
			overlay_prev.addClass('open');
			overlay_next.removeClass('open');
		}else if(position === 'not-scroll'){
			if(isMobile === false){
				btn_prev.removeClass('open');
				btn_next.removeClass('open');
			}
			overlay_prev.removeClass('open');
			overlay_next.removeClass('open');
		}
	}

	// Начальное положение скролла (скролл есть или его нет)
	wScroll > wBody ? scrollPosition('start') : scrollPosition('not-scroll');

	if(isMobile){
		btn_prev.removeClass('open');
		btn_next.removeClass('open');
		
	}else{
		btn_next.click(function(){ buttonClick('next'); });
		btn_prev.click(function(){ buttonClick('prev'); });
	}
	body.scroll(function(){calcPosition();});
}

$(".scroll").each(function(){
	if(!(w < BREAKPOINT_md4 && $(this).hasClass('js-not-md4'))){
		new ScrollElement($(this));
	}
});
;
	// Инициируем обработчики валидации
function initValidators() {
	// Валидируем поля формы перед отправкой
	$('.js-validation-form').submit(function (e) {
		if($(e.originalEvent.submitter).hasClass('js-submit-without-validate') === true){return true;}

		let isSubmitForm = true;
		$(this).find("._validate").each(function(){
			let validateType = $(this).data('validation-type');
			let value = $(this).val();
			let error = false;
			for (var i = 0; i < validateType.length; i++) {
				let isValid = validator[validateType[i]](value);
				if(isValid !== true){error = isValid; break;}
			}
			if(error !== false){
				isSubmitForm = false;
				$(this).addClass('_error');
				$(this).closest('.js-validation-block').find('.js-validation-error').text(errorMessage[error]);
			}
		});

		if(isSubmitForm === false){
			$(this).find('.js-form-submit').addClass('disabled');
		}
		return isSubmitForm;
	});

	// Про фокусе поля убираем у него ошибку
	$(".js-validation-form ._validate").on("focus change", function(){
		if($(this).hasClass('_error')){
			$(this).removeClass('_error');
			$(this).closest('.js-validation-block').find('.js-validation-error').text('');
		}

		let errorsCount = $(this).closest(".js-validation-form").find('._error').length;
		if(errorsCount === 0){
			$(this).closest(".js-validation-form").find('.js-form-submit').removeClass('disabled');
		}
	});
}
initValidators();

// Все виды валидации
let validator = {
	req: function (value) {
		if(value === ""){return "required";}
		return true;
	},
	tel: function (value) {
		if(value === ""){return true;}
		if(/^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){8,14}(\s*)?$/.test(value) === false){return "wrongTelephone";}
		return true;
	},
	email: function (value) {
		if(value === ""){return true;}
		if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(value) === false){return "wrongEmail";}
		return true;
	},
	name: function (value) {
		if(value === ""){return true;}
		if(value.length < 2){return "wrongNameShort";}
		if(value.length > 100){return "wrongNameLong";}
		return true;
	},
	password: function (value) {
		if(value === ""){return true;}
		if(/^[a-zA-Z0-9]+$/.test(value) === false){return "passwordOnlyLatin";}
		if(/^[^-() /]*$/.test(value) === false){return "passwordWithoutCharacters";}
		if(value.length < 8){return "wrongPasswordShort";}
		if(value.length > 100){return "wrongPasswordLong";}
		if(parseInt(value.substr(0, 1))){return "passwordFirstSymbolLeter";}
		return true;
	},
	passwordMatch: function (value) {
		let firstPasswordValue = $('.js-password-match').val();
		if(firstPasswordValue !== value){return "passwordNotMatch";}
		return true;
	},
	reqAddress: function (value) {
		if(value === ""){return "requiredAddress";}
		return true;
	},
	bankCard: function (value) {
		if(value === ""){return true;}
		if(/[-0-9]{16}/.test(value) === false){return "wrongWankCard";}
		return true;
	},
	reqImage: function (value) {
		if(value === ""){return "requiredImage";}
		return true;
	}
};

// Показать/скрыть пароль
$(".js-showHidePassword").click(function(){
	var parent = $(this).closest('.js-showHidePasswordParent');
	if (parent.find('input').attr('type') === 'password'){
		parent.find('input').attr('type', 'text');
		$(this).addClass('active');
	} else {
		parent.find('input').attr('type', 'password');
		$(this).removeClass('active');
	}
});

// Все виды ошибок
let errorMessage = {
	"required" : "Поле обязательное для заполнения",
	"wrongTelephone": "Неверный формат номера телефона",
	"wrongEmail": "Неверный формат электронной почты",
	"wrongNameShort": "Cлишком короткое значение (мин. 2 символа)",
	"wrongNameLong": "Cлишком длинное значение (макс. 100 символов)",
	"wrongPasswordShort": "Пароль должен содержать больше 8 символов",
	"wrongPasswordLong": "Пароль должен содержать меньше 80 символов",
	"passwordOnlyLatin": "Пароль должен содержать только латинские буквы и цифры",
	"passwordWithoutCharacters": "Пароль не должен содержать спецсимволы (),/- []",
	"passwordFirstSymbolLeter": "Пароль должен начинаться с буквы",
	"passwordNotMatch": "Пароли не совпадают",
	"requiredAddress" : "Выберите адрес доставки",
	"wrongWankCard": "Поле должно содержать 16 цифр",
	"requiredImage": "Необходимо прикрепить скриншот"
};;

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

///////////////////////////// Выпадающие списки ////////////////////////////////////

// Клик по выпадающему списку
$(document).on("click", ".js-dropdown-head", function(){
	if($(this).closest(".js-dropdown-item").hasClass('js-only-md4') && w > BREAKPOINT_md4){ return; }

	let dropdownItem = $(this).closest('.js-dropdown-item');
	let dropdownBody = dropdownItem.find('.js-dropdown-body');
	let isActive = dropdownItem.hasClass('active');
	dropdownItem.toggleClass("active", !isActive);
	isActive ? dropdownBody.slideUp(300) : dropdownBody.slideDown(300);
});

/** При инициализации страницы закрываем/открываем выпадающий список в зависимости от класса "active" */
$(".js-dropdown-item").each(function(){
	if($(this).hasClass('js-only-md4') && w > BREAKPOINT_md4){ return; }

	let isActive = $(this).hasClass('active');
	isActive ? $(this).find('.js-dropdown-body').show() : $(this).find('.js-dropdown-body').hide();
});


//////////////////// Выпадающий список у блока Ingredients ///////////////////////////

/* Меняем состояние при клике */
$(document).on("click", ".js-ingredients-list-trigger", function(){
	let isActive = $(this).hasClass('active');
	$(this).toggleClass("active", !isActive);
	isActive ? $('.js-ingredients-list').slideUp(300) : $('.js-ingredients-list').slideDown(300);
});

/* Устанавливаем состояние при инициализации */
(function ingredientsInit() {
	const isActive = $(".js-ingredients-list-trigger").hasClass("active");
	isActive ? $('.js-ingredients-list').show() : $('.js-ingredients-list').hide();
})();

///////////////////////////////// Слайдеры ///////////////////////////////////////////

$('.js-slider').slick({
	slidesToShow: 3,
	prevArrow: $('.products_withSlider .sliderBtn.btn-prev'),
	nextArrow: $('.products_withSlider .sliderBtn.btn-next'),
	responsive:[
		{ 
			breakpoint: 1150,
			settings: {
				slidesToShow: 2,
			}
		},
		{ 
			breakpoint: 800,
			settings: {
				slidesToShow: 1,
			}
		}
	]
});

///////////////////// Скопировать ссылку в буфер обмена /////////////////////// 

// Копирование текста в буфер обмена
function copy_in_buffer(txt) {
	var $tmp = $("<textarea>");
	$("body").append($tmp);
	$tmp.val(txt).select();
	document.execCommand("copy");
	$tmp.remove();
}

// Клик на скопировать ссылку
$(".js-copy-text").click(function(){
	let txt = $(this).data('copy-text');
	let msg = $(this).data('copy-message');
	copy_in_buffer(txt);
	showAlertPupup(msg);
});

// Показать всплывашку снизу поцентру экрана
function showAlertPupup(message) {
	$('.simpleMessage').remove();
	$body.append('<div class="simpleMessage">'+message+'</div>');
}

////////////////////////////// Блок отзывов //////////////////////////////////

let $activeSlidersReviews = null;
// Открыть слайдер с картинками отзывов
$(".js-detect-grid .imageFeedback__item").click(function(){
	if($activeSlidersReviews === null){
		let $parent = $(this).closest('.js-detect-grid');
		let index = $(this).index();

		$parent.removeClass('imageFeedback').addClass("isSliderReviews");
		$parent.find('video').prop('muted', false).prop('controls', true);
		$body.addClass('lock');
		$('.feedbackSliderControls').addClass('active');
		$activeSlidersReviews = $parent;

		$parent.slick({
			prevArrow: $('.feedbackSliderControls .feedbackBtn.btn-prev'),
			nextArrow: $('.feedbackSliderControls .feedbackBtn.btn-next'),
			initialSlide: index
		});
		/*$parent.on('beforeChange', function(event, slick, currentSlide, nextSlide){
			$parent.find('video').get(0).pause();
		});*/
	}
});

// Действие для закрытия слайдера
$(".js-close-SliderReviews").click(function(){
	closeSliderReviews();
});

// Действие для закрытия слайдера
$(document).on("click", function(e){
	if($activeSlidersReviews !== null && $(e.target).hasClass('imageFeedback__wrap')){
		closeSliderReviews();
	}
});

// Закрыть слайдер с картинками отзывов
function closeSliderReviews() {
	$activeSlidersReviews.slick('unslick');
	$activeSlidersReviews.removeClass('isSliderReviews').addClass("imageFeedback");
	let video = $activeSlidersReviews.find('video');
	if(video.length !== 0){
		video.prop('muted', true).prop('controls', false);
		video.get(0).pause();
	}
	$('.feedbackSliderControls').removeClass('active');
	$body.removeClass('lock');
	$activeSlidersReviews = null;
}

// Узнать сколько картинок в отзывах и задать нужную grid-сетку
$(".js-detect-grid").each(function(){
	let countChild = $(this).children().length;
	$(this).addClass("child-" + countChild);
});

let iterationsDetectVideoDuration = {count: 0, max: 25};

// Узнать есть ли видосики в блоке с отзывами
function detectDurationVideo() {
	if(iterationsDetectVideoDuration.count > iterationsDetectVideoDuration.max){return false;}
	iterationsDetectVideoDuration.count++;
	$(".js-detect-grid .imageFeedback__item video").each(function(){
		let duration = $(this)[0].duration.toFixed(0);
		if(duration === "NaN"){
			setTimeout(function() {detectDurationVideo();}, 1000);
			return false;
		}
		let m = duration % 60;
		let min = Math.floor(duration / 60);
		let result = (min < 10 ? '0' : '') + min + ':' + (m < 10 ? '0' : '') + m;
 		let html = '<span class="imageFeedback__duration">'+result+'</span>';
 		html += '<span class="btnRound btnPlayVideo">';
		html += '<svg class="w-16"><use xlink:href="img/sprite/icons-sprite.svg#play_2"/></svg>';
		html += '</span>';
 		$(this).closest('.imageFeedback__wrap').append(html);
 	});
}
setTimeout(function() {detectDurationVideo();}, 10);

//////////////////// Слайдер в начале страницы "СТРАНИЦА ТОВАРА" ////////////////////////

// Узнать ID слайда с презентацией
let slidePresentationID = $('.sliderBig__item .js-presentation-video').parent().index();

/* Отследить инициализацию слайдера js-sliderBig. Чтобы избежать мигания картинок, до 
   инициализации слайдера скрываем все слайды кроме первого */
$('.js-sliderBig').on('init', function(event, slick){
  $('.js-sliderBig').removeClass('preInit');
});

// Инициализация слайдера
$('.js-sliderBig').slick({
	prevArrow: $('.product .sliderBtn.btn-prev'),
	nextArrow: $('.product .sliderBtn.btn-next'),
	//autoplay: true,
	//autoplaySpeed: 3500,
});

// Отслеживаем действие -> перелистывание слайда
$('.js-sliderBig').on('beforeChange', function(event, slick, currentSlide, nextSlide){
  $('.js-scrollPreview .scrollPreview__item').removeClass('active');
  $('.js-scrollPreview .scrollPreview__item:eq('+nextSlide+')').addClass('active');

  /** Автоперелистывание слайдов в блоке превью слайдов */
  if(w < BREAKPOINT_md2){
  	  let scrollLeft = $('.js-scrollPreview').scrollLeft();
	  let widthScroll = parseInt($('.js-scrollPreview').width());
	  nextSlide = parseFloat(nextSlide);

	  let startVisibility = scrollLeft;
	  let endVisibility = scrollLeft + widthScroll;

	  let leftItem = nextSlide * 96;
	  let rightItem = (nextSlide * 96) + 80;

	  let setScroll = false;
	  if(rightItem > endVisibility){setScroll = rightItem - endVisibility + scrollLeft;}
	  if(leftItem < startVisibility){setScroll = leftItem;}

	  if(setScroll !== false){
	  	$('.js-scrollPreview').animate({scrollLeft: setScroll}, 300);
	  }
  }else{
  	  let scrollLeft = $('.js-scrollPreview').scrollTop();
	  let widthScroll = parseInt($('.js-scrollPreview').height());
	  nextSlide = parseFloat(nextSlide);

	  let startVisibility = scrollLeft;
	  let endVisibility = scrollLeft + widthScroll;

	  let leftItem = nextSlide * 88;
	  let rightItem = (nextSlide * 88) + 80;

	  let setScroll = false;
	  if(rightItem > endVisibility){setScroll = rightItem - endVisibility + scrollLeft;}
	  if(leftItem < startVisibility){setScroll = leftItem;}

	  if(setScroll !== false){
	  	$('.js-scrollPreview').animate({scrollTop: setScroll}, 300);
	  }
  }
  

  // Логика автовоспроизведения видео
  let $video = $(slick.$slides.get(nextSlide)).find('video');
  let isSlideWithVideo = $video.length;
  if(isSlideWithVideo === 1){
  	$video.trigger('play');
  }else{
  	$('.sliderBig__item video').trigger('pause');
  }
});

// Клик по слайду в превью блоке
$(".js-scrollPreview .scrollPreview__item").click(function(){
	var index = $(this).index();
	$('.js-sliderBig').slick('goTo', index);
});

// Клик по "как пользоваться", тоесть открыть презентационное видео
$(".js-view-presentation-video").click(function(){
	$('.js-sliderBig').slick('goTo', slidePresentationID);
});

///////////////////// Видео истории в блоке testimonials ////////////////////////////////

const TIME_SLIDE_DURATION = 5000; // Длительность слайда с картинкой

let $lastVideoPlaying = null;
let isStoped = false; // Слайдер на паузе
// Момент инициализации/переключения слайдов
$('.js-slick-tape').on('init beforeChange', function(event, slick, currentSlide, nextSlide){
	let $video = event.type === "init" ? $(slick.$slides[0]).find('video') : $(slick.$slides.get(nextSlide)).find('video');
	const duration = $video.length === 1 ? $video[0].duration * 1000 : TIME_SLIDE_DURATION;
	const countSlides = $(slick.$slides).length;
	const indexCurrentSlide = event.type === "init" ? 0 : nextSlide;

	// Остановить видео в предыдущем слайде если оно там есть
	if($lastVideoPlaying !== null){
		$lastVideoPlaying.get(0).pause();
	  $lastVideoPlaying = null;
	}

	// Если в текущем слайде есть видео, запустить его
	if($video.length === 1){
		$video[0].currentTime = 0;
		$video.get(0).play();
		$lastVideoPlaying = $video;
	}

	isStoped = false;
	$('.js-tape-pause').removeClass("active");
	$('.js-timescale').remove();
	$('.js-slick-tape').append(addTimescale(countSlides, indexCurrentSlide, duration));
	autoSlide(duration);
});

let timeoutNextSlide = null, startSlideTime;
// Автопереключение слайдов
function autoSlide(delay) {
	startSlideTime = new Date().getTime();
	clearTimeout(timeoutNextSlide);
	timeoutNextSlide = setTimeout(function() {
		$('.js-slick-tape').slick('slickNext');
	}, delay);
}

$('.js-slick-tape').slick({
	prevArrow: $('.js-tape-controls .btnRound.btn-prev'),
	nextArrow: $('.js-tape-controls .btnRound.btn-next'),
});

// Создать временные шкалы (отрезки)
function addTimescale(count, itemActive, duration = TIME_SLIDE_DURATION) {
	let html = '<div class="timescale js-timescale" style="--stories-duration: '+duration+'ms;">';
		html += '<div class="timescale__lines">';
			for (var i = 0; i < count; i++){
				let timescale_leftClass = i === itemActive ? "active" : i < itemActive ? "complete" : "";
				html = html + '<div class="timescale__item"><div class="timescale__left '+timescale_leftClass+'"></div></div>';
			}
		html += '</div>';
	html += '</div>';
	return html;
}

let leftTimeSlide;
// Остановить автопрокрутку сторисов
$(document).on("mousedown", ".js-tape-pause", function(e){
	if(isStoped === false){
		isStoped = true;
		$(this).addClass('active');
		$('.timescale__left').addClass('pause');
		let nowTime = new Date().getTime();
		leftTimeSlide = nowTime - startSlideTime;
		clearTimeout(timeoutNextSlide);
		if($lastVideoPlaying !== null){
			$lastVideoPlaying.get(0).pause();
		}
	}else{
		isStoped = false;
		$(this).removeClass('active');
		$('.timescale__left').removeClass('pause');
		if($lastVideoPlaying !== null){
			$lastVideoPlaying.get(0).play();
		}
		let durationSlide = $lastVideoPlaying !== null ? $lastVideoPlaying.get(0).duration * 1000 : TIME_SLIDE_DURATION;
		autoSlide(durationSlide - leftTimeSlide);
	}
});

let storiesVideoMuted = true;
// Включение/Отключение звука на видео
$(document).on("click", ".js-tape-mute", function(e){
	storiesVideoMuted = !storiesVideoMuted;
	$('.tape__item video').prop('muted', storiesVideoMuted);
	$(this).toggleClass('active');
});

///////////////////////// Блок историй (подобие инстаграм) /////////////////////////////

const TIME_SLIDE_STORIES_DURATION = 5000; // Длительность слайда с картинкой
let isInitStoriesSlider = false;
// Открыть истории
$('.js-stories').click(function(e){
	let isItem = $(e.target).closest('.about__item').length;
	if(isItem === 1){ // Показать сторис
		let id = $(e.target).closest('.about__item').data('id');
		let idCount = $('.stories__item[data-id="'+id+'"]').not('.slick-cloned').length;
		let index = $('.stories__item[data-id="'+id+'"]').not('.slick-cloned').index();

		$('.js-stories').addClass('active');
		$body.addClass('lock');
		
		if(isInitStoriesSlider === false){
			$('.js-sliderStories').slick({
				prevArrow: $('.stories__body .sliderBtn.btn-prev'),
				nextArrow: $('.stories__body .sliderBtn.btn-next'),
				initialSlide: index,
			})
			$('.js-sliderStories').slick('goTo', index);
		}else{
			$('.js-sliderStories').slick('goTo', index-1);
		}
		isInitStoriesSlider = true;
	}else{ // Скрыть сторисы
		if($(e.target).hasClass("stories__body")){
			closeStories();
		}
	}
});

let $lastVideoPlayingStories = null;
// Переключение на новый слайд
$('.js-stories').on('beforeChange', function(event, slick, currentSlide, nextSlide){
	let currentID = $(slick.$slides.get(nextSlide)).data('id');
	let subslideCount = $('.stories__item[data-id="'+currentID+'"]').not('.slick-cloned').length;
	let subSlideID = 0;
	if(subslideCount !== 1){subSlideID = $(slick.$slides.get(nextSlide)).data('sub-id');}

	// Определяем наличие видео в слайде
	let $video = $(slick.$slides.get(nextSlide)).find('video');
	let isSlideWithVideo = $video.length;
	let duration = null;
	if($lastVideoPlayingStories !== null){
		$lastVideoPlayingStories.get(0).pause();
	  $lastVideoPlayingStories = null;
	}
	if(isSlideWithVideo === 1){
		duration = $video[0].duration * 1000;
		$video[0].currentTime = 0;
		$video.get(0).play();
		$lastVideoPlayingStories = $video;
	}

	let delay = duration > 0 ? duration : TIME_SLIDE_STORIES_DURATION;
	isStopedStories = false;
	$('.js-timescale-stories').remove();
	$('.js-sliderStories').append(addTimescaleStories(subslideCount, subSlideID, delay));
	calcScrollbarStories(currentID);
	autoSlideStories(delay);
});

// Логика вертикального скроллбара
function calcScrollbarStories(currentID) {
	let h = $(window).height();
	let heightItem = $('.about__item[data-id="'+currentID+'"]').outerHeight();
	let marginTop = heightItem * currentID;
	let itemStart = (h / 2) - (heightItem / 2) - 8;
	let setScroll = marginTop - itemStart;
	$('.js-stories .scroll__body').animate({scrollTop: setScroll}, 300);
}

let timeoutNextSlideStories = null, startSlideTimeStories;
// Автопереключение слайдов
function autoSlideStories(delay = TIME_SLIDE_DURATION) {
	startSlideTimeStories = new Date().getTime();
	clearTimeout(timeoutNextSlideStories);
	timeoutNextSlideStories = setTimeout(function() {
		$('.js-sliderStories').slick('slickNext');
	}, delay);
}

// Создание панели управления слайдом
function addTimescaleStories(count, itemActive, duration = TIME_SLIDE_STORIES_DURATION) {
	let isMuted = storiesVideoMutedStories === false ? "" : "active";

	let html = '<div class="timescale timescaleStories js-timescale-stories" style="--stories-duration: '+duration+'ms;">';
		html += '<div class="timescale__lines">';
			for (var i = 0; i < count; i++){
				let timescale_leftClass = i === itemActive ? "active" : i < itemActive ? "complete" : "";
				html = html + '<div class="timescale__item"><div class="timescale__left '+timescale_leftClass+'"></div></div>';
			}
		html += '</div>';
		html += '<div class="f-jcsb-aic mt-16">';
			html += '<div class="d-flex">';
				html += '<svg class="timescale__control svgWithState w-24 js-stories-pause">';
					html += '<use class="st-1" xlink:href="'+pathSprite+'#pause"/>';
					html += '<use class="st-2" xlink:href="'+pathSprite+'#play_w16in24"/>';
				html += '</svg>';

				html += '<svg class="timescale__control svgWithState volumn w-24 js-stories-volumn '+isMuted+'">';
					html += '<use class="st-1" xlink:href="'+pathSprite+'#volumn-on"/>';
					html += '<use class="st-2" xlink:href="'+pathSprite+'#volumn-off"/>';
				html += '</svg>';
			html += '</div>';
			html += '<svg class="timescale__control close w-24 js-close-stories">';
				html += '<use xlink:href="'+pathSprite+'#close"/>';
			html += '</svg>';
		html += '</div>';
	html += '</div>';
	return html;
}
	
// Закрыть сторисы
$(document).on("click", ".js-close-stories", function(){
	closeStories();
});

// Закрыть сторисы
function closeStories() {
	clearTimeout(timeoutNextSlideStories);
	if($lastVideoPlayingStories !== null){
		$lastVideoPlayingStories.get(0).pause();
	  $lastVideoPlayingStories = null;
	}
	$('.js-stories').removeClass('active');
	$body.removeClass('lock');
}

let isStopedStories = false, leftTimeSlideStories;
// Остановить автопрокрутку сторисов
$(document).on("mousedown", ".js-stories-pause", function(e){
	if(isStopedStories === false){
		isStopedStories = true;
		$(this).addClass('active');
		$('.timescale__left').addClass('pause');
		let nowTime = new Date().getTime();
		leftTimeSlideStories = nowTime - startSlideTimeStories;
		clearTimeout(timeoutNextSlideStories);
		if($lastVideoPlayingStories !== null){
			$lastVideoPlayingStories.get(0).pause();
		}
	}else{
		isStopedStories = false;
		$(this).removeClass('active');
		$('.timescale__left').removeClass('pause');
		if($lastVideoPlayingStories !== null){
			$lastVideoPlayingStories.get(0).play();
		}
		let durationSlide = $lastVideoPlayingStories !== null ? $lastVideoPlayingStories.get(0).duration * 1000 : TIME_SLIDE_STORIES_DURATION;
		autoSlide(durationSlide - leftTimeSlideStories);
	}
});

let storiesVideoMutedStories = false;
// Включение/Отключение звука на видео
$(document).on("click", ".js-stories-volumn", function(e){
	storiesVideoMutedStories = !storiesVideoMutedStories;
	$('.stories__item video').prop('muted', storiesVideoMutedStories);
	$(this).toggleClass('active');
});

////////////////////////////////////// Home ////////////////////////////////////////////

var $video_fScreen = $(".js-fScreen video");
// Запускаем одновременно 2 видео когда они оба подгрузились
function startVideo() {
	let hasError = false;
  	$video_fScreen.each(function(){
		let duration = $(this)[0].duration;
		if(isNaN(duration)){hasError = true;}
	});
	if(hasError === true){
		setTimeout(function(){
			startVideo();
		},500);
	}else{
		$(".js-fScreen").addClass("js-video-active");
		$(".js-fScreen").find(".js-video").trigger('play');
	}
}
//startVideo();
$(".js-fScreen").find(".js-video").trigger('play');

/** Сразу фильтруем после инициализации фильтра */

$('.js-slider-bundles').on('init', function(event, slick){
	setTimeout(function() {
		filterBundles($("#js-bandles-first"), "filter-group-1");
	}, 1000);
});


var slidesToShow = 1;
// Посчитать сколько слайдов нужно показывать для слайдера
function calcToShow() {
	const slideWidth = w < BREAKPOINT_md4 ? 332 : 432;
	if(w > BREAKPOINT_md1){
		slidesToShow = BREAKPOINT_md1 / slideWidth;
	}else{
		slidesToShow = (w - 16) / slideWidth;
	}
	
}
calcToShow();

// Слайдер наборов
$('.js-slider-bundles').slick({
	prevArrow: $('.bundles .btnRound.btn-prev'),
	nextArrow: $('.bundles .btnRound.btn-next'),
	slidesToShow: slidesToShow,
	infinite: false
});

// Функция ниже позволяет отфильтровать слайдов внутри слай пу указанному классу (.filter)
$(".js-filter-slider .scroll__item a").click(function(e){
	e.preventDefault();
	let filter = $(this).data('filter');
	filterBundles($(this), filter);
});

// Фильтрация слайдера 
function filterBundles(elem, filter) {
	$(".js-filter-slider .scroll__item a").removeClass('btn_black').addClass("btn_light");
	elem.removeClass('btn_light').addClass("btn_black");

	if(filter === 'all'){
		$('.js-slider-bundles').slick('slickUnfilter').slick('slickFilter', '.bundles__col'); // Отменяем фильтровку
	}else{
		$('.js-slider-bundles').slick('slickUnfilter').slick('slickFilter', '.'+filter); // Фильтруем
	}

	let slickListWidth = $(".js-slider-bundles .slick-list").width();
	let slickTrackWidth = $(".js-slider-bundles .slick-track").width();
	const diff = slickTrackWidth - slickListWidth;
	if(diff < 30){
		$('.bundles .sliderBtn').hide();
	}else{
		$('.bundles .sliderBtn').show();
	}
	setTimeout(function() {
		$('.js-slider-bundles').slick('goTo', 0);
	}, 500);
}

//////////////////////////////////// Корзина ///////////////////////////////////////////

let isFixedTotality = false;
let totalityFixed = $('.js-totalityFixed');
let anchorTotalityFixed = $('.js-totalityFixed-anchor');
let totalityHeight = totalityFixed.outerHeight();
// Фиксируем блок подтверждения заказа при доскролле до него
function fixedCardOnScroll(scrollTop) {
	if(totalityFixed.length === 0 || w > BREAKPOINT_md3){return false;}

	let bottomAnchor = $(document).height() - h - (totalityFixed.height() * 5);
	let topAnchor = anchorTotalityFixed.offset().top - h;

	if((scrollTop > topAnchor && scrollTop < bottomAnchor && isFixedTotality === false) || 
		 ((scrollTop < topAnchor || scrollTop > (bottomAnchor+totalityHeight+32)) && isFixedTotality === true)){
		isFixedTotality = !isFixedTotality;
		totalityFixed.toggleClass('active', isFixedTotality);
	}
}

// В зависимости от разрешения экрана меняем расположение блоков местами
var movementBlockStateDESC = true;
function moveDOMelement (){
	if(w < BREAKPOINT_md2 && movementBlockStateDESC === true){
		$(".js-movement-block").each(function(){
			var id = $(this).closest('.js-movement-block-to-desc').data('id');
			$(this).appendTo('.js-movement-block-to-mob[data-id='+id+']');
			movementBlockStateDESC = false;
		});
	}else if(w > BREAKPOINT_md2 && movementBlockStateDESC === false){
		$(".js-movement-block").each(function(){
			var id = $(this).closest('.js-movement-block-to-mob').data('id');
			$(this).appendTo('.js-movement-block-to-desc[data-id='+id+']');
			movementBlockStateDESC = true;
		});
	}
}
moveDOMelement();

// Селект похожий на обычный
$('.js-select-once-2').select2({ 
	minimumResultsForSearch: -1,
	width: 'auto',
	dropdownCssClass: "select-once-2-dropdown",
});

// Отследить инициализацию слайдера в корзине
$('.js-cartSlider').on('init', function(event, slick){
  $('.js-cartSlider-slideCount').text(slick.slideCount);
});

// Слайдер в корзине
$('.js-cartSlider').slick({
	prevArrow: $('.js-cartSlider-control.btn-prev'),
	nextArrow: $('.js-cartSlider-control.btn-next'),
});

$('.js-cartSlider-slideCount').text();
// Узнать текущий слайд для слайдера в корзине
$('.js-cartSlider').on('afterChange', function(event, slick, currentSlide, nextSlide){
	let currentNumberSlide = (currentSlide ? currentSlide : 0) + 1;
	$('.js-cartSlider-currentSlide').text(currentNumberSlide);
	$('.js-cartSlider-slideCount').text(slick.slideCount);
});

//////////////////////////////////// Прочее /////////////////////////////////////////////

$(".js-full-year").text(new Date().getFullYear()); // В фитере показываем текущий год
$('.js-mask-tel').mask("+7(999)999-99-99"); // Маска для телефонов
$('.js-mask-card').mask("9999-9999-9999-9999"); // Маска для банковских карточек

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

// Редактировать персональную информацию
$(".js-personal-edit").click(function(){
	$(this).addClass('dn');
	$(this).closest('.js-validation-form').find('input').removeAttr('disabled');
	$(this).closest('.js-validation-form').find('.js-form-submit').removeClass('dn');
});

// Кнопки play|stop управляют видео в рамках подителя .js-video-container
$(".js-video-control").click(function(){
	var $parent = $(this).closest('.js-video-container');
	var isPlayingVideo = $parent.hasClass('js-video-active');
	$(this).closest('.js-video-container').toggleClass("js-video-active", !isPlayingVideo);
	$parent.find(".js-video").trigger(isPlayingVideo ? 'pause' : 'play');
	$(this).toggleClass("active", isPlayingVideo);
});

/** Включить выключить звук на видео */
$(".js-video-mute").click(function(){
	var $parent = $(this).closest('.js-video-container');
	var isSoundVideo = $parent.hasClass('js-video-sound');
	$(this).closest('.js-video-container').toggleClass("js-video-sound", !isSoundVideo);
	$parent.find(".js-video").prop('muted', !isSoundVideo);
	$(this).toggleClass("active", isSoundVideo);
});

// Узнать сколько картинок в отзывах и задать нужную grid-сетку
$(".js-detect-grid").each(function(){
	let countChild = $(this).children().length;
	$(this).addClass("child-" + countChild);
});

// Задаем рейтинг продукта в звездочках
$(".js-rating").each(function(){
	let rating = $(this).data('rating');
	for(let i = 1; i < 6; i++){
		let icon = i <= rating ? "star-fill" : "star";
		$(this).append('<svg><use xlink:href="'+pathSprite+'#'+icon+'"/></svg>');
	}
});

let isFixedCard = false;
let fixedCard = $('.js-fixed-card');
// Фиксируем карточку товара
function fixedElementOnScroll(scrollTop) {
	let bottomAnchor = $(document).height() - h - (fixedCard.height() * 2);
	if((scrollTop > h && scrollTop < bottomAnchor && isFixedCard === false) || 
		 ((scrollTop < h || scrollTop > bottomAnchor) && isFixedCard === true)){
		isFixedCard = !isFixedCard;
		fixedCard.toggleClass('active', isFixedCard);
	}
}

/** Высчитываем высоту экрана чтоб использовать ее вместо обычного css vh. */
function detectVH() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}
detectVH();

$(window).resize(detectVH);

// Блок "Топ месяца". Открытие/закрытие выпадающего списка
$(".js-topOfMonth-trigger").click(function(){
	let isActive = $(this).hasClass("active");
	$(this).toggleClass("active", !isActive);
	$(".js-topOfMonth-content").slideToggle(300);
});

let isHideTopOfMonthBlock = false;
// Закрытие блока "Топ месяца" при клике вне блока
$(document).on(isMobile ? "touchend" : "mouseover", function (e) {
	if($(".js-topOfMonth-body").has(e.target).length === 0 && isHideTopOfMonthBlock === false){
	    isHideTopOfMonthBlock = true;
	    if($(".js-topOfMonth-trigger").hasClass("active")){
	    	$(".js-topOfMonth-content").slideToggle(150);
	    	$(".js-topOfMonth-trigger").removeClass("active");
	  	}
		}
});

/////////////////////////////////////////////////////////////////////////////////////////

$(document).on("click", function(e){
	if(e.ctrlKey){
		
	}
});

});