import { render, screen } from '@testing-library/react';
import ProductCard from './ProductCard';

const baseProduct = {
  id: 'p1',
  name: 'Hoodie Andes',
  description: 'Test',
  price: 200000,
  onSale: false,
  image: '/hoodie.jpg',
  category: 'Hoodies',
  stock: 10,
  inStock: true,
};

describe('ProductCard', () => {
  it('shows regular price when product is not on sale', () => {
    render(<ProductCard product={baseProduct} />);

    expect(screen.getByText((content) => content.includes('200') && content.includes('000'))).toBeInTheDocument();
    expect(screen.queryByText(/-%/)).not.toBeInTheDocument();
  });

  it('shows sale badge and both prices when product has discount', () => {
    render(
      <ProductCard
        product={{
          ...baseProduct,
          onSale: true,
          salePrice: 150000,
        }}
      />,
    );

    expect(screen.getByText('-25%')).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes('200') && content.includes('000'))).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes('150') && content.includes('000'))).toBeInTheDocument();
  });

  it('shows out of stock badge when product is unavailable', () => {
    render(
      <ProductCard
        product={{
          ...baseProduct,
          inStock: false,
        }}
      />,
    );

    expect(screen.getByText('Agotado')).toBeInTheDocument();
  });
});
