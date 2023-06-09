import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BASEURL } from '../api';
import { useLocalStorage } from '../storage';

export function GetProduct() {
  const [selectedItems, setSelectedItems, , clearStorage] = useLocalStorage('selected_items', []);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  let { id } = useParams();

  useEffect(() => {
    async function getData(url) {
      try {
        setIsLoading(true);
        setIsError(false);

        const response = await fetch(url);
        const json = await response.json();

        setData(json);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }

    getData(`${BASEURL}/${id}`);
  }, [id]);

  if (isLoading || !data) {
    return <div>Loading</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  console.log(data);

  const handleAddItem = (item) => {
    setSelectedItems((prevItems) => {
      const updatedItems = { ...prevItems };
      if (updatedItems[item.id]) {
        updatedItems[item.id].quantity += 1;
      } else {
        updatedItems[item.id] = { ...item, quantity: 1 };
      }
      return updatedItems;
    });
  };

  const displayCurrentPrice = () => {
    if (data.discountedPrice < data.price) {
      return data.discountedPrice.toFixed(2);
    } else {
      return data.price.toFixed(2);
    }
  };

  const displayReviews = () => {
    if (data.reviews && data.reviews.length > 0) {
      return (
        <div>
          <h3>Reviews</h3>
          {data.reviews.map((review, index) => (
            <div className='reviews'>
                <h4 key={index}>{review.username}</h4>
                <p key={index}>{review.description}</p>
            </div>
            
          ))}
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className='singleProduct'>
      <h1>{data.title}</h1>
      <img src={data.imageUrl} alt="product" />
      <p>Price: {displayCurrentPrice()}</p>
      <button className='btn-primary' onClick={() => handleAddItem(data)}>Add to cart</button>
      <p>{data.description}</p>
      <div>{displayReviews()}</div>
    </div>
  );
}

