import { useState } from 'react'
import './App.css'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import HomePage from './pages/HomePage'

function App() {
  const [itemCount, setItemCount] = useState(0)
  const [amountInCart, setAmountInCart] = useState(0)

  const products = [
    { name: 'Bag', color: "brown", price: 89, id: 1 },
    { name: 'Baseball Cap', color: "grey", price: 29, id: 2 },
    { name: 'Phone Case', color: "beige", price: 19, id: 3 }
  ]

  function handleClickItem(price) {
    console.log("Adding " + price + " to total")
    setItemCount(itemCount+1)
    setAmountInCart(amountInCart + price)
  }

  function handleEmptyCart() {
    setItemCount(0)
    setAmountInCart(0)
  }

  const productList = products.map(product => 
    <li key={product.id}>
      <button  style={{ color: product.color }} onClick={() => {handleClickItem(product.price)}}>
        {product.name + " $" + product.price}
      </button>
    </li>
  )

  return (
    <>
      <div>
        <h3>Our products:</h3>
        <ul>{productList}</ul>
      </div>
      <h3>Items in cart: {itemCount}, total cost: ${amountInCart}</h3>
      <button onClick={handleEmptyCart}>Empty cart</button>
      {/* <Navbar/>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route />
        <Route />
        <Route />
        <Route />
      </Routes>
      <Footer/> */}
    </>
  )
}

export default App
