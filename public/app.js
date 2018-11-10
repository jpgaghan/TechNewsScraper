apiCalls = {
    newArticles: () => {
        document.getElementById("articles").innerHTML = "";
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
                    appendNews(response)
                });
                localStorage.setItem("z",z)
            };
        }
    },
    savedArticles: () => {
        $.get("/saved/news").then(results => {
            console.log(results);
            appendsavedNews(results);
        });
    },
    saveArticle: (e) => {
        link = e.currentTarget.dataset.link;
        date = e.currentTarget.dataset.date;
        title = e.currentTarget.dataset.title;
        story = e.currentTarget.dataset.story;
        image = e.currentTarget.dataset.image;
        note = "no current comment";
        console.log(link, date, title, story, image, note)
        $.post("/save/news", {link, date, title, story, image, note}).then(articleSaved=>{console.log(articleSaved)});
    },
    deleteArticle: (e) => {
        console.log(e)
        deleteId = e.currentTarget.dataset.id;
        $.post("/delete/news", {deleteId});
    },
    comment: (e) => {
        commentId = e.currentTarget.dataset.id;
        
        $.post("/comment/news", {commentId, note})
    },
    commentPopup: (e) => {
        deleteId = e.currentTarget.dataset.id;
        // Get the modal
        const modal = document.getElementById('myModal');

        // Get the button that opens the modal
        const btn = document.getElementById("myBtn");

        // Get the <span> element that closes the modal
        const span = document.getElementsByClassName("close")[0];

        // When the user clicks on the button, open the modal 
        btn.onclick = function() {
            modal.style.display = "block";
        };

        // When the user clicks on <span> (x), close the modal
        span.onclick = function() {
            modal.style.display = "none";
        };

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
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
    "#comment",
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
    console.log(response)
    let htmlString = '';
    document.getElementById("articles").innerHTML = htmlString;
    console.log(response)
    response.forEach(index => {
        htmlString += `
        <div class = "row"
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

