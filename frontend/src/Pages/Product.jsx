import React, { useContext, useEffect, useState } from 'react'
import Breadcrums from '../Components/Breadcrums/Breadcrums'
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay'
import DescriptionBox from '../Components/DescriptionBox/DescriptionBox'
import RelatedProducts from '../Components/RelatedProducts/RelatedProducts'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../Context/ShopContext'

const Product = () => {
  const { products, getCategoryById } = useContext(ShopContext);
  const { productId } = useParams();
  const [product, setProduct] = useState(false);
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    const prod = products.find((e) => e.id === Number(productId));
    setProduct(prod);
    if (prod) {
      (async () => {
        const categoryName = await getCategoryById(prod.categoryId);
        setCategoryName(categoryName);
      })();
    }
  }, [products, productId, getCategoryById]);

  return product ? (
    <div>
      <Breadcrums product={product} cat={categoryName} />
      <ProductDisplay product={product} />
      <DescriptionBox product={product} />
      <RelatedProducts id={product.id} category={product.categoryId} />
    </div>
  ) : null
}

export default Product
