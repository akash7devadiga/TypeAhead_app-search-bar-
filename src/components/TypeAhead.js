import { useEffect, useRef, useState } from "react";

const STATE = {
  SUCCESS: 'SUCCESS',
  LOADING: 'LOADING',
  ERROR: 'ERROR'
}

const TypeAhead = () => {
  const cache = useRef({});
  const [query, setQuery] = useState("");
  const [productData, setProductData] = useState([]);
  const [status, setStatus] = useState(STATE.LOADING);
  const hQuery = (event) => setQuery(event.target.value);
  const abortController = new AbortController();

  const { signal } = abortController;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setStatus(STATE.LOADING)
        if (cache.current[query]) {
          console.log("value retrieved from the cache");
          setProductData(cache.current[query]);
          setStatus(STATE.SUCCESS)
          return;
        }

        const res = await fetch(`https://dummyjson.com/products/search?q=${query}`, { signal });
        console.log('Value fetched from API call');

        const data = await res.json();
        setStatus(STATE.SUCCESS);
        cache.current[query] = data.products;
        setProductData(data.products);

      }
      catch (error) {
        console.log(error.name);
        // eslint-disable-next-line no-undef
        if (error.name !== AbortError)
          setStatus(STATE.ERROR);
      }
    }


    let intervalId = setTimeout(() => { fetchData() }, 1000);

    return () => {
      clearInterval(intervalId);
      abortController.abort();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);




  return (
    <div className="container">
      <input type="text" placeholder="Enter your query here" value={query} onChange={hQuery} />
      {status === 'ERROR' && <div>Error occurred!!!</div>}
      {status === 'LOADING' && <div>Loading...</div>}
      {status === 'SUCCESS' && (
        <ul>
          {
            productData.map((product, index) => (
              <li key={product.id}>
                {product.title}
              </li>
            ))
          }
        </ul>
      )}


    </div>


  );
}

export default TypeAhead;