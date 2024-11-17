const paragraphs = document.querySelectorAll('p');
let colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
paragraphs.forEach((p, index) => p.style.color = colors[index % colors.length]);
