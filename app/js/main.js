$(function(){
    
    $('.rateyo').rateYo({
        rating: 5,
        starWidth: "14px",
        readOnly: true,
    });

    $('.product-slider__inner').slick({
        dots: true,
        arrows: false,
        slidesToShow: 4,
        slidesToScroll: 4,

    });





    var mixer = mixitup('.products__inner-box'); // Всегда должен быть в конце иначе не работает


    
});