// Write your code here
import {withRouter} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {Component} from 'react'
import {FaRegPlusSquare, FaMinusSquare} from 'react-icons/fa'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const apiStatusList = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class ProductItemDetails extends Component {
  state = {apiStatus: apiStatusList.initial, productDetails: {}, quantity: 1}

  componentDidMount() {
    this.getProductDetails()
  }

  getProductDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    console.log(id)
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {Authorization: `Bearer ${jwtToken}`},
    }
    const response = await fetch(url, options)
    console.log(response)
    if (response.status_code === 200 || response.status === 200) {
      const data = await response.json()
      console.log(data)
      const updatedData = {
        id: data.id,
        price: data.price,
        description: data.description,
        imageUrl: data.image_url,
        title: data.title,
        brand: data.brand,
        totalReviews: data.total_reviews,
        rating: data.rating,
        availability: data.availability,
        similarProducts: data.similar_products.map(each => ({
          id: each.id,
          title: each.title,
          imageUrl: each.image_url,
          style: each.style,
          price: each.price,
          description: each.description,
          brand: each.brand,
          totalReviews: each.total_reviews,
        })),
      }
      this.setState({
        productDetails: updatedData,
        apiStatus: apiStatusList.success,
      })
    } else if (response.status_code === 404 || response.status === 404) {
      this.setState({apiStatus: apiStatusList.failure})
    }
  }

  cickContinueShop = () => {
    const {history} = this.props
    history.replace('/products')
  }

  renderOnFailureApi = () => (
    <div className="failure-container">
      <img
        className="error-image"
        alt="error view"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
      />
      <h1 className="product-not-found-head">Product Not Found</h1>
      <button
        onClick={this.cickContinueShop}
        className="continue-shop-btn"
        type="button"
      >
        Continue Shopping
      </button>
    </div>
  )

  increaseQuantity = () => {
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
  }

  decreaseQuantity = () => {
    this.setState(prevState => ({quantity: prevState.quantity - 1}))
  }

  renderOnSuccessApi = () => {
    const {productDetails} = this.state
    console.log(productDetails)
    const {quantity} = this.state
    const {
      price,
      description,
      title,
      imageUrl,
      brand,
      totalReviews,
      rating,
      availability,
      similarProducts,
    } = productDetails
    return (
      <div className="success-container">
        <div className="pd-container">
          <img className="pd-image" alt="product" src={imageUrl} />
          <div className="pd-text-container">
            <h1 className="pd-title">{title}</h1>
            <p className="pd-price">{`Rs ${price}/-`}</p>
            <div className="ratings-review-container">
              <button className="ratings-btn" type="button">
                <p>{rating}</p>
                <img
                  className="star"
                  alt="star"
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                />
              </button>
              <p className="pd-review">{`${totalReviews} Reviews`}</p>
            </div>
            <p className="pd-description">{description}</p>
            <p className="available">
              Available: <span className="span">{availability}</span>
            </p>
            <p className="available">
              Brand: <span className="span">{brand}</span>
            </p>
            <div className="pd-quantity-container">
              <button
                className="icon-btn"
                onClick={this.decreaseQuantity}
                type="button"
              >
                <FaMinusSquare className="plus-icon" />
              </button>
              <p className="pd-quantity">{quantity}</p>
              <button
                className="icon-btn"
                onClick={this.increaseQuantity}
                type="button"
              >
                <FaRegPlusSquare className="plus-icon" />
              </button>
            </div>
            <button className="add-cart-btn" type="button">
              ADD TO CART
            </button>
          </div>
        </div>
        <div className="similar-pds-container">
          <h1 className="similar-products-head">Similar Products</h1>
          <ul className="spds-container">
            {similarProducts.map(each => (
              <SimilarProductItem similarProduct={each} key={each.id} />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderLoading = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderProductDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusList.initial:
        return this.renderLoading()
      case apiStatusList.success:
        return this.renderOnSuccessApi()
      case apiStatusList.failure:
        return this.renderOnFailureApi()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="product-details-container">
        <Header />
        {this.renderProductDetails()}
      </div>
    )
  }
}

export default withRouter(ProductItemDetails)
