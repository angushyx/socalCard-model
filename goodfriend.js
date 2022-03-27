const BASE_URL = "https://lighthouse-user-api.herokuapp.com"
const Index_URL = BASE_URL + '/api/v1/users/'

const dataPanel = document.querySelector('#data-panel')
const cardContainer = document.querySelector('#card-container')
const moreBtn = document.querySelector('#more-btn')
const searchContainer = document.querySelector('#search-container')
const textContainer = document.querySelector('#text-container')
const friendModal = document.querySelector('#modal-body')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const modalPanel = document.querySelector('.modal-content')


const friendCards = JSON.parse(localStorage.getItem('goodFriends'))
    // console.log(friendCards)

//修改成remove

function renderFriendsList(data) {
    let friendList = ''
    data.forEach(friend => {
        friendList +=
            `     
        <div class="card col-1 mx-3 mb-3 position-relative" style="width: 200px;" id='card-container'>
        <i class="bi bi-x-circle-fill position-absolute top-0 start-100 " data-id="${friend.id}"></i>
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

function removeFavorite(id) {
    const friendIndex = friendCards.findIndex((friend) => friend.id === id)
    friendCards.splice(friendIndex, 1)
    localStorage.setItem('goodFriends', JSON.stringify(friendCards))
    renderFriendsList(friendCards)
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
            imageModal.innerHTML = `<img src="${data.avatar}" class = 'modal-img'  alt="">`
            iconHeart.innerHTML = `<a href="#" style="text-decoration:none; font-size: 0px;" ;> <i class="fa-solid fa-heart-crack" data-id ="${data.id}"></i></a>
              `
        })
}


dataPanel.addEventListener('click', function onClickPanel(event) {
    const target = event.target
    if (target.matches('.card-img')) {
        showFriendModal(Number(target.dataset.id))
    } else if (target.matches('.bi')) {
        // console.log(Number(target.dataset.id))
        removeFavorite(Number(target.dataset.id))
    }
})

searchForm.addEventListener('keyup', function onFormSubmitted(event) {
    event.preventDefault()
    const keyword = searchInput.value.trim().toLowerCase()
    let filteredFriends = []
    filteredFriends = friendCards.filter((friend) =>
        friend.name.toLowerCase().includes(keyword))
    if (!filteredFriends.length) {
        return
    }
    renderFriendsList(filteredFriends)
})

renderFriendsList(friendCards)