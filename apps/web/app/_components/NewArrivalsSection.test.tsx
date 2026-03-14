import { render, screen } from '@testing-library/react';
import NewArrivalsSection from './NewArrivalsSection';

const products = [
  {
    id: '1',
    name: 'Older New',
    description: 'd',
    price: 100,
    onSale: false,
    isNewArrival: true,
    image: '/a.jpg',
    category: 'Cat',
    stock: 3,
    inStock: true,
    createdAt: '2026-02-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Newest',
    description: 'd',
    price: 100,
    onSale: false,
    isNewArrival: true,
    image: '/b.jpg',
    category: 'Cat',
    stock: 3,
    inStock: true,
    createdAt: '2026-02-27T00:00:00Z',
  },
  {
    id: '3',
    name: 'Not New',
    description: 'd',
    price: 100,
    onSale: false,
    isNewArrival: false,
    image: '/c.jpg',
    category: 'Cat',
    stock: 3,
    inStock: true,
    createdAt: '2026-02-28T00:00:00Z',
  },
];

describe('NewArrivalsSection', () => {
  it('renders only new arrival products', () => {
    render(<NewArrivalsSection products={products} />);

    expect(screen.getByText('Older New')).toBeInTheDocument();
    expect(screen.getByText('Newest')).toBeInTheDocument();
    expect(screen.queryByText('Not New')).not.toBeInTheDocument();
  });

  it('sorts new products by createdAt descending', () => {
    render(<NewArrivalsSection products={products} />);

    const productNames = screen.getAllByRole('heading', { level: 3 }).map((element) => element.textContent);
    expect(productNames[0]).toBe('Newest');
    expect(productNames[1]).toBe('Older New');
  });
});
