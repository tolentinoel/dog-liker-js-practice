document.addEventListener("DOMContentLoaded", () => {
    const DOGSURL = "http://localhost:3000/dogs"

    fetchDogs()
    renderForm()

    function fetchDogs(){
    fetch(DOGSURL)
    .then(res=>res.json())
    .then(jsonData=> dogList(jsonData))
    }

    function renderForm(){
        const form = document.querySelector('form')
        const labelForm = document.createElement('h3')
        labelForm.innerText = 'Add a Dog!'
        form.appendChild(labelForm)

        form.innerHTML = `
            <div class="form-group">
            <h2> ADD A DOG!</h2>
                <label>Name:</label>
                <input name="dogname" type="text" class="form-control" placeholder="Dog name">

                <label>Breed:</label>
                <input name="breed" type="text" class="form-control" placeholder="Dog breed">

                <label>Image Url:</label>
                <input name="url" type="text" class="form-control" placeholder="URL">

                <button type="submit" class="btn btn-primary">Submit</button>
            </div>
        `
        form.addEventListener('submit', (e) => submitForm(e))
    }

    function submitForm(event){
        event.preventDefault()

        let newDog = document.querySelectorAll('.form-control')[0].value
        let newDogBreed = document.querySelectorAll('.form-control')[1].value
        let photo = document.querySelectorAll('.form-control')[2].value

        fetch("http://localhost:3000/dogs", {
            method:"POST",
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                likes: 0,
                name: `${newDog}`,
                breed: `${newDogBreed}`,
                image: `${photo}`,
                comments: ["FIRST COMMENT FOREVRAWR"]
            })
        })
        .then(resp => resp.json())
        .then(data =>renderEachDog(data))
        event.target.reset()
    }


    function dogList(dogArray) {

        dogArray.map(dog => {
            renderEachDog(dog)
        })
    }

    function renderEachDog(dogObj){

        const main = document.querySelector('main')
        const div = document.createElement('div')
        div.id = dogObj.id
        div.innerHTML =
            `<h2>${dogObj.name}</h2>
            <p>${dogObj.breed}</p>
            <img src='${dogObj.image}'></img>
            <p name='likecount'>Likes: ${dogObj.likes} </p>
            <p>Comments:</p>
            `
        const ul = document.createElement('ul')
        dogObj.comments.forEach(comment => {
            let li = document.createElement('li')
            li.innerText = `${comment}`
            ul.appendChild(li)
        })

        const form = document.createElement('form')
        form.id = 'theForm'
        form.innerHTML =
            `<label>Add Comment:</label>
            <input placeholder='text here' type='text' name='comment'></input>
            <input type='submit'></input>
            `
        const likeBtn = document.createElement('button')
        likeBtn.innerText = "Like"
        likeBtn.addEventListener('click', (e)=> likeHandler(e, dogObj))

        const superLikeBtn = document.createElement('button')
        superLikeBtn.innerText = `~SUPERLIKE~`
        superLikeBtn.addEventListener('click', (e)=> superLike(e, dogObj))

        div.appendChild(likeBtn)
        div.appendChild(superLikeBtn)
        div.appendChild(ul)
        div.appendChild(form)
        main.appendChild(div)

        form.addEventListener('submit', (ev) => addComment(ev, dogObj))
    }

    function likeHandler(ev, dog){
        // console.log(ev)
        // console.log(dog)
        let like = ev.target.parentNode.querySelectorAll('p')[1]
        const newNumLikes = {
            likes: dog.likes += 1
        }

        fetch(DOGSURL + `/${dog.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type" : "application/json",
                "Accept" : "application/json"
            },
            body: JSON.stringify(newNumLikes)
        })
        .then(resp => resp.json())
        .then(data => {
            like.innerHTML =  `Likes: ${data.likes}`
        })
    }

    function superLike(ev, dog){
        dog.likes += 10
        let likes = dog.likes

        fetch(DOGSURL + `/${dog.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type" : "application/json",
                "Accept" : "application/json"
            },
            body: JSON.stringify({
                likes: likes
            })
        })
        .then(resp => resp.json())
        .then(data => {
            let like = ev.target.parentNode.querySelectorAll('p')[1]
            like.innerText =  `Likes: ${data.likes}`
        })
    }

    function addComment(ev, dog){
        ev.preventDefault()

        let array = dog.comments
        array.push(ev.target.comment.value)
        let newData = {comments: array}

        fetch(DOGSURL + `/${dog.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type" : "application/json",
                    "Accept" : "application/json"
                },
                body: JSON.stringify(newData)
            })
        .then(resp => resp.json())
        .then(data => {
            data.innerText = " "
            const ul = ev.target.parentNode.querySelector('ul')
            let li = document.createElement('li')
            data.comments.forEach(comment => {
                li.innerText = `${comment}`
                ul.appendChild(li)
            })
            // ul.innerHTML += `<li>${data.comments.slice(data.comments.length-1)}</li>`
        })
        ev.target.reset()

    }

})

