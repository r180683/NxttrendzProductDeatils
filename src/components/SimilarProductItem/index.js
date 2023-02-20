// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {similarProduct} = props
  const {imageUrl, title, price, brand, rating} = similarProduct

  return (
    <li className="sp-container">
      <img
        className="spd-image"
        alt={`similar product ${title}`}
        src={imageUrl}
      />
      <h1 className="spd-title">{title}</h1>
      <p className="spd-brand">{`by ${brand}`}</p>
      <div className="rating-price-container">
        <p className="spd-price">{`Rs ${price}/-`}</p>
        <button className="ratings-btn" type="button">
          <p>{rating}</p>
          <img
            className="star"
            alt="star"
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
          />
        </button>
      </div>
    </li>
  )
}

export default SimilarProductItem
