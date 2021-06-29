const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content //Para acceder a los elementos
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()
let carrito = {}

document.addEventListener('DOMCContentLoaded',()=>{fetchdata()})
cards.addEventListener('click',e => {addCarrito(e)})//para detectar el click

const fetchdata = async()=>{
        try {
            const resp = await fetch('https://api.mercadolibre.com/sites/MLM/search?category=MLM1648');
            const data = await resp.json();
            let result = data.results;  
            console.log(result)
            result.forEach(element =>{
                templateCard.querySelector('img').setAttribute("src",element.thumbnail)
                templateCard.querySelector('h5').textContent = element.title
                templateCard.querySelector('p').textContent = `$ ${element.price}`
                templateCard.querySelector('.btn-dark').dataset.id = element.id
                const clone = templateCard.cloneNode(true)
                fragment.appendChild(clone)
            })
            cards.appendChild(fragment)
        } catch (error) {
            console.log(error)
        }
    }
fetchdata();
const addCarrito = e =>{
    //console.log(e.target)
    if(e.target.classList.contains('btn-dark')){
        setCarrito(e.target.parentElement)
    } e.stopPropagation()//Para detenercualquier otro evento que se podría generar en cards
     //True o False si contiene la clase indicada
}
const setCarrito = objeto => {
    const producto = {
        id: objeto.querySelector('.btn-dark').dataset.id,
        title: objeto.querySelector('h5').textContent,
        price: objeto.querySelector('p').textContent,
        cantidad: 1
    }
    if(carrito.hasOwnProperty(producto.id)){
        producto.cantidad = carrito[producto.id].cantidad + 1
    }
    carrito[producto.id] = {...producto}
    pintarCarrito();
}

const pintarCarrito = ()=>{
    console.log(carrito)
    items.innerHTML = ''
    Object.values(carrito).forEach(producto =>{
        templateCarrito.querySelector('th').textContent = producto.title
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.price
        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)
    pintarFooter();
}

const pintarFooter = () => {
    footer.innerHTML = ''
    if(Object.keys(carrito).length === 0){
    footer.innerHTML = `<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>`
    return
    }
const nCantidad = Object.values(carrito).reduce((acc,{cantidad}) => acc + cantidad,0)
const nPrecio = Object.values(carrito).reduce((acc,{cantidad, price}) => acc + cantidad * price,0)
console.log(nCantidad)
console.log(nPrecio)

templateFooter.querySelectorAll('td')[0].textContent = nCantidad
templateFooter.querySelector('span').textContent = nPrecio

const clone = templateFooter.cloneNode(true)
fragment.appendChild(clone)
footer.appendChild(fragment)

const btnVaciar = document.getElementById('vaciar-carrito')
btnVaciar.addEventListener('click',()=>{
    carrito = {}
    pintarCarrito()
})
}