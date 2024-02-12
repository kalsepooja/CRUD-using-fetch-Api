
const cl = console.log;

const postForm = document.getElementById('postForm');
const titleControl = document.getElementById('title');
const contentControl = document.getElementById('content');
const userIdControl = document.getElementById('userId');
const postCardContainer = document.getElementById('postCardContainer');
const addBtn = document.getElementById('addBtn');
const updateBtn = document.getElementById('updateBtn');


let baseUrl = `https://xmlhttprequest-01-default-rtdb.asia-southeast1.firebasedatabase.app`;

let postUrl = `${baseUrl}/posts.json`;

const objToArray = (object) => {
    let postArray = [];
    for (const key in object) {
       let obj = object[key];
       obj.id = key;
       postArray.push(obj);
    }
    return postArray;
};

const createCards = (post => {
    let card = document.createElement("div");
    card.className = 'col-md-4';
    card.innerHTML = `
                    <div class="card" id="${post.id}">
                        <div class="card-header"">
                            <h2 class="mb-0">
                                ${post.title}
                            </h2>
                        </div>
                        <div class="card-body">
                            <p class="mb-0">
                                ${post.content}
                            </p>
                        </div>
                        <div class="card-footer d-flex justify-content-between">
                            <button class="btn btn-success" type="button" onclick="onEdit(this)">Edit</button>
                            <button class="btn btn-danger" type="button">Delete</button>
                        </div>
                    </div>    
                     `
                     postCardContainer.append(card);
});

const templatingOfCard = (posts => {
    posts.forEach(post => {
        createCards(post)
    })
});

const onPostSubmit = (eve => {
    eve.preventDefault();
    let newObj = {
        title: titleControl.value,
        content: contentControl.value,
        userId: userIdControl.value
    }
    cl(newObj)

    fetch(postUrl, {
        method: "POST",
        body: JSON.stringify(newObj),
        // id: newObj.name, 
        headers: {
            'Content-type': 'application/json',
            // 'Authorization': 'Bearer Token LocalStorage'
        }
    })
        .then((res) => {
            return res.json()
        })
        .then((data) => {
            cl(data)
            newObj.id = data.name;
            cl(data)
            createCards(newObj)
        })
        .catch(cl)
        .finally(() => {
            postForm.reset();
        })
});


const onEdit = (eve) => {
    cl(eve)
    let editId = eve.closest(".card").id;
    localStorage.setItem("editId", editId)
    cl(editId)
    let editUrl = `${baseUrl}/posts/${editId}.json`;
    cl(editUrl)

    fetch(editUrl, {
        method: "GET",
        headers: {
            'Content-type': 'application/json',
        }
    })
    .then((res) => {
        return res.json()
    })
    .then((res) => {
        cl(res)
        titleControl.value =res.title;
        contentControl.value = res.content;
        userIdControl.value = res.userId;

        updateBtn.classList.remove('d-none');
        addBtn.classList.add('d-none')
    })
    .catch(cl)
   
};

const onUpdateHandler = () => {
    let updatedObj = {
        title: titleControl.value,
        content: contentControl.value,
        userId: userIdControl.value
    }
    cl(updatedObj)
    let updatedId = localStorage.getItem("editId")
    let updatedUrl = `${baseUrl}/posts/${updatedId}.json`
    cl(updatedUrl)

    fetch(updatedUrl, {
        method: "PUT",
        headers: {
            'Content-type': 'application/json',
        }
    })
    .then((res) => {
        return res.json()
    })
    .then((res) => {
        cl(res)
        let getId = document.getElementById(updatedId);
        cl(getId)
        let card = [...getId.children];
        cl(card)
        card[0].innerHTML = `<h2>${res.title}</h2>`;
        card[1].innerHTML = `<p>${res.content}</p>`;



    })
}


fetch(postUrl)
    .then((res) => {
        return res.json();
    })
    .then((data) => {
        let postArray = objToArray(data);
        cl(postArray)
        templatingOfCard(postArray)
    });



    updateBtn.addEventListener("click", onUpdateHandler)
    postForm.addEventListener("submit", onPostSubmit)



    let array = [256, 621, 289]