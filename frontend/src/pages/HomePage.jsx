import { useEffect, useState } from "react";
import { getItems } from "../api/itemsApi";
import ProductCard from "../components/products/ProductCard";

export default function HomePage() {

  const [items, setItems] = useState([]);

  useEffect(() => {

    const loadItems = async () => {
      const data = await getItems();
      setItems(data.items || data);
    };

    loadItems();

  }, []);

  return (
    <div>

      <h1>Marketplace</h1>

      <div className="products-grid">

        {items.map((item) => (
          <ProductCard key={item.id} item={item} />
        ))}

      </div>

    </div>
  );
}