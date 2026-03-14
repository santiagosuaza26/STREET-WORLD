import { render, screen } from '@testing-library/react';
import BestSellersSection from './BestSellersSection';

const products = [
  {
    id: '1',
    name: 'Bestseller 1',
    description: 'd',
    price: 100,
    onSale: false,
    isBestSeller: true,
    image: '/a.jpg',
    category: 'Cat',
    stock: 3,
    inStock: true,
  },
  {
    id: '2',
    name: 'Bestseller 2',
    description: 'd',
    price: 100,
    onSale: false,
    isBestSeller: true,
    image: '/b.jpg',
    category: 'Cat',
    stock: 3,
    inStock: true,
  },
  {
    id: '3',
    name: 'Not Bestseller',
    description: 'd',
    price: 100,
    onSale: false,
    isBestSeller: false,
    image: '/c.jpg',
    category: 'Cat',
    stock: 3,
    inStock: true,
  },
];

describe('BestSellersSection', () => {
  it('renders only bestseller products', () => {
    render(<BestSellersSection products={products} />);

    expect(screen.getByText('Bestseller 1')).toBeInTheDocument();
    expect(screen.getByText('Bestseller 2')).toBeInTheDocument();
    expect(screen.queryByText('Not Bestseller')).not.toBeInTheDocument();
  });

  it('limits display to 8 products', () => {
    const manyProducts = Array.from({ length: 15 }, (_, i) => ({
      id: `${i}`,
      name: `Bestseller ${i}`,
      description: 'd',
      price: 100,
      onSale: false,
      isBestSeller: true,
      image: '/a.jpg',
      category: 'Cat',
      stock: 3,
      inStock: true,
    }));

    render(<BestSellersSection products={manyProducts} />);

    const headings = screen.getAllByRole('heading', { level: 3 });
    expect(headings).toHaveLength(8);
  });

  it('does not render section when there are no bestseller products', () => {
    const { container } = render(
      <BestSellersSection
        products={products.map((product) => ({
          ...product,
          isBestSeller: false,
        }))}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
