apiCalls = {
    newArticles: () => {
        console.log('Ive been called')
        for (let i =1; i<4; i++) {
            if (localStorage.getItem("z") === null) {
                let z = 1;
                localStorage.setItem("z",z)
                $.post("new/news", { z })
                .then(response => {
                    console.dir(response);
                    appendNews(response)
                });
            } else {
                z = parseInt(localStorage.getItem("z")) + 1 ;
                $.post("new/news", { z })
                .then(response => {
                    console.dir(response);
                    appendNews(response)
                });
                localStorage.setItem("z",z)
                console.log(z)
            };
        }
    },
    savedArticles: () => {
        $.get("saved/news").then(results => {
            console.log(results);
        });
    },
    saveArticle: () => {
        link = this.dataset.link;
        date = this.dataset.date;
        title = this.dataset.title;
        story = this.dataset.story;
        image = this.dataset.image;
        note = this.dataset.note;
        $.post("save/news", {link, date, title, story, image, note});
    },
    deleteArticle: () => {
        deleteId = this.dataset.id;
        $.post("delete/news", {deleteId});
    }
};

// listeners
// document.getElementById("newarticles").addEventListener("click", () => apiCalls.newArticles);
// document.getElementById("archive").addEventListener("click", apiCalls.savedArticles);
// document.getElementsByClassName("save").addEventListener("click", apiCalls.saveArticle);
// // document.getElementsByClassName("delete").addEventListener("click", apiCalls.deleteArticle);
$(document).on(
    "click",
    "#newarticles",
    (e) => {
        e.preventDefault();
        apiCalls.newArticles();
});

$(document).on(
    "click",
    "#newarticles",
    (e) => {
        e.preventDefault();
        apiCalls.newArticles();
});
// $(document).on("click")
let htmlString = '';
appendNews = (response) => {
    response.forEach(index => {
        htmlString += `
        <div class = "row"
            <div class="card col-12">
                <a href="${index.link}"><h5 class="card-header">${index.title}</h5></a>
                <div class="card-body">
                    <p class="card-text">${index.story}</p>
                    <a href="" class="btn btn-primary" id="save" data-date="${index.date}" data-title="${index.title}" 
                    data-link="${index.link}" data-story="${index.story}" data-image="${index.image}"
                    data-note="${index.note}">Save Article</a>
                </div>
            </div>
        </div>`
    });
    console.log(htmlString)
    document.getElementById("articles").innerHTML = htmlString;
}