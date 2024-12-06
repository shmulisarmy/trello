
const oberserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            console.log(entry);
            const function_string = entry.target.getAttribute('on_intersect');
            const func = new Function("event", function_string).bind(entry.target);
            func(entry);
        }
    })
})


const on_first_oberserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            console.log(entry);
            const function_string = entry.target.getAttribute('on_first_intersect');
            const func = new Function("event", function_string).bind(entry.target);
            func(entry);
            on_first_oberserver.unobserve(entry.target);
        }
    })
})

document.addEventListener('DOMContentLoaded', () => {

    
    document.querySelectorAll('[on_intersect]').forEach(element => {
        oberserver.observe(element);
    })
    document.querySelectorAll('[on_first_intersect]').forEach(element => {
        on_first_oberserver.observe(element);
    });
})