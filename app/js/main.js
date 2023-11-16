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

    $('.product-one__tabs .tab').on('click', function(event) {
        var id = $(this).attr('data-id');
        $('.product-one__tabs').find('.tab-item').removeClass('active-tab').hide();
        $('.product-one__tabs .tabs').find('.tab').removeClass('active');
        $(this).addClass('active');
        $('#' + id).addClass('active-tab').fadeIn();
        return false;
    });




    var mixer = mixitup('.products__inner-box'); // Всегда должен быть в конце иначе не работает


    
});