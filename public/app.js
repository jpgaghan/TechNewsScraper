apiCalls = {
    newArticles: () => {
        document.getElementById("articles").innerHTML = "";
        for (let i =1; i<4; i++) {
            if (localStorage.getItem("z") === null) {
                let z = 1;
                localStorage.setItem("z",z)
                $.post("new/news", { z })
                .then(response => {
                    appendNews(response)
                });
            } else {
                z = parseInt(localStorage.getItem("z")) + 1 ;
                $.post("new/news", { z })
                .then(response => {
                    appendNews(response)
                });
                localStorage.setItem("z",z)
            };
        }
    },
    savedArticles: () => {
        $.get("/saved/news").then(results => {
            appendsavedNews(results);
        });
    },
    saveArticle: (e) => {
        link = e.currentTarget.dataset.link;
        date = e.currentTarget.dataset.date;
        title = e.currentTarget.dataset.title;
        story = e.currentTarget.dataset.story;
        image = e.currentTarget.dataset.image;
        // note = "no current comment";
        $.post("/save/news", {link, date, title, story, image}).then(articleSaved=>{console.log(articleSaved)});
    },
    deleteArticle: (e) => {
        console.log(e)
        deleteId = e.currentTarget.dataset.id;
        $.post("/delete/news", {deleteId});
    },
    comment: (e) => {
        commentId = e.currentTarget.dataset.id;
        note = document.getElementById('commentadd').value;
        $.post("/comment/news", {commentId, note}).then(results => {
            console.log(results)
            let htmlString = "";
            let count = 0;
            count = document.querySelectorAll('#commentsection .card-header').length;
            htmlString += 
            `<div id = "${results._id}" class = "row"
            <div class="card col-12">
                <div><h5 class="card-header">comment ${count+1}</h5></div>
                <div class="card-body">
                    <div class="card-text">${results.note}</div>
                    <button data-id="${results._id}">Delete</button>
                </div>
            </div>
        </div>`;
    document.getElementById("commentsection").innerHTML += htmlString;
    });
    },
    commentPopup: (e) => {
        deleteId = e.currentTarget.dataset.id;
        // Get the modal
        const commentadd = document.querySelector('#addcomment');
        commentadd.dataset.id = deleteId;
        const modal = document.getElementById('myModal');

        // Get the button that opens the modal
        const btn = document.getElementById("myBtn");

        // Get the <span> element that closes the modal
        const span = document.getElementsByClassName("close")[0];

        // When the user clicks on the button, open the modal 
        btn.onclick = function() {
            console.dir(btn);
            let commentId = btn.dataset.id;
            $.post("/append/comments", {commentId}).then(results =>  { 
                console.log(results)
                results.forEach(index => {
                    let htmlString = "";
                    let count = 0;
                    count = document.querySelectorAll('#commentsection .card-header').length;
                    htmlString += 
                    `<div id = "${index._id}" class = "row"
                        <div class="card col-12">
                            <div><h5 class="card-header">comment ${count+1}</h5></div>
                            <div class="card-body">
                                <div class="card-text">${index.note}</div>
                                <button id = "deletecomment" data-id="${index._id}">Delete</button>
                            </div>
                        </div>
                    </div>`;
                    document.getElementById("commentsection").innerHTML += htmlString;
                });
            });
            modal.style.display = "block";
        };

        // When the user clicks on <span> (x), close the modal
        span.onclick = function() {
            modal.style.display = "none";
            document.getElementById("commentsection").innerHTML = '';
        };

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
                document.getElementById("commentsection").innerHTML = '';
            }
        };
    }
};

// listeners
$(document).on(
    "click",
    "#newarticles",
    (e) => {
        e.preventDefault();
        apiCalls.newArticles();
    }
);

$(document).on(
    "click",
    "#deletecomment",
    (e) => {
        e.preventDefault();
        id = e.currentTarget.dataset.id;
        $.post("/delete/comment", {id}).then(
            document.getElementById(id).remove()
        )
    }
)
$(document).on(
    "click",
    "#save",
    (e) => {
        e.preventDefault();
        apiCalls.saveArticle(e);
    }   
);

$(document).on(
    "click",
    "#archive",
    (e) => {
        e.preventDefault();
        apiCalls.savedArticles();
    }
);

$(document).on(
    "click",
    "#delete",
    (e) => {
        e.preventDefault();
        apiCalls.deleteArticle(e);
    }
);

$(document).on(
    "click",
    "#addcomment",
    (e) => {
        e.preventDefault();
        apiCalls.comment(e);
    }
);
$(document).on(
    "click",
    "#myBtn",
    (e) => {
        e.preventDefault();
        apiCalls.commentPopup(e);
    }
);

appendNews = (response) => {
    let htmlString = '';
    document.getElementById("articles").innerHTML = htmlString;
    response.forEach(index => {
        htmlString += `
        <div class = "row"
            <div class="card col-12">
                <div><a href="${'https://www.thestar.com.my/' + index.link}"><h5 class="card-header">${index.title}</h5></a></div>
                <div class="card-body">
                    <div class="card-text">${index.story}</div>
                    <a href="" class="btn btn-primary mt-3" id="save" data-date="${index.date}" data-title="${index.title}" 
                    data-link="${'https://www.thestar.com.my/' + index.link}" data-story="${index.story}" data-image="${index.image}"
                    data-note="${index.note}">Save Article</a>
                </div>
            </div>
        </div>`
    document.getElementById("articles").innerHTML = htmlString;
    });
};

appendsavedNews = (response) => {
    let htmlString = '';
    document.getElementById("articles").innerHTML = htmlString;
    response.forEach(index => {
        htmlString += `
        <div id = "${index._id}" class = "row"
            <div class="card col-12">
                <div><a href="${index.link}"><h5 class="card-header">${index.title}</h5></a></div>
                <div class="card-body">
                    <div class="card-text">${index.story}</div>
                    <button class="btn btn-primary mt-3" id="delete" data-id="${index._id}">Delete Article</button>
                    <button class="btn btn-primary mt-3" id="myBtn" data-id="${index._id}">Comment</button>
                </div>
            </div>
        </div>`
    });
    document.getElementById("articles").innerHTML = htmlString;
};

Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}