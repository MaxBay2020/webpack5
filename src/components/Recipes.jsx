import React, {useState} from 'react';

const Recipes = () => {
    const [count, setCount] = useState(0);
    return (
        <div>
            <p>{count}</p>
            <button onClick={() => setCount(count+1)}>+</button>
        </div>
    );
};

export default Recipes;
