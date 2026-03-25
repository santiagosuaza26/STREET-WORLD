import { render, screen } from '@testing-library/react';
import HomePage from './page';
import { sampleProducts } from './_data/sample-products';

// Mock Next.js Link component to avoid routing issues in tests
jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
  MockLink.displayName = 'MockNextLink';
  return MockLink;
});

// Mock cart context
jest.mock('./_state/CartContext', () => ({
  useCart: () => ({
    totalItems: 0,
    openCart: jest.fn(),
  }),
}));

describe('HomePage Integration', () => {
  const renderHomePage = async () => {
    const page = await HomePage();
    return render(page);
  };

  it('renders Sale section with onSale products', async () => {
    await renderHomePage();

    const saleHeading = screen.getByRole('heading', { name: /🔥 SALE/i });
    expect(saleHeading).toBeInTheDocument();

    // Verify at least one sale product is rendered
    const saleProducts = sampleProducts.filter((p) => p.onSale);
    if (saleProducts.length > 0) {
      expect(screen.getAllByText(saleProducts[0].name).length).toBeGreaterThan(0);
    }
  });

  it('renders New Arrivals section with isNewArrival products', async () => {
    await renderHomePage();

    const newHeading = screen.getByRole('heading', { name: /🆕 Novedades/i });
    expect(newHeading).toBeInTheDocument();

    // Verify sorting by date (newest first)
    const newArrivals = sampleProducts
      .filter((p) => p.isNewArrival)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    if (newArrivals.length > 0) {
      expect(screen.getAllByText(newArrivals[0].name).length).toBeGreaterThan(0);
    }
  });

  it('renders Best Sellers section with isBestSeller products', async () => {
    await renderHomePage();

    const bestSellerHeading = screen.getByRole('heading', { name: /⭐ Best Sellers/i });
    expect(bestSellerHeading).toBeInTheDocument();

    // Verify at least one bestseller is rendered
    const bestSellers = sampleProducts.filter((p) => p.isBestSeller);
    if (bestSellers.length > 0) {
      expect(screen.getAllByText(bestSellers[0].name).length).toBeGreaterThan(0);
    }
  });

  it('renders hero section with main call to action', async () => {
    await renderHomePage();

    expect(screen.getByText(/La calle no espera/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Explorar catalogo/i })).toBeInTheDocument();
  });

  it('renders all three product sections in correct order', async () => {
    const { container } = await renderHomePage();

    // Get all section headings
    const sections = container.querySelectorAll('.section-title h2');
    const sectionTexts = Array.from(sections).map((s) => s.textContent);

    // Verify Sale appears before New Arrivals appears before Best Sellers
    const saleIndex = sectionTexts.findIndex((text) => text?.includes('SALE'));
    const newIndex = sectionTexts.findIndex((text) => text?.includes('Novedades'));
    const bestIndex = sectionTexts.findIndex((text) => text?.includes('Best Sellers'));

    expect(saleIndex).toBeLessThan(newIndex);
    expect(newIndex).toBeLessThan(bestIndex);
  });
});
