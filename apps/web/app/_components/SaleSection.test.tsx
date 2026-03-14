import { render, screen } from '@testing-library/react';
import SaleSection from './SaleSection';

const products = [
  {
    id: '1',
    name: 'Sale 1',
    description: 'd',
    price: 100,
    salePrice: 80,
    onSale: true,
    image: '/a.jpg',
    category: 'Cat',
    stock: 3,
    inStock: true,
  },
  {
    id: '2',
    name: 'Regular',
    description: 'd',
    price: 100,
    onSale: false,
    image: '/b.jpg',
    category: 'Cat',
    stock: 3,
    inStock: true,
  },
];

describe('SaleSection', () => {
  it('renders only products on sale', () => {
    render(<SaleSection products={products} />);

    expect(screen.getByText('Sale 1')).toBeInTheDocument();
    expect(screen.queryByText('Regular')).not.toBeInTheDocument();
  });

  it('does not render section when there are no sale products', () => {
    const { container } = render(
      <SaleSection
        products={products.map((product) => ({
          ...product,
          onSale: false,
        }))}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
