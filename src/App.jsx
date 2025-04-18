import {useState} from 'react'
import bigImage from './assets/1.png'
import smallImage from './assets/2.png'
import Recipes from "./components/Recipes";

function App() {

    // console.log(bigImage)
    // console.log(smallImage)



    return (
        <div className='hero'>
            <h1>Hello, React!</h1>
            <p>Welcome to your React app boilerplate!!!😂</p>

            <h2>大图：</h2>
            <img src={bigImage} alt="Big" width={300} />

            <h2>小图：</h2>
            <img src={smallImage} alt="Small" width={100} />

            <Recipes />


        </div>
    )
}

export default App