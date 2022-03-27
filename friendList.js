const BASE_URL = "https://lighthouse-user-api.herokuapp.com"
const Index_URL = BASE_URL + '/api/v1/users/'
const FRIEND_PRE_PAGE = 15

const dataPanel = document.querySelector('#data-panel')
const cardContainer = document.querySelector('#card-container')
const moreBtn = document.querySelector('#more-btn')
const searchContainer = document.querySelector('#search-container')
const textContainer = document.querySelector('#text-container')
const friendModal = document.querySelector('#modal-body')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const modalPanel = document.querySelector('.modal-content')
const pagination = document.querySelector('#pagination')




const friendCards = []
let filteredFriends = []



axios
    .get(Index_URL)
    .then(response => {
        friendCards.push(...response.data.results)
        renderFriendsList(getFriendByPage(1))
        renderPagination(friendCards.length)
    })
    .catch((err) => console.log(err))



function renderPagination(amount) {
    //全部的friendCards除以
    const numberOfPages = Math.ceil(amount / FRIEND_PRE_PAGE)
    let rawHTML = ''
    for (let i = 1; i <= numberOfPages; i++) {
        rawHTML += `<li class="page-item"><a class="page-link" data-id="${i}" href="#">${i}</a></li>`
    }
    // console.log(numberOfPages)
    pagination.innerHTML = rawHTML
}


function getFriendByPage(page) {

    const data = filteredFriends.length ? filteredFriends : friendCards
    const startIndex = (page - 1) * FRIEND_PRE_PAGE
    return data.slice(startIndex, startIndex + FRIEND_PRE_PAGE)
}


function addToFavorite(id) {
    const list = JSON.parse(localStorage.getItem('goodFriends')) || []
    const friend = friendCards.find((friend) => friend.id === id)
    if (list.some((friend) => friend.id === id)) {
        return alert('此人已經是好友')
    }
    list.push(friend)
    localStorage.setItem('goodFriends', JSON.stringify(list))
}


function renderFriendsList(data) {
    let friendList = ''
    data.forEach(friend => {
        friendList +=
            ` 
        <div class="card col-1 mx-3 mb-3 position-relative" style="width: 200px;" id='card-container'>
           <img src="${friend.avatar}" 
            data-bs-toggle="modal" 
            data-bs-target="#friend-modal"
             data-id="${friend.id}" id= 'card-img' class = 'card-img' alt="...">
            <div class="title ">
                <h2 class="name">${friend.name}</h2>
            </div>
        </div>
    </div>
        `
    })
    dataPanel.innerHTML = friendList
}


function showFriendModal(id) {
    const nameModal = document.querySelector('#modal-name')
    const emailModal = document.querySelector('#modal-email')
    const genderModal = document.querySelector('#modal-gender')
    const ageModal = document.querySelector('#modal-age')
    const birthdayModal = document.querySelector('#modal-birthday')
    const imageModal = document.querySelector('#modal-img')
    const regionModal = document.querySelector('#modal-region')
    const iconHeart = document.querySelector('#modal-header')
    axios
        .get(Index_URL + id)
        .then(response => {
            const data = response.data
            nameModal.innerHTML = data.name
            emailModal.innerHTML = "Email: " + data.email
            genderModal.innerHTML = "Gender: " + data.gender
            regionModal.innerHTML = "Region: " + data.region
            ageModal.innerHTML = "Age: " + data.age
            birthdayModal.innerHTML = "Birthday: " + data.birthday
            imageModal.innerHTML = `<img src="${data.avatar}" class='modal-img' alt="">`
            iconHeart.innerHTML = `<a href="#" style="text-decoration:none; font-size: 30px;" ;> <b class=" fa-heart"
            data-fa-transform="shrink-6 
            id="icon-heart"
             data-id="${data.id}"></b></a>`

            // console.log(data.id)
        })
}






pagination.addEventListener('click', function onPaginationClick(event) {
    const page = Number(event.target.dataset.id)
    renderFriendsList(getFriendByPage(page))
})



dataPanel.addEventListener('click', function onClickPanel(event) {
    const target = event.target
    if (target.matches('.card-img')) {
        showFriendModal(Number(target.dataset.id))
    }
})

modalPanel.addEventListener('click', function onModalClick(event) {
    const target = event.target
    if (target.matches('.fa-heart')) {
        // console.log(target.dataset.id)
        addToFavorite(Number(target.dataset.id))
    }
})

searchForm.addEventListener('keyup', function onFormSubmitted(event) {
    event.preventDefault()
    const keyword = searchInput.value.trim().toLowerCase()

    filteredFriends = friendCards.filter((friend) =>
        friend.name.toLowerCase().includes(keyword))
    if (!filteredFriends.length) {
        return
    }

    renderPagination(filteredFriends.length)
    renderFriendsList(getFriendByPage(1))
    // console.log(searchInput.value)
})