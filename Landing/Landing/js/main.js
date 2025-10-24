document.addEventListener('DOMContentLoaded', () => {
    let controller = new ScrollMagic.Controller();

    let timeline = new TimelineMax();
    timeline
    .to('#sixth', 6, {
        y: -700
    })
    .to('#fifth', 6, {
        y: -500
    }, '-=6')
    .to('#forth', 6, {
        y: -400
    }, '-=6')
    .to('#third', 6, {
        y: -300
    }, '-=6')
    .to('#second', 6, {
        y: -200
    }, '-=6')
    .to('#first', 6, {
        y: -100
    }, '-=6')
    .to('.content, .blur', 6, {
        top: '0%'
    }, '-=6')
    .to('.title, .subtitle, nav, .footer-wrapper', 6, {
        y: -600,
    }, '-=6')
    .to('#feedconnect-section', 8, {
        y: -100,
        autoAlpha: 1
    }, '-=8')
    .to('#empowerbridge-section', 8, {
        y: -100,
        autoAlpha: 1
    }, '-=8')
    .to('#edubridge-section', 8, {
        y: -100,
        autoAlpha: 1
    }, '-=8')
    .to('#feedconnect-section .circle-image', 6, {
        rotation: 360,
        scale: 1.1,
        ease: Power2.easeOut
    }, '-=6')
    .to('#empowerbridge-section .circle-image', 6, {
        rotation: -360,
        scale: 1.1,
        ease: Power2.easeOut
    }, '-=6')
    .to('#edubridge-section .circle-image', 6, {
        rotation: 360,
        scale: 1.1,
        ease: Power2.easeOut
    }, '-=6')
    .from('#feedconnect-section .section-title', 3, {
        x: -100,
        autoAlpha: 0,
        ease: Power2.easeOut
    }, '-=5')
    .from('#feedconnect-section .section-subtitle', 3, {
        x: -100,
        autoAlpha: 0,
        ease: Power2.easeOut
    }, '-=4.5')
    .from('#empowerbridge-section .section-title', 3, {
        x: 100,
        autoAlpha: 0,
        ease: Power2.easeOut
    }, '-=5')
    .from('#empowerbridge-section .section-subtitle', 3, {
        x: 100,
        autoAlpha: 0,
        ease: Power2.easeOut
    }, '-=4.5')
    .from('#edubridge-section .section-title', 3, {
        x: -100,
        autoAlpha: 0,
        ease: Power2.easeOut
    }, '-=5')
    .from('#edubridge-section .section-subtitle', 3, {
        x: -100,
        autoAlpha: 0,
        ease: Power2.easeOut
    }, '-=4.5')
    .from('.one', 3, {
        top: '40px',
        autoAlpha: 0
    }, '-=4')
    .from('.two', 3, {
        top: '40px',
        autoAlpha: 0
    }, '-=3.5')
    .from('.three', 3, {
        top: '40px',
        autoAlpha: 0
    }, '-=3.5')
    .from('.four', 3, {
        top: '40px',
        autoAlpha: 0
    }, '-=3.5')
    .from('.text', 3, {
        y: 60,
        autoAlpha: 0
    }, '-=4')

    let scene = new ScrollMagic.Scene({
        triggerElement: 'section',
        duration: '400%',
        triggerHook: 0
    })
    .setTween(timeline)
    .setPin('section')
    .addTo(controller);
})